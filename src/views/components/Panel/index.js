import React from 'react'
import { Link } from 'react-router'
import { Row, Col, Menu } from 'antd'

import Container from '../Container'

import styles from './styles'

const menus = [
  { to: '/types', name: 'Types Management'},
  { to: '/devices', name: 'Devices Management'},
  { to: '/overview', name: 'Data Records'},
]

class Panel extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <Col span="4">
            <Menu selectedKeys={[location.pathname]}
                  mode="inline"
                  className={styles.menu}>
              {
                menus.map((v) => (
                  <Menu.Item key={v.to}>
                    <Link to={v.to}>{v.name}</Link>
                  </Menu.Item>
                ))
              }
            </Menu>
          </Col>
          <Col span="20" className={styles.content}>
            { this.props.children }
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Panel
