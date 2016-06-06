import socket
import requests
import time
import json

class HTTPClient(object):

    url_report = "/api/report"
    url_get_data = "/api/data"
    url_push = "/api/push"
    url_poll = "/api/poll"

    def __init__(self, auth_id, auth_key, server_addr):
        self.auth_id = auth_id
        self.auth_key = auth_key
        self.server_addr = server_addr
        self.server_url = "http://{}".format(server_addr)

    def report(self, device_id, data):
        '''
        device_id is an integer
        data is a dictionary
        '''
        packet = {
        "auth_id": self.auth_id,
        "auth_key": self.auth_key,
        "device_id": device_id,
        "payload": data
        }
        try:
            r = requests.post(self.server_url+self.url_report, json.dumps(packet))
        except requests.RequestException as e:
            print(e)
            return False
        print(r.status_code)

    def get_data(self, device_id, limit=200):
        try:
            r = requests.get("{}{}?device_id={}&limit={}".format(self.server_url, self.url_get_data, device_id, limit))
        except requests.RequestException as e:
            print(e)
            return
        try:
            data = json.loads(r.text)
        except json.JSONDecodeError as e:
            print(e)
            return
        if data['code'] == 0:
            return data['data']

    def push(self, device_id, data):
        '''
        data is a dictionary and should be something like
        { "name": "aircondition", "value": "open", "length": "4", "type": "string" }
        '''
        body = [data]
        try:
            r = requests.post("{}{}?device_id={}".format(self.server_url,
                self.url_push, device_id), json.dumps(body))
            print(r.status_code, r.text)
        except requests.RequestException as e:
            print(e)

    def poll(self, device_id):
        data = {
        "auth_id": self.auth_id,
        "auth_key": self.auth_key,
        "device_id": device_id,
        }
        try:
            r = requests.post(self.server_url+self.url_poll, json.dumps(data))
        except requests.RequestException as e:
            print(e)
            return
        if r.status_code != 200:
            print(r.status_code)
            return
        try:
            # print(r.text)
            data = json.loads(r.text)
        except ValueError as e:
            print(e)
            return
        return data['data']


def test_client():
    c = HTTPClient(9, "cc69c6a4aacb81385fdcbb41c61dd803", "nya.fatmou.se")
    data = {
        "temperature": 23.22,
        "humidity": 65.00,
        "state": "n"
    }
    print(c.report(9, data))
    print(c.get_data(9))
    push_data = { "name": "set-temperature", "value": 28.50, "length": 4, "type": "float"}
    c.push(9, push_data)


if __name__=="__main__":
    test_client()
