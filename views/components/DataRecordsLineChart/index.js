import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Echarts from 'react-echarts'
import moment from 'moment'

@connect(
  (state) => ({
    fields: state.data.device && state.data.device.fields,
    data: state.data.data
  })
)
class DataRecordsLineChart extends React.Component {
  render() {
    const { data, fields } = this.props
    if (!fields || !data) {
      return <span />
    }
    // build option
    const option = {
      title: { text: 'Realtime Graph' },
      tooltip: { trigger: 'axis' },
      legend: { data: fields.map(f => f.name) },
      xAxis: { type: 'time' },
      yAxis: { type: 'value' },
      series: fields.map(f => ({
        name: f.name,
        type: 'line',
        smooth: true,
        showSymbol: true,
        data: data.map(e => [e.created_at, e.data[f.name]])
      }))
    }
    return (
      <Echarts option={option} notMerge style={{ height: 480 }} />
    )
  }
}

export default DataRecordsLineChart
