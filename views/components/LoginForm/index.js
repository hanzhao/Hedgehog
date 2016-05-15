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
      <Modal title="登录"
             visible={this.props.showLoginModal}
             footer={null}
             onCancel={this.props.toggleLoginModal}>
        <Form horizontal>
          <Form.Item
            label="用户名："
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}>
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码："
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}>
            <Input size="large" placeholder="请输入密码" />
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.props.goToTypes}>登录</Button>
          </div>
        </Form>
      </Modal>
    )
  }
}

export default LoginForm
