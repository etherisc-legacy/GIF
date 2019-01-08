import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import {CardElement, injectStripe} from 'react-stripe-elements';
import { Field, reduxForm } from 'redux-form';
import { Checkbox } from 'shared/components/fields';
import { required } from 'shared/components/fields/validations';
import CustomConfig from './../../shared/customConfig';
import {connect} from "react-redux";

class CheckoutForm extends Component {
  static propTypes = {
    apply: PropTypes.func.isRequired,
    stripe: PropTypes.shape.isRequired,
  }

  submit = () => {
    this.props.apply({
      createSource: this.props.stripe.createSource,
    });
  }

  render() {
    const { t } = this.props;

    return (
      <form onSubmit={this.props.handleSubmit(this.submit)}>
        {process.env.DEMO && (<p style={{color: '#dfeb78'}}>(Enter test card: 4000056655665556 12/20 311 12345)</p>)}

        <div>
          <CardElement style={{base: {fontSize: '18px'}}} />
        </div>

        {CustomConfig.cardDetails.confirmReadTC && (
          <div>
            <label htmlFor="accept">
              <Field name="accept" label={t('confirm_read_and_accept')} component={Checkbox} type="checkbox" validate={[required]} />
            </label>
          </div>
        )}

        <div className="form-group form-style">
          {!this.props.lock && (
            <button className="btn btn-lg btn-outline-inverse" type="submit">{t('Pay')}</button>
          )}
        </div>
      </form>
    );
  }
}

const form = 'checkoutForm';

export default injectStripe(translate('checkoutForm')(connect()(reduxForm({ form })(CheckoutForm))));

