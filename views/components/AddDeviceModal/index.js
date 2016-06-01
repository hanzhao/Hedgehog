import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { Modal, Form, Select, Button, Input } from 'antd'

import { addDevice, toggleAddDeviceModal } from '../../redux/modules/device'

import styles from './styles'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
}

@connect(
  (state) => ({
    types: state.device.types || [],
    showAddDeviceModal: state.device.showAddDeviceModal
  }),
  (dispatch) => ({
    toggleAddDeviceModal: () => dispatch(toggleAddDeviceModal())
  })
)
@reduxForm({
  form: 'add-new-device',
  fields: ['name', 'type']
}, undefined, {
  onSubmit: (data) => addDevice(data)
})
class AddDeviceModal extends React.Component {
  render() {
    const { fields: { name, type },
            types, handleSubmit } = this.props
    return (
      <Modal title="Add new device"
             visible={this.props.showAddDeviceModal}
             footer={null}
             onCancel={this.props.toggleAddDeviceModal}>
        <Form horizontal onSubmit={handleSubmit}>
          <Form.Item label="Device Name:" {...formItemLayout}>
            <Input placeholder="Input new device name" {...name} />
          </Form.Item>
          <Form.Item label="Device Type:" {...formItemLayout}>
            <Select size="large"
                    showSearch
                    placeholder="Please select a device type"
                    optionFilterProp="children"
                    notFoundContent="Not Found"
                    {...type}>
              { types.map(e => (
                <Select.Option key={e} value={e.id}>
                  #{ e.id } - { e.name }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className={styles.buttons}>
            <Button type="primary"
                    htmlType="submit">
              Add
            </Button>
          </div>
        </Form>
      </Modal>
    )
  }
}

export default AddDeviceModal
