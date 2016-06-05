import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, getValues } from 'redux-form'
import { Modal, Form, Button, Select, Input, InputNumber, Row, Col } from 'antd'

import FieldsAlert from '../FieldsAlert'
import store from '../../redux/store'
import {
  sendCommand,
  toggleSendCommandModal
} from '../../redux/modules/device'

import styles from './styles'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
}

@connect(
  (state) => ({
    showSendCommandModal: state.device.showSendCommandModal,
    data: getValues(state.form['send-command'])
  }),
  (dispatch) => ({
    toggleSendCommandModal: () => dispatch(toggleSendCommandModal())
  })
)
@reduxForm({
  form: 'send-command',
  fields: ['id',
           'fields[].name', 'fields[].value',
           'fields[].length', 'fields[].type']
}, (state) => ({
  initialValues: {
    id: state.device.commandId
  }
}), {
  onSubmit: (data) => sendCommand(data)
})
class SendCommandModal extends React.Component {
  render() {
    const { fields: { fields }, handleSubmit } = this.props
    return (
      <Modal title="Send Command"
             className={styles.modal}
             visible={this.props.showSendCommandModal}
             footer={null}
             onCancel={this.props.toggleSendCommandModal}>
        <div className={styles.alert}>
          <FieldsAlert data={this.props.data} />
        </div>
        <Form horizontal onSubmit={handleSubmit}>
          { fields.map((field, index) => (
            <Row key={index}>
              <Col span="6">
                <Form.Item key={`name.${index}`} label="Name: " {...formItemLayout}>
                  <Input placeholder="Input fieldname" {...field.name} />
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item key={`value.${index}`} label="Value: " {...formItemLayout}>
                  <Input placeholder="Input value" {...field.value} />
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item key={`type.${index}`} label="Type: " {...formItemLayout}>
                  <Select placeholder="Input fieldtype" {...field.type}
                    onChange={(e) => {
                      if (e !== 'string') {
                        store.dispatch({
                          type: 'redux-form/CHANGE',
                          form: 'send-command',
                          field: `fields[${index}].length`,
                          value: 4,
                          touch: false
                        })
                      }
                      return field.type.onChange(e)
                    }}>
                    <Select.Option value="string">String</Select.Option>
                    <Select.Option value="int">Integer</Select.Option>
                    <Select.Option value="float">Float</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item key={`length.${index}`} label="Length: "
                           labelCol={{ span: 10 }}
                           wrapperCol={{ span: 10 }}>
                  <InputNumber min={0} max={100000} {...field.length}
                               disabled={field.type.value !== 'string'} />
                </Form.Item>
              </Col>
            </Row>
          ))}
          <Form.Item className={styles.buttons}>
            <Button type="primary" size="large"
                    onClick={() => fields.addField()}>
              Add a field
            </Button>
            <Button size="large" type="primary"
                    htmlType="submit"
                    disabled={fields.length == 0}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default SendCommandModal
