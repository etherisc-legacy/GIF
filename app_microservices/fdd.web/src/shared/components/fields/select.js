import 'react-select/dist/react-select.css';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FdiField from './base';

const FdiSelect = (props) => (
  <FdiField {...props}>
    <Select
      {...props}
      value={props.input.value}
      onChange={(value) => props.input.onChange(value)}
      onBlur={() => props.input.onBlur(props.input.value)}
      onFocus={() => props.input.onFocus()}
      options={props.options}
    />
  </FdiField>);

FdiSelect.propTypes = {
  input: PropTypes.shape({}),
};

export default FdiSelect;
