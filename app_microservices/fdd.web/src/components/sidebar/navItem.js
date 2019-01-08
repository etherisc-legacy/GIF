import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

const { Link } = Scroll;

const NavItem = ({to, label}) => {
  if (/^https?:\/\//.test(to)) {
    return (<li id="menu-item-carousel" className="menu-item scroll">
      <a href={to}>{label}</a>
    </li>);
  } else {
    return (<li id="menu-item-carousel" className="menu-item scroll">
      <Link
        activeClass='active'
        to={to}
        spy={true}
        smooth={true}
        offset={0}
        duration={500}
        onClick={() => {
          if (window.location.pathname !== '/') {
            window.location = `/#${to}`;
          }
        }}
      >
        {label}
      </Link>
    </li>);
  }
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default NavItem;
