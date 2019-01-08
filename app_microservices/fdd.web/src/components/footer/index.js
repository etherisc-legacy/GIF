import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import ToTop from 'react-icons/lib/fa/chevron-up';
import print from 'shared/components/printable/styles.m.css';
import styles from './styles.m.css';


export default class Footer extends Component {
  static propTypes = {
    showRedirectModal: PropTypes.func.isRequired,
  }

  state = {
    showScrollBtn: false,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.toggleScrollBtn);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.toggleScrollBtn);
  }

  toggleScrollBtn = () => {
    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (top > 0 && !this.state.showScrollBtn) {
      this.setState({showScrollBtn: true});
    }

    if (top <= 0 && this.state.showScrollBtn) {
      this.setState({showScrollBtn: false});
    }
  }

  scrollToTop = () => Scroll.animateScroll.scrollToTop()

  reportIssue = () => window.Raven.showReportDialog()

  redirect = (e) => {
    e.preventDefault();
    this.props.showRedirectModal({
      link: 'https://etherisc.com',
    });
  }

  render() {
    return (
      <section id="footer" className={print.notPrintable}>
        <div
          id="go-to-top"
          className={(this.state.showScrollBtn && 'active') || ''}
          onClick={this.scrollToTop}
        >
          <ToTop />
        </div>
        <div>
          <button className={styles.issue} onClick={this.reportIssue}>Report an issue</button>
        </div>
        <div className="footer-text-line">
          &copy; 2016-{new Date().getFullYear()} powered by <a onClick={this.redirect} href="https://etherisc.com" rel="noreferrer noopener">etherisc.com</a>
        </div>
      </section>
    );
  }
}
