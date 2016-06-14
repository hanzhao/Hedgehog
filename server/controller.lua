local _M = {}

local model = require("server.model")

local json = require("cjson")
json.encode_empty_table_as_object(false)

local helper = require("server.helper")
local md5 = helper.md5
local pgmoon = require("pgmoon")
local session = require("resty.session")
local ws_server = require("resty.websocket.server")
local redis = require("resty.redis")
local ngx_var = ngx.var
local ngx_sleep = ngx.sleep

local function success(data)
  ngx.print(json.encode({
    code = 0,
    data = data
  }))
end

local function fail(error)
  ngx.print(json.encode({
    code = -1,
    error = error
  }))
end

function _M.run()
  local uri = ngx_var.uri
  -- router
  -- heavily used
  -- data report
  if uri == '/api/report' then
    -- check data
    ngx.req.read_body()
    local data = json.decode(ngx.req.get_body_data())
    if type(data.auth_id) ~= "number" or type(data.device_id) ~= "number" then
      return ngx.exit(400)
    end
    if not model.check_device_key(data.auth_id, data.auth_key) then
      return ngx.exit(403)
    else
      model.add_data(data.device_id, data.payload)
      success()
    end
  -- command poll
  elseif uri == '/api/poll' then
    ngx.req.read_body()
    local data = json.decode(ngx.req.get_body_data())
    if type(data.auth_id) ~= "number" or type(data.device_id) ~= "number" then
      return ngx.exit(400)
    end
    if not model.check_device_key(data.auth_id, data.auth_key) then
      return ngx.exit(403)
    end
    -- redis subscribe
    local r = redis:new()
    r:set_timeout(120000) -- 2min
    -- TODO: use unix domain socket
    local ok, err = r:connect("127.0.0.1", 6379)
    if not ok then
      ngx.log(ngx.ERR, "failed to connect redis: ", err)
      return ngx.exit(500)
    end
    local res, err = r:subscribe("hedgehog:device:" .. tostring(data.device_id) .. ":command")
    if not res then
      ngx.log(ngx.ERR, "failed to subscribe redis: ", err)
      return ngx.exit(500)
    end
    res, err = r:read_reply() -- 2min
    if not res then
      fail()
    else
      local item = json.decode(res[3])
      -- construct real command
      local resp = {}
      for i, v in ipairs(item) do
        if v.name then
          resp[v.name] = v.value
        end
      end
      success(resp)
    end
    r:set_keepalive(10000, 100)
  -- auth
  elseif uri == '/api/signup' then
    ngx.req.read_body()
    local data = json.decode(ngx.req.get_body_data())
    local user = model.add_user(data.username, md5(data.password))[1]
    -- session
    local sess = session.start()
    sess.data.user_id = user.id
    sess:save()
    success({ user = user })
  elseif uri == '/api/login' then
    ngx.req.read_body()
    local data = json.decode(ngx.req.get_body_data())
    local user = model.find_user_by_username(data.username)
    if #user > 0 and user[1].password == md5(data.password) then
      -- hide password
      user[1].password = nil
      -- session
      local sess = session.start()
      sess.data.user_id = user[1].id
      sess:save()
      ngx.log(ngx.NOTICE, sess.data.user_id)
      success({ user = user[1] })
    else
      fail({ type = 'INVALID_USERNAME_OR_PASSWORD' })
    end
  elseif uri == '/api/me' then
    local sess = session.open()
    if sess.data.user_id then
      local user = model.find_user_by_id(sess.data.user_id)[1]
      success({ user = user })
    else
      success({ user = nil })
    end
  elseif uri == '/api/logout' then
    local sess = session.start()
    sess:destroy()
    success({ user = nil })
  -- device type
  elseif uri == '/api/device/type/add' then
    ngx.req.read_body()
    local data = json.decode(ngx.req.get_body_data())
    local sess = session.open()
    if sess.data.user_id then
      local content_length = 0
      for i, v in ipairs(data.fields) do
        content_length = content_length + tonumber(v.length)
      end
      local res = model.add_device_type(data.name, content_length, sess.data.user_id, data.fields)
      success()
    else
      fail({ type = 'ACCESS_DENIED' })
    end
  elseif uri == '/api/device/types' then
    local types = model.find_all_device_types()
    success({ types = types })
  -- device
  elseif uri == '/api/device/add' then
    ngx.req.read_body()
    local data = json.decode(ngx.req.get_body_data())
    local sess = session.open()
    if sess.data.user_id then
      local res = model.add_device(data.name, tonumber(data.type), sess.data.user_id)
      success()
    else
      fail({ type = 'ACCESS_DENIED' })
    end
  elseif uri == '/api/devices' then
    local sess = session.open()
    if sess.data.user_id then
      local devices = model.find_all_devices(sess.data.user_id)
      success({ devices = devices })
    else
      fail({ type = 'ACCESS_DENIED' })
    end
  -- device data
  elseif uri == '/api/overview' then
    local sess = session.open()
    if sess.data.user_id then
      local overview = model.find_overview(sess.data.user_id)
      success(overview)
    else
      fail({ type = 'ACCESS_DENIED' })
    end
  elseif uri == '/api/data' then
    local sess = session.open()
    local args = ngx.req.get_uri_args()
    local device_id = tonumber(args.device_id)
    -- if not sess.data.user_id or not device_id then
    --   return fail({ type = 'ACCESS_DENIED' })
    -- end
    if not device_id then
      return fail({ type = 'DEVICE_ID_NEEDED' })
    end
    -- if model.check_device_owner(device_id, sess.data.user_id) then
    local data = model.find_device_datas(device_id, tonumber(args.limit))
    success(data)
    -- else
    --   fail({ type = 'ACCESS_DENIED' })
    -- end
  elseif uri == '/api/device_info' then
    local args = ngx.req.get_uri_args()
    local device_id = tonumber(args.device_id)
    if not device_id then
      return fail({ type = 'ACCESS_DENIED' })
    end
    local type = model.get_device_info(device_id)
    success({ type = type })
  elseif uri == '/api/watch' then
    local args = ngx.req.get_uri_args()
    local device_id = tonumber(args.device_id)
    if not device_id then
      return ngx.exit(400)
    end
    -- ws!
    local wb, err = ws_server:new({ timeout = 5000, max_payload_len = 1024 })
    if not wb then
      ngx.log(ngx.ERR, "failed to new websocket: ", err)
      return ngx.exit(444)
    end
    -- redis subscribe
    local r = redis:new()
    r:set_timeout(120000)
    -- TODO: use unix domain socket
    local ok, err = r:connect("127.0.0.1", 6379)
    if not ok then
      wb.send_close()
      return
    end
    local res, err = r:subscribe("hedgehog:device:" .. tostring(device_id) .. ":update")
    if not res then
      wb.send_close()
      return
    end
    while true do
      res, err = r:read_reply()
      if not res then
        ngx.log(ngx.ERR, "failed to read reply: ", err)
        break
      end
      local item = res[3]
      local ok, err = wb:send_text(item)
      if not ok then
        ngx.log(ngx.ERR, "failed to send text: ", err)
        break
      end
      ngx_sleep(1)
    end
    local ok, err = wb:send_close()
    if not ok then
      ngx.log(ngx.ERR, "failed to send close: ", err)
    end
    r:set_keepalive(10000, 100)
  -- send command
  elseif uri == '/api/push' then
    local args = ngx.req.get_uri_args()
    local device_id = tonumber(args.device_id)
    if not device_id then
      return ngx.exit(400)
    end
    ngx.req.read_body()
    local data = json.decode(ngx.req.get_body_data())
    model.redis_publish("hedgehog:device:" .. tostring(device_id) .. ":command", json.encode(data.payload))
    success()
  else
    fail({ type = 'NOT_FOUND' })
  end
end

return _M
