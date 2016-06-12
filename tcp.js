#!/usr/bin/env node
'use strict'
/*
 * Binary Protocol server.
 * Require Node.js 6.2.x
 */
const Promise = require('bluebird')
const util = require('util')
const net = require('net')
const pg = require('pg-promise')({
  promiseLib: Promise
})
const Redis = require('ioredis')
const lru = require('lru-cache')({
  max: 500,
  length: (n) => n.length
})
const { Parser } = require('binary-parser')

// make pg return text timestamp
pg.pg.types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

const db = pg('postgres://postgres:postgres@127.0.0.1/hedgehog')
const redis = new Redis()

const ACK = 0x00
const NACK = 0x01
const LOGIN = 0x02
const REPORT = 0x03
const CONTROL = 0x04
const LOGOUT = 0x05

const ACK_PACKET = Buffer.from([ACK])
const NACK_PACKET = Buffer.from([NACK])

const debuggers = []

// parsers
const loginParser = new Parser().endianess('little')
                                .uint8('type')
                                .uint32('id')
                                .string('key', {
                                  length: 32,
                                  stripNull: true
                                })
const rawReportParser = new Parser().endianess('little')
                                    .uint8('type')
                                    .uint32('device_id')

const parsers = {}

const query = Promise.coroutine(function* (sql, params) {
  return yield db.query(sql, params)
})

const writeSocket = (socket, data) => {
  try {
    if (socket && socket.write) {
      socket.write(data)
    }
  } catch (err) {
    perror('Error when writing to socket, ' + err.message)
  }
}

const pinfo = (msg) => {
  msg = '<INFO> ' + util.inspect(msg)
  console.log(msg)
  for (let i = 0; i < debuggers.length; ++i) {
    if (debuggers) {
      writeSocket(debuggers[i], msg + "\r\n")
    }
  }
}

const perror = (msg) => {
  msg = '<ERROR> ' + util.inspect(msg)
  console.error(msg)
  for (let i = 0; i < debuggers.length; ++i) {
    if (debuggers) {
      writeSocket(debuggers[i], msg + "\r\n")
    }
  }
}

let socketTotal = 0

const getDeviceParser = Promise.coroutine(function* (device_id) {
  const results = yield query('SELECT fields FROM device_types WHERE id = (SELECT device_type_id FROM devices WHERE id = $1 LIMIT 1)', [device_id])
  if (results.length > 0) {
    let parser = new Parser().endianess('little')
                             .uint8('type')
                             .uint32('device_id')
                             .uint32('reserved')
    results[0].fields.forEach(e => {
      if (e.type === 'string') {
        parser = parser.string(e.name, {
          length: e.length,
          stripNull: true
        })
      } else if (e.type === 'int') {
        parser = parser.int32(e.name)
      } else if (e.type === 'float') {
        parser = parser.float(e.name)
      }
    })
    return parser
  } else {
    return null
  }
})

const report = Promise.coroutine(function* (device_id, data) {
  const results = yield query('INSERT INTO datas(device_id, data) VALUES ($1, $2) RETURNING id, created_at', [device_id, data])
  // publish update
  redis.publish(`hedgehog:device:${device_id}:update`, JSON.stringify({
    id: results[0].id,
    data,
    created_at: results[0].created_at
  }))
  // set active
  redis.setex(`hedgehog:device:${device_id}:active`, 120, 1)
  return results[0].id
})

