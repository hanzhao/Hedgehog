import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, addArrayValue, getValues } from 'redux-form'
import { Form, Alert, Input, Row, Col, InputNumber, Button, Select } from 'antd';

import NavBar from '../NavBar'
import Title from '../Title'
import FieldsAlert from '../FieldsAlert'

import store from '../../redux/store'
import { addDeviceType } from '../../redux/modules/device'

import styles from './styles'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
}

@connect(
  (state) => ({
    data: getValues(state.form['add-new-type'])
  })
)
@reduxForm({
  form: 'add-new-type',
  fields: ['name', 'fields[].name', 'fields[].length', 'fields[].type']
}, undefined, {
  addValue: addArrayValue,
  onSubmit: (data) => addDeviceType(data)
})
class AddDeviceTypePage extends React.Component {
  render() {
    const { fields: { name, fields },
            handleSubmit, addValue, resetForm } = this.props
    return (
      <div>
        <Title type="plus-circle-o">Add New Device Type</Title>
        <Form horizontal onSubmit={handleSubmit}>
          <Form.Item label="Name: " {...formItemLayout}>
            <Input placeholder="Input typename" {...name} />
          </Form.Item>
          <div className={styles.alert}>
            <FieldsAlert data={this.props.data} />
          </div>
          { fields.map((field, index) => (
            <Row key={index}>
              <Col span="8" offset="3">
                <Form.Item key={`name.${index}`} label="Field name: " {...formItemLayout}>
                  <Input placeholder="Input fieldname" {...field.name} />
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item key={`type.${index}`} label="Field type: " {...formItemLayout}>
                  <Select placeholder="Input fieldtype" {...field.type}
                    onChange={(e) => {
                      if (e !== 'string') {
                        store.dispatch({
                          type: 'redux-form/CHANGE',
                          form: 'add-new-type',
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
                <Form.Item key={`length.${index}`} label="Field length: "
                           labelCol={{ span: 10 }}
                           wrapperCol={{ span: 10 }}>
                  <InputNumber min={0}
                               max={100000}
                               {...field.length}
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
      </div>
    );
  }
};

export default AddDeviceTypePage
