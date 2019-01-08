import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const FdiField = ({
  input,
  children,
  label,
  meta: { touched, error, warning },
  everytime,
}) => (
  <div className={`form-group form-style -${input.name}`}>
    <label htmlFor={input.name}>{label}</label>
    <div className={cn({
        fieldError: (touched || everytime) && error,
        fieldWarning: (touched || everytime) && warning,
      })}
    >
      {children}
      {(touched || everytime) && ((error && <span className="errorMessage">{error}</span>) || (warning && <span className="warningMessage">{warning}</span>))}
    </div>
  </div>);

FdiField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
  }),
  children: PropTypes.element.isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    warning: PropTypes.string,
  }),
  everytime: PropTypes.bool,
};

FdiField.defaultProps = {
  input: {},
  label: '',
  meta: {
    touched: null,
    error: null,
    warning: null,
  },
  everytime: false,
};

export default FdiField;
