import React from 'react'
import { Carousel, Row, Col, Icon } from 'antd'

import Container from '../Container'

import styles from './styles'

const services = [
  {
    icon: 'plus-circle-o',
    title: 'Security Plus',
    text: 'Something which is most secure is that,',
    text2: 'anywhere is most secure.'
  }, {
    icon: 'line-chart',
    title: 'Temperature Monitoring',
    text: 'The real-time temperature of home, company,',
    text2: 'and anywhere in your mind.'
  }, {
    icon: 'setting',
    title: 'Extension Power',
    text: 'Extensions have never been so easy,',
    text2: 'more flexible than most flexible.'
  }
]

class MainPage extends React.Component {
  componentDidMount = () => {
    window.addEventListener('resize', () => this.forceUpdate())
  };
  render() {
    return (
      <div>
        <Carousel effect="fade"
                  autoplay>
          <div className={styles.banner1}
               style={{ height: window.innerWidth * 680 / 1920}}>
          </div>
          <div className={styles.banner2}
               style={{ height: window.innerWidth * 680 / 1920}}>
          </div>
          <div className={styles.banner3}
               style={{ height: window.innerWidth * 680 / 1920}}>
          </div>
        </Carousel>
        <Container>
          <Row>
            { services.map((t, i) => (
              <Col key={i} className={styles.wrapper} span="8">
                <div className={styles.icon}><Icon type={t.icon} /></div>
                <div className={styles.title}>{t.title}</div>
                <div className={styles.text}>{t.text}</div>
                <div className={styles.text}>{t.text2}</div>
              </Col>
            )) }
          </Row>
        </Container>
      </div>
    )
  }
}

export default MainPage
