import React from 'react'
import { asyncConnect } from 'redux-connect'
import store from '../../redux/store'

import {
  loadDeviceData,
  loadDeviceType,
  pushBack,
  enableStreaming,
  disableStreaming
} from '../../redux/modules/data'
import Title from '../Title'
import DataRecordsTable from '../DataRecordsTable'
import DataRecordsLineChart from '../DataRecordsLineChart'

// for custom graph config
const gConfig = {

}

@asyncConnect(
  [{
    promise: ({ params, store: { dispatch} }) => {
      return Promise.all([
        dispatch(loadDeviceData(parseInt(params.deviceId))),
        dispatch(loadDeviceType(parseInt(params.deviceId)))
      ])
    }
  }],
  (state) => ({
    device: state.data.device,
    active: state.data.active,
    streaming: state.data.streaming
  })
)
class DeviceDataPage extends React.Component {
  componentDidMount = () => {
    if (!window.WebSocket || !this.props.device.id) {
      return
    }
    this.ws = new WebSocket(`ws://${location.host}/api/watch?device_id=${this.props.device.id}`)
    this.ws.onopen = function ws$open() {
      store.dispatch(enableStreaming())
    }
    this.ws.onmessage = function ws$message(e) {
      try {
        const data = JSON.parse(e.data)
        store.dispatch(pushBack(data))
      } catch (err) {
        console.error(err)
      }
    }
    this.ws.onclose = function ws$onclose() {
      store.dispatch(disableStreaming())
    }
  };
  componentWillUnmount = () => {
    if (this.ws) {
      this.ws.close()
    }
  };
  render() {
    const { active, streaming, device } = this.props
    return (
      <div>
        <Title type="area-chart">
          #{ device.id } - { device.name } ({ device.typename }) Records [{ active ? "Online" : "Offline" } / { streaming ? 'Streaming' : 'Static' }]
        </Title>
        { React.createElement(gConfig[device.id] || DataRecordsLineChart) }
        <h2>Realtime Table</h2>
        <DataRecordsTable />
      </div>
    )
  }
}

export default DeviceDataPage
