/*
 * 960px/1200px/1600px 自适应居中
 */

import React from 'react';
import classNames from 'classnames';

import styles from './styles';

class Container extends React.Component {
  render() {
    return (
      <div className={classNames(styles.container, this.props.className)}>
        { this.props.children }
      </div>
    );
  }
}

export default Container;
