import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Modal, Form, Input, Button } from 'antd'

import { toggleLoginModal, login } from '../../redux/modules/auth'

@connect(
  (state) => ({
    showLoginModal: state.auth.showLoginModal
  }),
  (dispatch) => ({
    toggleLoginModal: () => dispatch(toggleLoginModal()),
    goToTypes: () => dispatch(login())
  })
)
class LoginForm extends React.Component {
  render() {
    return (
      <Modal title="Login"
             visible={this.props.showLoginModal}
             footer={null}
             onCancel={this.props.toggleLoginModal}>
        <Form horizontal>
          <Form.Item
            label="Username: "
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}>
            <Input size="large" placeholder="Please input your username" />
          </Form.Item>
          <Form.Item
            label="Password: "
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}>
            <Input size="large" type="password" placeholder="Please input your password" />
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.props.goToTypes} type="primary">Login</Button>
          </div>
        </Form>
      </Modal>
    )
  }
}

export default LoginForm
