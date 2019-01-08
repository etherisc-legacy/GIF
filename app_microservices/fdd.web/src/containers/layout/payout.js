import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { FdiInput } from 'shared/components/fields';


class Payout extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  submit = () => {}

  render() {
    const {
      handleSubmit,
    } = this.props;

    return (
      <div id="outer-container">
        <section className="clearfix" style={{position: 'relative', width: '500', margin: 'auto'}}>
          <h1>Payout</h1>
          <p>Please, specify preferred payout type</p>
          <p>Payout request: #{this.props.id}</p>

          <form onSubmit={handleSubmit(this.submit)}>
            <div>
              <Field
                name="payoutType"
                className="form-control text-field"
                component={FdiInput}
                type="radio"
                label="Skrill"
                value="skrill"
              />
            </div>

            <div>
              <Field
                name="payoutType"
                className="form-control text-field"
                component={FdiInput}
                type="radio"
                label="PayPal"
                value="paypal"
              />
            </div>

            <div>
              <Field
                name="payoutType"
                className="form-control text-field"
                component={FdiInput}
                type="radio"
                label="Debit card (Visa/Mastercard)"
                value="card"
              />
            </div>

            <div>
              <button type="submit">PayOut</button>
            </div>

          </form>
        </section>
      </div>
    );
  }
}

const form = 'payout';

export default connect(null, {})(reduxForm({form})(Payout));
