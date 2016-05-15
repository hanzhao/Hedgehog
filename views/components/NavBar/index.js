import React from 'react'
import { Link } from 'react-router'
import { Menu, Icon } from 'antd'

import Container from '../Container'

import logo from './logo.png'
import styles from './styles'

class NavBar extends React.Component {
  render() {
    return (
      <Container className={styles.navbar}>
        {/* Logo */}
        <Link to="/">
          <img className={styles.logo} src={logo} />
          <div className={styles.title}>
            Hedgehog
          </div>
        </Link>
        <div className={styles.menu}>
          <Menu mode="horizontal"
                selectedKeys={['user']}>
            <Menu.Item key="user" disabled>
              <Icon type="user" /> Login
            </Menu.Item>
          </Menu>
        </div>
      </Container>
    )
  }
}

export default NavBar
