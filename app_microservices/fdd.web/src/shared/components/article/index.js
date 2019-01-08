import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import print from 'shared/components/printable/styles.m.css';


export default class Acticle extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }

  state = {
    margin: 20,
    style: {},
  }

  componentDidMount() {
    this.setSections();
    window.addEventListener('resize', this.setSections);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSections);
  }

  setSections = () => {
    const docHeight = document.documentElement.clientHeight;
    const nodeHeight = this.content.clientHeight;

    const offset = Math.max((docHeight - nodeHeight) / 2, this.state.margin);
    const exceeds = nodeHeight > docHeight;

    const isMobile = window.innerWidth < 768;

    this.setState({
      style: {
        top: isMobile ? 0 : offset,
        position: isMobile ? 'static' : exceeds ? 'relative' : 'absolute',
        marginBottom: isMobile ? 0 : exceeds ? offset : 0,
      },
    });
  }

  render() {
    const { id, title, children } = this.props;

    return (
      <article id={id} className={cn('section-wrapper', 'clearfix', print.notPrintable)}>
        <div style={this.state.style} className="content-wrapper clearfix" ref={node => { this.content = node; }}>
          <div className="col-sm-12 pull-right">
            <h1 className="section-title">{title}</h1>
            {children}
          </div>
        </div>
      </article>
    );
  }
}
