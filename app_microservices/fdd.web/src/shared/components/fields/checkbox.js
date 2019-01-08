import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.m.css';

const Checkbox = ({
  input,
  label,
  className,
  type,
  meta: { touched, error, warning },
}) => (
  <div className={cn('form-group', 'form-style', styles.cb)}>
    <label htmlFor={input.name}>
      <input id={input.name} {...input} className={className} type={type} checked={input.value}/>
      <span>{label}</span>
    </label>
    {
      touched &&
      ((error && <div className={styles.cbError}>{error}</div>) ||
      (warning && <div className={styles.cbWarning}>{warning}</div>))
    }
  </div>);

Checkbox.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
  }),
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    warning: PropTypes.string,
  }),
  label: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
};

Checkbox.defaultProps = {
  input: {},
  className: '',
  label: '',
  type: 'checkbox',
  meta: {
    touched: null,
    error: null,
    warning: null,
  },
};

export default Checkbox;
