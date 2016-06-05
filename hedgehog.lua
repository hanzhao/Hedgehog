local _M = {}

local controller = require("server.controller")

function _M.go()
  controller.run()
end

return _M
