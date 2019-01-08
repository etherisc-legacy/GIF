import React, { Component } from 'react';
import bgSource from 'assets/images/bg5.jpg';
import styles from './styles.m.css';

const clamp = (x, low, high) => Math.min(Math.max(x, low), high);

export default class Background extends Component {
  state = {
    bgSource,
    bgImgStyles: {
      opacity: 0,
      backgroundImage: '',
    },
    wrapperStyles: {
      transform: '',
    },
  }

  componentDidMount() {
    window.addEventListener('scroll', this.calcPosition);
    const img = document.createElement('img');
    img.src = this.state.bgSource;
    img.addEventListener('load', this.fadeIn);
    this.img = img.src;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.calcPosition);
  }

  fadeIn = () => this.setState({ bgImgStyles: { opacity: 1, backgroundImage: `url(${this.state.bgSource})` } })

  calcPosition = () => {
    const { scrollY } = window;
    const { offsetTop, offsetHeight } = this.node;
    const dim = ((scrollY - offsetTop) * 0.2) / offsetHeight;
    const transform = `translateY(-${clamp((dim * 100).toFixed(0), (-0.25 * offsetHeight).toFixed(0), (0.75 * offsetHeight).toFixed(0))}px) translateZ(0)`;

    this.setState({ wrapperStyles: { transform } });
  }

  render() {
    return (
      <div className={styles.bg} ref={node => { this.node = node; }}>
        <div className={styles.screen}>
          <div style={this.state.wrapperStyles} className={styles.screenBack}>
            <div
              className={styles.bgImageContainer}
              style={{...this.state.bgImgStyles}}
            />
          </div>
        </div>
        <div className={styles.overlay} />
      </div>
    );
  }
}
