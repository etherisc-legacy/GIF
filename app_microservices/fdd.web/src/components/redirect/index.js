import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Redirect extends Component {
  static propTypes = {
    link: PropTypes.string.isRequired,
  }

  state = {
    currentCount: 9,
  }

  componentDidMount() {
    const intervalId = setInterval(this.timer, 1000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer = () => {
    const newCount = this.state.currentCount - 1;
    if (newCount >= 0) {
      this.setState({ currentCount: newCount });
    } else {
      clearInterval(this.state.intervalId);
      window.location.replace(this.props.link);
    }
  }


  render = () => (
    <div className="step -left">
      <h1>Redirect</h1>
      <p>
        <center>
          You will be redirected to{' '}
          {this.props.link} in {this.state.currentCount} sec.
        </center>
      </p>
    </div>
  )
}
