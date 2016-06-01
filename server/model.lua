local _M = {}

local pgmoon = require("pgmoon")
local json = require("cjson")
local encode_json = require("pgmoon.json").encode_json
local redis = require("resty.redis")
local lrucache = require("resty.lrucache")
local helper = require("server.helper")
local md5 = helper.md5
local quote_sql_str = ndk.set_var.set_quote_pgsql_str

local lru = lrucache.new(200)

local db_spec = {
  host = "127.0.0.1",
  port = "5432",
  database = "hedgehog",
  user = "nya",
  password = "123456"
}

local function query_db(query)
  local pg = pgmoon.new(db_spec)
  print("sql query: ", query)

  local ok, err

  -- connect
  ok, err = pg:connect()

  if not ok then
    ngx.log(ngx.ERR, "failed to connect to database: ", err)
    return ngx.exit(500)
  end

  local res
  res, err = pg:query(query)

  if not res then
    ngx.log(ngx.ERR, "failed to send query: ", err)
    return ngx.exit(500)
  end

  local ok, err = pg:keepalive(0, 5)
  if not ok then
    ngx.log(ngx.ERR, "failed to keep alive: ", err)
  end

  return res
end

function _M.add_user(username, password)
  local res = query_db("INSERT INTO users(username, password) VALUES ("
      .. quote_sql_str(username) .. ", " .. quote_sql_str(password)
      ..  ") RETURNING id, username")
  return res
end

function _M.find_user_by_username(username)
  local res = query_db("SELECT id, username, password FROM users"
      .. " WHERE username = " .. quote_sql_str(username) .. " LIMIT 1")
  return res
end

function _M.find_user_by_id(user_id)
  local res = query_db("SELECT id, username FROM users WHERE id = "
      .. user_id .. " LIMIT 1")
  return res
end

function _M.find_all_device_types()
  local res = query_db("SELECT device_types.*, users.username FROM "
      .. "device_types INNER JOIN users ON device_types.user_id = users.id ORDER BY id")
  return res
end

function _M.add_device_type(name, content_length, user_id, fields)
  local res = query_db("INSERT INTO device_types(name, content_length, user_id, fields) VALUES ("
      .. quote_sql_str(name) .. ", " .. content_length .. ", "
      .. user_id .. ", " .. encode_json(fields) .. ")")
  return res
end

function _M.find_all_devices(user_id)
  local res = query_db("SELECT devices.*, device_types.name as typename, users.username FROM "
      .. "(devices INNER JOIN device_types ON devices.user_id = " .. tostring(user_id)
      .. " AND devices.device_type_id = device_types.id) INNER JOIN users ON devices.user_id = users.id ORDER BY id")
  return res
end

function _M.add_device(name, type_id, user_id)
  local res = query_db("INSERT INTO devices(name, device_type_id, user_id) VALUES ("
      .. quote_sql_str(name) .. ", " .. type_id .. ", " .. user_id .. ") RETURNING id")
  local id = res[1].id
  local key = md5(md5(tostring(id)) .. "fatmousefatmouse")
  local res = query_db("UPDATE devices SET key = " .. quote_sql_str(key)
      .. "WHERE id = " .. quote_sql_str(id))
  return res
end

function _M.find_overview(user_id)
  -- get all my device types
  local device_types = query_db("SELECT id, name FROM device_types WHERE user_id = " .. tostring(user_id))
  -- get all my devices
  local devices = query_db("SELECT id, name, device_type_id FROM devices WHERE user_id = " .. tostring(user_id))
  local r = redis:new()
  r:set_timeout(1000)
  -- connect redis
  -- TODO: use unix socket
  local ok, err = r:connect("127.0.0.1", 6379)
  if not ok then
    return ngx.exit(500)
  end
  -- get all data count / active
  local count, active
  for i, device in ipairs(devices) do
    count = query_db("SELECT COUNT(*) FROM datas WHERE device_id = " .. tostring(device.id))
    active, err = r:get("hedgehog:device:" .. tostring(device.id) .. ":active")
    device.count = count[1].count
    device.active = (active ~= ngx.null)
  end
  r:set_keepalive(10000, 100)
  return { devices = devices, device_types = device_types }
end

function _M.check_device_key(id, key)
  -- it should be lru-cached, forever
  local s = tostring(id)
  local cached = lru:get(s)
  if cached then
    -- cached!
    return cached == key
  end
  -- not cached
  local res = query_db("SELECT COUNT(*) FROM devices WHERE id = "
      .. s .. " AND key = " .. quote_sql_str(key) .. " LIMIT 1")
  if res[1].count > 0 then
    lru:set(s, key)
    return true
  else
    return false
  end
end

function _M.add_data(device_id, data)
  -- encode to json
  local encoded = encode_json(data)
  -- save to db
  local res = query_db("INSERT INTO datas(device_id, data) VALUES ("
    .. tostring(device_id) .. ", " .. encoded .. ") RETURNING id, created_at")
  -- redis
  local r = redis:new()
  r:set_timeout(1000)
  -- connect redis
  -- TODO: use unix socket
  local ok, err = r:connect("127.0.0.1", 6379)
  if not ok then
    return ngx.exit(500)
  end
  -- pub to redis
  r:publish("hedgehog:device:" .. tostring(device_id) .. ":update", json.encode({
    id = res[1].id,
    data = data,
    created_at = res[1].created_at
  }))
  -- save active state, expires in 2min
  r:setex("hedgehog:device:" .. tostring(device_id) .. ":active", 120, "1")
  r:set_keepalive(10000, 100)
  return res
end

function _M.check_device_owner(device_id, user_id)
  local res = query_db("SELECT COUNT(*) FROM devices WHERE id = "
      .. tostring(device_id) .. " AND user_id = " .. tostring(user_id)
      .. " LIMIT 1")
  return res[1].count > 0
end

function _M.find_device_datas(device_id, limit)
  -- limit default to 500
  limit = limit or 500
  if limit > 5000 then
    limit = 5000
  end
  local res = query_db("SELECT id, data, created_at FROM datas WHERE device_id = "
      .. tostring(device_id) .. " ORDER BY id DESC LIMIT " .. tostring(limit))
  return res
end

function _M.get_device_info(device_id)
  -- get initial info of device
  local res = query_db("SELECT devices.id, devices.name, device_types.name as typename, device_types.fields FROM "
      .. "(devices INNER JOIN device_types ON devices.id = " .. tostring(device_id)
      .. " AND devices.device_type_id = device_types.id) LIMIT 1")
  if #res == 0 then
    return res
  end
  local r = redis:new()
  r:set_timeout(10000)
  -- connect redis
  -- TODO: use unix socket
  local ok, err = r:connect("127.0.0.1", 6379)
  if not ok then
    return ngx.exit(500)
  end
  local active = r:get("hedgehog:device:" .. tostring(device_id) .. ":active")
  res[1].active = active ~= ngx.null
  return res[1]
end

return _M
