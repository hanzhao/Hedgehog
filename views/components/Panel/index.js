import React from 'react'
import { Link } from 'react-router'
import { Row, Col, Menu } from 'antd'

import Container from '../Container'

import styles from './styles'

const menus = [
  { key: 0, link: '/types', name: 'Types Management'},
  { key: 1, link: '/devices', name: 'Devices Management'},
  { key: 2, link: '/data', name: 'Data Records'},
]

class Panel extends React.Component {
  state = {
    current: '0'
  };
  handleClick = (e) => {
    this.setState({ current: e.key })
  };
  render() {
    return (
      <Container>
        <Row>
          <Col span="4">
            <Menu onClick={this.handleClick}
                  selectedKeys={[this.state.current]}
                  mode="inline"
                  className={styles.menu}>
              {
                menus.map((v) => (
                  <Menu.Item key={v.key}>
                    <Link to={v.link}>{v.name}</Link>
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
