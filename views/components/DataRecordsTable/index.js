import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import moment from 'moment'

@connect(
  (state) => ({
    fields: state.data.device && state.data.device.fields,
    data: state.data.data
  })
)
class DataRecordsTable extends React.Component {
  columns = [];
  initColumns = () => {
    const { fields } = this.props
    // first row always id
    this.columns.push({
      title: 'Report ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id < b.id ? -1 : 1
    })
    // custom data
    fields.forEach(f => {
      this.columns.push({
        title: f.name,
        dataIndex: 'data',
        key: `data.${f.name}`,
        render: (data) => (
          <span>{ data[f.name] || '(NULL)' }</span>
        ),
        sorter: (a, b) => a.data[f.name] < b.data[f.name] ? -1 : 1
      })
    })
    // last row always created_at
    this.columns.push({
      title: 'Reported At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => (
        <span>{ moment.utc(time).fromNow() }</span>
      )
    })
  };
  render() {
    const { data, fields } = this.props
    if (!fields) {
      // Dont show it
      return <span />
    }
    if (this.columns.length === 0) {
      this.initColumns()
    }
    return (
      <Table dataSource={data} columns={this.columns}
             pagination={{ showSizeChanger: true }} />
    )
  }
}

export default DataRecordsTable
