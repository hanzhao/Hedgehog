# Hedgehog
An OpenResty / Node.js API server for course.

对界面上操作和协议有任何问题可以直接来找我，可以通过 QQ，Telegram，WeChat。

按照约定，分为 HTTP 和 TCP 二进制协议。
一份可用的 Python 实现在 [这个项目的 test 分支下](https://github.com/magicae/Hedgehog/tree/test)

## HTTP 接口列表

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
  { "name": "set-temperature", "value": "28.5", "length": "4", "type": "float" }
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

## TCP 数据包格式和接口

TCP 服务器监听在 10659 端口，并且同时有一个 10660 端口会实时打印服务器的调试信息，调试的时候可以通过 `telnet nya.fatmou.se 10660` 查看目前服务器状态。

### 包格式

可以用 C 语言中的 struct 基本表示各种消息包格式，对于多字节类型（int，float）均为 Little Endian。

注意 gcc 在编译 C 语言的时候会进行内存字节对齐，导致 struct 的大小大于各个字段大小的总和，可以设定 packed 参数取消内存字节优化。

```c
struct t {
  char message_type,
  int device_id
} __attribute__((packed));
```

### ACK 包

服务器在接收到一个 REPORT 包或 LOGIN 包并且执行成功时会返回。

```c
struct ack_packet_t {
  char message_type = 0x00
}
```

### ACK 包

服务器在接收到一个 REPORT 包或 LOGIN 包并且执行失败（密码错误、消息格式错误等）时会返回。

```c
struct nack_packet_t {
  char message_type = 0x01
}
```

### LOGIN 包

网关需要在握手成功后发送 LOGIN 包来进行身份验证，同样的，当传感器连接上网关后，网关需要代发对应传感器的 LOGIN 包。
这个 LOGIN 包作为权限验证，验证成功后才能进行 REPORT，并且会在网页端发送信息后收到认证设备的 CONTROL 包。

```c
struct login_packet_t {
  char message_type = 0x02,
  uint32_t device_id, // 填写进行认证的设备的 id，可以在网页上看到
  char device_key[32] // 填写进行认证的设备的 key，可以在网页上看到
}
```

这个 LOGIN 包为定长（37 bytes），请确保发送的数据包大小正确。

### REPORT 包

汇报数据到服务器，服务器将会记录这个数据。需要在网页端正确设定格式后才能发送 REPORT 包。

```c
struct report_packet_t {
  char message_type = 0x03,
  uint32_t device_id, // 数据源的设备 id
  uint32_t reserved,  // 请注意这个字段，这儿有 4 bytes 的保留字，对实际数据不产生影响（为了兼容另一个服务器）。
  __type__ __data_name_1__, // 以下为汇报的若干数据
  __type__ __data_name_2__,
  __type__ __data_name_3__,
  __type__ __data_name_4__
}
```

发送成功后会返回 ACK 包，否则 NACK。
可以通过访问网页的 Data Records 页实时观察数据汇报情况。
服务器会在遇到内部错误的时候直接断开连接，如果发现这种情况，请通过 10660 端口查看服务器调试日志并直接找我。

### CONTROL 包

服务器在网页 / API 上收到一个来自用户的控制请求时，将会发送包含二进制数据的 REPORT 包到连接中并通过认证的客户端。

```c
struct control_packet_t {
  char message_type = 0x04,
  uint32_t device_id, // 命令所指定的目标设备 id
  __type__ __data_name_1__, // 以下为控制指令中的若干数据
  __type__ __data_name_2__,
  __type__ __data_name_3__,
  __type__ __data_name_4__
}
```

### LOGOUT 包

不多说，收到直接断你连接。

```c
struct logout_packet_t {
  char message_type = 0x05
}
```

对协议有任何方面的问题都可以直接找我。
