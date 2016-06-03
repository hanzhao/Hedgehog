# Hedgehog
An OpenResty API server for course.

对界面上操作和协议有任何问题可以直接来找我，可以通过 QQ，Telegram，WeChat。

## 接口列表

以下的所有 POST 请求按照约定已经全部改成用 JSON 方式提交。
所有请求在正常情况下的返回结果也将全部为 JSON。

### POST /api/report

汇报数据用的接口，通常用于传感器、网关汇报数据使用的，汇报的数据将在网页端实时显示并绘制折线图。

Body 格式

```javascript
{
  "auth_id": 1,                        // Integer，发送这个数据包的设备（网关或直连网络的传感器）在网页上获得的设备码
  "auth_key": "2asdkjh289dwqh172",     // String，发送这个数据包的设备（网关或直连网络的传感器）在网页上获得的密钥
  "device_id": 2,                      // Integer，数据源的设备码，本次数据会显示在这个设备的网页上
  "payload": {                         // 实际传感器数据，以下按照温度湿度举例
    "temperature": 28.5,               // 温度 28.5 度，将会显示在 2 号设备的网页中
    "humidity": 49                     // 湿度 49，将会显示在 2 号设备的网页中
  }
}
```

### GET /api/data?device_id=2&limit=10

获得传感器提交过的所有数据历史的接口，通常用于 APP 和网页端中。

`device_id` 即这个设备的序列号，`limit` 指需要获得最新的多少条数据。默认为 200 条，有点多哦。

返回的数据格式

```javascript
{
  "code": 0, // 请求成功
  "data": [
    { "id": 10, "temperature": 28.5, "humidity": 49, "created_at": "2016-06-01 13:28:12" } // 直接返回了数据库中的内容
  ]
}
```

### POST /api/push?device_id=2

给传感器下达指令，通常用于网页端或者 APP 直接给传感器下达指令。

`device_id` 即这个设备的序列号。

需要 Body 表示下达哪些指令给传感器。

Body

```javascript
[
  { "name": "aircondition", "value": "open", "length": "4", "type": "string" }
]
```

这个指令会让板子的 `/api/poll` 立刻返回一个

```javascript
{
  "code": 0,
  "aircondition": "open"
}
```

Body

```javascript
[
  { "name": "set-temperature", "value": "28.5", "length": "4", "type": "int" }
]
```

这个指令会让板子的 `/api/poll` 立刻返回一个

```javascript
{
  "code": 0,
  "set-temperature": 28.5
}
```

### POST /api/poll

传感器通过长轮询，实时获得网页端或 APP 端通过 `/api/push` 发送的命令。

POST Body
```javascript
{
  "auth_id": 1,                        // Integer，发送这个数据包的设备（网关或直连网络的传感器）在网页上获得的设备码
  "auth_key": "2asdkjh289dwqh172",     // String，发送这个数据包的设备（网关或直连网络的传感器）在网页上获得的密钥
  "device_id": 2                       // Integer，需要拉取指令的设备码，本次数据会显示在这个设备的网页上
}
```

在发起 POST 后这个请求将会一直挂起，在 2 分钟内没有任何响应（进入阻塞状态）。
一旦有来自网页端的 Send Command 或者是其余通过`/api/push` 接口进行发送指令操作的行为，都会让这个请求立刻返回数据。

有数据时的返回为
```javascript
{
  "code": 0,
  // 接下来为实际指令数据内容，参考上一节的 /api/push 的文档
}
```

没有数据时，在两分钟后接口会返回
```javascript
{
  "code": -1
}
```

如果客户端需要保持继续监听的状态，必须重新发起一次新的请求。
