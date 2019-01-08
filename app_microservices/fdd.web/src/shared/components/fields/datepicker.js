import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { translate } from 'react-i18next';
import FdiField from './base';


class FdiDatePicker extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    className: PropTypes.string,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    className: '',
  }

  handleChange = (date) =>
    this.props.input.onChange(date ? moment(date).format('YYYY-MM-DD') : null)

  render() {
    const {
      input,
      className,
      t,
    } = this.props;

    return (
      <FdiField {...this.props}>
        <DatePicker
          {...input}
          {...this.props}
          className={className}
          dateFormat="YYYY-MM-DD"
          selected={input.value ? moment(input.value, 'YYYY-MM-DD') : null}
          onChange={this.handleChange}
        />
      </FdiField>
    );
  }
}

export default translate('datepicker')(FdiDatePicker);
