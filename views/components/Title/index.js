import React from 'react'

import { Icon } from 'antd'

import styles from './styles'

const Title = ({ children, type = 'link' }) => {
  return (
    <div className={styles.title}>
      <Icon type={type} /> {children}
    </div>
  )
}

export default Title
