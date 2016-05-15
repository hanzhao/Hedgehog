import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Menu, Icon } from 'antd'

import Container from '../Container'
import { toggleLoginModal } from '../../redux/modules/auth'

import logo from './logo.png'
import styles from './styles'

@connect(
  (state) => ({
    user: state.auth.user
  }),
  (dispatch) => ({
    toggleLoginModal: () => dispatch(toggleLoginModal())
  })
)
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
                selectedKeys={[]}>
            <Menu.Item key="user">
              <span onClick={this.props.toggleLoginModal}>
                <Icon type="user" /> Login
              </span>
            </Menu.Item>
          </Menu>
        </div>
      </Container>
    )
  }
}

export default NavBar
