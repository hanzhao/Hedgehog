import React from 'react'
import { Alert } from 'antd'
import stringify from 'json-stringify-pretty-compact'

class FieldsAlert extends React.Component {
  getDataStructure = () => {
    const { data } = this.props
    let current = 0
    const obj = {
      name: data.name,
      fields: []
    }
    if (data.fields) {
      for (let i = 0; i < data.fields.length; ++i) {
        let length = 0
        if (data.fields[i]) {
          length = parseInt(data.fields[i].length) || 0
          obj.fields.push({
            ...data.fields[i],
            length,
            range: [current, current + length - 1]
          })
        }
        current += length
      }
    }
    obj.content_length = current
    return (
      <pre>
        { stringify(obj) }
      </pre>
    )
  }
  render() {
    const { data } = this.props
    if (data && data.fields) {
      return <Alert type="info"
                    message="Data Structure"
                    description={this.getDataStructure()} />
    } else {
      return <Alert message="No fields!"
                    description="Add the fields for data collecting!"
                    type="error" />
    }
  }
}

export default FieldsAlert
