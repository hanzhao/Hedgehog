import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Menu, Icon } from 'antd'

import Container from '../Container'
import { logout } from '../../redux/modules/auth'

import logo from './logo.png'
import styles from './styles'

@connect(
  (state) => ({
    user: state.auth.user
  }),
  (dispatch) => ({
    logout: () => dispatch(logout())
  })
)
class NavBar extends React.Component {
  render() {
    const { user, logout } = this.props
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
                selectedKeys={[location.pathname]}>
            <Menu.Item key="/login" style={{ display: user ? 'none' : 'inherit' }}>
              <Link to="/login"><Icon type="user" /> Login</Link>
            </Menu.Item>
            <Menu.Item key="/signup" style={{ display: user ? 'none' : 'inherit' }}>
              <Link to="/signup"><Icon type="user" /> Signup</Link>
            </Menu.Item>
            <Menu.Item key="/types" style={{ display: !user ? 'none' : 'inherit' }}>
              <Link to="/types"><Icon type="user" /> { user && user.username }</Link>
            </Menu.Item>
            <Menu.Item key="/logout" style={{ display: !user ? 'none' : 'inherit' }}>
              <a onClick={logout}><Icon type="user" /> Logout</a>
            </Menu.Item>
          </Menu>
        </div>
      </Container>
    )
  }
}

export default NavBar
