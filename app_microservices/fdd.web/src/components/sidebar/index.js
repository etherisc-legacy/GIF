import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import Th from 'react-icons/lib/fa/th';
import logo from 'assets/images/origami-bird-transparent-50dpi.png';
import print from 'shared/components/printable/styles.m.css';
import NavItem from './navItem';

const { scrollSpy } = Scroll;

export default class Sidebar extends Component {
  static propTypes = {
    showRedirectModal: PropTypes.func.isRequired,
  }

  state = {
    showMenu: true,
  }

  componentDidMount() {
    scrollSpy.update();
  }

  toggleMainMenu = () => this.setState({showMenu: !this.state.showMenu})

  redirect = (e) => {
    e.preventDefault();
    this.props.showRedirectModal({
      link: 'http://www.atlas.com.mt',
    });
  }

  render() {
    let menu = null;
    if (process.env.SUGGEST_DEMO) {
      menu = (<ul id="main-menu">
        <NavItem to="https://fdd-demo.etherisc.com" label="try demo" />
        <NavItem to="watchPolicy" label="watch your policy" />
        <NavItem to="fdi_contact" label="contact" />
      </ul>);
    } else if (process.env.DEMO) {
      menu = (<ul id="main-menu">
        <NavItem to="fdi_apply" label="apply for test policy" />
        <NavItem to="watchPolicy" label="watch your test policy" />
        <NavItem to="fdi_contact" label="contact" />
      </ul>);
    } else {
      menu = (<ul id="main-menu">
        <NavItem to="fdi_apply" label="apply for policy" />
        <NavItem to="watchPolicy" label="watch your policy" />
        <NavItem to="fdi_contact" label="contact" />
      </ul>);
    }

    return (
      <section id="fdi-sidebar" className={print.notPrintable}>
        <div className="logo">
          <img src={logo} alt="Etherisc" />
        </div>
        <div id="mobile-menu-icon" className="visible-xs" onClick={this.toggleMainMenu}>
          <Th />
        </div>
        {this.state.showMenu && menu}
      </section>
    );
  }
}
