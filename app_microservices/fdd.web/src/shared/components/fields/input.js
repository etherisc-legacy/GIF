import React from 'react';
import PropTypes from 'prop-types';
import FdiField from './base';

const FdiInput = (props) => (
  <FdiField {...props}>
    <input {...props.input} disabled={props.disabled} className={props.className} type={props.type} />
  </FdiField>);

FdiInput.propTypes = {
  input: PropTypes.shape({}),
  className: PropTypes.string,
  type: PropTypes.string,
};

FdiInput.defaultProps = {
  className: '',
  type: 'text',
};

export default FdiInput;
