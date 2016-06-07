import socket
from struct import pack, unpack, calcsize
from tornado import ioloop, iostream

import signal

class Client(object):

    server_port = 10659
    STATE_NOT_CONNECTED = 1
    STATE_CONNECTED = 2
    STATE_WAITING_ACK = 4
    STATE_IDLE = 5
    STATE_WAITING_CONTROL_BOTTOM = 6
    STATE_LOGGING_OUT = 7

    def __init__(self, server_addr, device_keys, device_fmt, loop):
        '''
        device_key is a mapping from device_id to a string of device key
        '''
        self.server_addr = server_addr
        self.device_keys = device_keys
        self.device_fmt = device_fmt
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
        self.stream = iostream.IOStream(s)
        self.state = self.STATE_NOT_CONNECTED

    def connect(self):
        assert(self.state == self.STATE_NOT_CONNECTED)
        self.stream.connect((self.server_addr, self.server_port), self.login)

    def login(self):
        print("connected")
        self.state = self.STATE_CONNECTED
        data = bytes()
        for x, key in self.device_keys.items():
            packet = pack("<bL32s", 0x02, x, key.encode())
            data += packet
        # print(data)
        self.stream.write(data)
        self.stream.read_bytes(len(self.device_keys), self.on_login_complete)

    def on_login_complete(self, data):
        assert(self.state == self.STATE_CONNECTED)
        if any(data):
            print("login failed")
        else:
            print("login succeeded")
            self.state = self.STATE_IDLE
        self.stream.read_bytes(5, self.on_control_received)

    def logout(self):
        self.state = self.STATE_LOGGING_OUT
        self.stream.write(pack("<b", 0x02), self.on_logout_complete)

    def on_logout_complete(self):
        assert(self.state == self.STATE_LOGGING_OUT)
        print("logged out")
        self.stream.close()
        self.state = self.STATE_NOT_CONNECTED

    def report(self, device_id, ata):
        '''
        data is prepacked bytes!
        '''
        assert(self.state == self.STATE_IDLE)
        if device_id not in self.device_keys:
            print("device not registered")
            return
        packet = pack("<bLL", 0x03, device_id, 0)
        self.stream.write(packet + data)
        self.stream.read_bytes(1, self.on_report_complete)
        self.state = self.STATE_WAITING_ACK

    def on_report_complete(self, data):
        assert(self.state == self.STATE_WAITING_ACK)
        if any(data):
            print("report error")
        else:
            print("report success")
            self.state = self.STATE_IDLE
        self.stream.read_bytes(5, self.on_control_received)

    def on_control_received(self, data):
        assert(self.state == self.STATE_IDLE)
        code, device_id = unpack("<bL", data)
        print("control received for device {}".format(device_id))
        if device_id not in self.device_fmt:
            print("device is not in fmt")
            return
        self.waiting_device_id = device_id
        self.state = self.STATE_WAITING_CONTROL_BOTTOM
        self.stream.read_bytes(calcsize(self.device_fmt[device_id]), self.on_control_received_bottom)

    def on_control_received_bottom(self, binary_data):
        '''
        to be determined whether control packet is of fixed size!
        '''
        assert(self.state == self.STATE_WAITING_CONTROL_BOTTOM)
        data = unpack(self.device_fmt[self.waiting_device_id], binary_data)
        print(data)
        self.state = self.STATE_IDLE
        return data

keys = {9: "cc69c6a4aacb81385fdcbb41c61dd803"}
fmt = {9: "<ddb"}

def main():
    loop = ioloop.IOLoop.current()
    c = Client("nya.fatmou.se", keys, fmt, loop)
    c.connect()
    signal.signal(signal.SIGUSR1, lambda a,b: c.logout())
    loop.start()

if __name__ == '__main__':
    main()
