import React from 'react';
import PropTypes from 'prop-types';
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './checkoutForm';
import CustomConfig from './../../shared/customConfig';

const Checkout = ({ apply, lock }) => (
  <Elements locale={CustomConfig.i18nOpts.lng}>
    <CheckoutForm apply={apply} lock={lock} />
  </Elements>
);

Checkout.propTypes = {
  apply: PropTypes.func.isRequired,
};

export default Checkout;
