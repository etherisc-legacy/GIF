import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ input, label }) => (
  <div className="form-group form-style">
    {label && (
      <label htmlFor={input.name}>{label}</label>
    )}
    <input
      type="text"
      className="form-control text-field"
      id={input.name}
      value={input.value}
      onChange={input.onChange}
    />
  </div>
);

Input.propTypes = {
  input: PropTypes.shape.isRequired,
  label: PropTypes.string.isRequired,
};

export default Input;
