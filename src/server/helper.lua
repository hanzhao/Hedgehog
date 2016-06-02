local _M = {}

local resty_md5 = require("resty.md5")
local resty_str = require("resty.string")

function _M.md5(s)
  local md5 = resty_md5:new()
  md5:update(s)
  return resty_str.to_hex(md5:final())
end

return _M
