import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { push } from 'react-router-redux'
import { Modal, Form, Input, Button } from 'antd'

import { signup } from '../../redux/modules/auth'

import styles from './styles'

@reduxForm({
  form: 'sign-up',
  fields: ['username', 'password']
}, undefined, {
  onSubmit: (data) => signup(data)
})
class SignUpForm extends React.Component {
  render() {
    const { fields: { username, password }, handleSubmit } = this.props
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
            <Button htmlType="submit" type="primary">Sign Up</Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default SignUpForm
