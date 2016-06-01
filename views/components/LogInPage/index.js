import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { push } from 'react-router-redux'
import { Modal, Form, Input, Button } from 'antd'

import { login } from '../../redux/modules/auth'

import styles from './styles'

@reduxForm({
  form: 'log-in',
  fields: ['username', 'password']
}, undefined, {
  onSubmit: (data) => login(data)
})
class LoginForm extends React.Component {
  render() {
    const { fields: { username, password}, handleSubmit } = this.props
    return (
      <div className={styles.form}>
        <Form horizontal onSubmit={handleSubmit}>
          <Form.Item
            label="Username: "
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}>
            <Input size="large" placeholder="Please input your username" {...username} />
          </Form.Item>
          <Form.Item
            label="Password: "
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}>
            <Input size="large" type="password" placeholder="Please input your password" {...password} />
          </Form.Item>
          <div className={styles.button}>
            <Button htmlType="submit" type="primary">Log In</Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default LoginForm
