import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.m.css';

const Printable = ({children}) => (
  <div className={styles.printable}>{children}</div>
);

Printable.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Printable;
