local _M = {}
local json = require 'cjson'
local ngx_var = ngx.var

function _M.run()
  local uri = ngx_var.uri
  if uri == '/api' then
    ngx.say('{ "code": 0 }')
  elseif uri == '/api/register' then
    ngx.say('Register')
  elseif uri == '/api/login' then
    ngx.say('Login')
  elseif uri == '/api/logout' then
    ngx.say('Logout')
  end
end

return _M
