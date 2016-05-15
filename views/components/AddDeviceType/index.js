import React from 'react'
import { Form, Input, Button, Checkbox, Radio, Tooltip, Icon } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import NavBar from '../NavBar'

import styles from './styles'

class Demo extends React.Component{
  state = {
    rows: 0
  };
  handleSubmit = (e) => {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
  };
  handleClick = () => {
    this.setState({
      rows: this.state.rows + 1
    })
  };
  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 5 },
    };
    return (
      <div className={styles.container}>
      <Form horizontal onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="设备类型名称：">
          <Input placeholder="请输入您自定义的类型名" />
        </FormItem>
        </Form>
        { Array(this.state.rows).fill(0).map((e, i) => (
          <FormItem key={i} inline className={styles.everyadd}>
            <FormItem
              {...formItemLayout}
              label="字段名称：">
              <Input placeholder="字段名称" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="字段长度：">
              <Input placeholder="请输入字段长度"
                {...getFieldProps('userName')} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="字段类型：">
              <Input type="password" placeholder="请输入字段类型" />
            </FormItem>
          </FormItem>
        ))}
        <Button className={styles.addBtn} onClick={this.handleClick} type="primary" size="large">添加一个字段</Button>
        <FormItem
          {...formItemLayout}
          label=" ">
          <Button type="primary" htmlType="submit">确定</Button>
        </FormItem>
      </div>
    );
  }
};




Demo = Form.create()(Demo);


class AddDeviceType extends React.Component {
  render() {
    return (
      <div>
        <Demo />
      </div>
    )
  }
}

export default AddDeviceType