const subscribe = (device_id, socket) => {
  const sub = new Redis()
  sub.subscribe(`hedgehog:device:${device_id}:command`, (err, count) => {
    if (err) {
      perror(err)
    } else {
      pinfo(`Subscribing for device #${device_id}`)
    }
  })
  // |msg_type|device_id|frame...|
  sub.on('message', (channel, message) => {
    let buf = Buffer.from([CONTROL])
    // device_id
    let t = Buffer.alloc(4)
    t.writeInt32LE(device_id)
    buf = Buffer.concat([buf, t])
    // frames
    const fields = JSON.parse(message)
    fields.forEach(e => {
      if (e.type === 'string') {
        t = Buffer.alloc(parseInt(e.length))
        t.write(e.value)
        buf = Buffer.concat([buf, t])
      } else if (e.type == 'int') {
        t = Buffer.alloc(4)
        t.writeInt32LE(e.value)
        buf = Buffer.concat([buf, t])
      } else if (e.type == 'float') {
        t = Buffer.alloc(4)
        t.writeFloatLE(e.value)
        buf = Buffer.concat([buf, t])
      }
    })
    // write to socket
    pinfo(`Control to ${device_id}: ${util.inspect(buf)}`)
    writeSocket(socket, buf)
  })
  socket.on('close', () => {
    setTimeout(() => {
      pinfo(`Stop subscribe to #${device_id} because of socket disconnecting`)
      sub.quit()
    }, 1000)
  })
}

const server = net.createServer((socket) => {
  const sid = (socketTotal += 1)
  pinfo(`Socket Client ${sid} connected`)
  const authed = {}
  socket.on('data', (chunk) => {
    // Handle messages
    switch (chunk[0]) {
      case ACK:
      case NACK:
        break
      case LOGIN:
        pinfo(`RECV LOGIN (${chunk.length}B): ${util.inspect(chunk)}`)
        // 1 + 4 + 32 = 37
        if (chunk.length !== 37) {
          socket.end()
          break
        } else {
          const { id, key } = loginParser.parse(chunk)
          query('SELECT COUNT(*) FROM devices WHERE id = $1 AND key = $2 LIMIT 1', [id, key])
          .then((result) => {
            if (result[0].count == 0) {
              pinfo('INVALID_ID_OR_KEY')
              writeSocket(socket, NACK_PACKET)
            } else {
              pinfo('LOGIN_OK')
              authed[id] = true
              subscribe(id, socket)
              writeSocket(socket, ACK_PACKET)
            }
          })
          .catch((err) => {
            perror(err)
            socket.end()
          })
        }
        break
      case REPORT:
        pinfo(`RECV REPORT (${chunk.length}B): ${util.inspect(chunk)}`)
        if (chunk.length < 5) {
          socket.end()
          break
        } else {
          const { device_id } = rawReportParser.parse(chunk)
          if (!authed[device_id]) {
            perror('NOT_LOGGED_DEVICE_ID')
            writeSocket(socket, NACK_PACKET)
          } else if (parsers[device_id]) {
            const data = parsers[device_id].parse(chunk)
            pinfo(`REPORT Data ${util.inspect(data)}`)
            report(device_id, data).then(() => {
              writeSocket(socket, ACK_PACKET)
            }).catch((err) => {
              perror(err)
              socket.end()
            })
          } else {
            getDeviceParser(device_id).then((parser) => {
              if (parser) {
                parsers[device_id] = parser
                const data = parser.parse(chunk)
                pinfo(`REPORT Data ${util.inspect(data)}`)
                report(device_id, data).then(() => {
                  writeSocket(socket, ACK_PACKET)
                }).catch((err) => {
                  perror(err)
                  socket.end()
                })
              } else {
                // no found
                perror('INVALID_DEVICE_ID')
                writeSocket(socket, NACK_PACKET)
              }
            }).catch((err) => {
              perror(err)
              socket.end()
            })
          }
        }
        break
      default:
        socket.end()
        break
    }
  })
  socket.on('close', () => {
    pinfo(`Socket Client ${sid} disconnected`)
  })
})

const debugServer = net.createServer((socket) => {
  debuggers.push(socket)
  const id = debuggers.length
  pinfo(`Debugger #${id} connected`)
  socket.on('close', () => {
    for (let i = debuggers.length - 1; i > 0; --i) {
      if (debuggers[i] === socket) {
        debuggers[i] = null
        break
      }
    }
    pinfo(`Debugger #${id} disconnected`)
  })
})

server.listen(10659, () => {
  console.log('TCP server listening on ' + server.address().port)
})

debugServer.listen(10660, () => {
  console.log('DEBUG server listening on ' + debugServer.address().port)
})

process.on('uncaughtException', function (err) {
  perror('Uncaught Exception: ' + err.message);
});
