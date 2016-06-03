import React from 'react'
import { Link } from 'react-router'
import { asyncConnect } from 'redux-connect'
import { Collapse, Row, Col, Button, Alert } from 'antd'

import { loadOverview } from '../../redux/modules/data'
import Title from '../Title'

@asyncConnect(
  [{
    promise: ({ store: { dispatch } }) => {
      return dispatch(loadOverview())
    }
  }],
  (state) => ({
    devices: state.data.devices,
    deviceTypes: state.data.deviceTypes
  })
)
class DataOverviewPage extends React.Component {
  renderContent = (typeId) => {
    const devices = this.props.devices.filter(e => e.device_type_id === typeId)
    return (
      <Row>
      { devices.map(e => (
        <Col span="6" key={e.id}>
          <Link to={`/device/${e.id}/data`}>
            <Button type={ e.active ? "primary" : "ghost" }>
              #{ e.id } - { e.name } ({ e.count } Records)
            </Button>
          </Link>
        </Col>
      )) }
      </Row>
    )
  }
  render() {
    const { deviceTypes } = this.props
    const allActive = deviceTypes.map(e => e.id.toString())
    return (
      <div>
        <Title type="bars">Data Overview</Title>
        <Alert type="info" closable
          message="Colored device means the device was active within 2 minutes"
        />
        <Collapse defaultActiveKey={allActive}>
        {
          deviceTypes.map(e => (
            <Collapse.Panel header={e.name} key={e.id}>
              { this.renderContent(e.id) }
            </Collapse.Panel>
          ))
        }
        </Collapse>
      </div>
    )
  }
}

export default DataOverviewPage
