import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button, TextInputField } from 'evergreen-ui';
import styled from 'styled-components';


const CardDetails = styled.div`
  background: #f1f1f1;
  padding: 20px;
  margin-bottom: 20px;
`;

/**
 * Checkout form with card charging
 */
@injectStripe
class CardForm extends Component {
  state = {
    form: {
      firstname: '',
      lastname: '',
      email: '',
      token: '',
    },
  };

  static propTypes = {
    stripe: PropTypes.shape().isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  /**
   * Handle application form field change
   * @param {string} field
   * @return {Function}
   */
  handleChange = field => (event) => {
    const { form } = this.state;

    this.setState({ form: { ...form, [field]: event.target.value } });
  };

  /**
   * Submit form
   * @param {Event} e
   */
  submit = (e) => {
    e.preventDefault();

    const { form } = this.state;
    const { stripe, handleSubmit } = this.props;

    stripe.createToken()
      .then((payload) => {
        if (payload.error) {
          console.error(payload.error);
        } else {
          const token = payload.token.id;

          handleSubmit({ ...form, token });
        }
      });
  };

  /**
   * Render component
   * @return {*}
   */
  render() {
    const { form } = this.state;
    const {
      firstname, lastname, email,
    } = form;

    return (
      <form onSubmit={this.submit}>
        <TextInputField
          label="Firstname"
          placeholder="Enter your firstname"
          value={firstname}
          onChange={this.handleChange('firstname')}
          required
        />

        <TextInputField
          label="Lastname"
          placeholder="Enter your lastname"
          value={lastname}
          onChange={this.handleChange('lastname')}
          required
        />

        <TextInputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={this.handleChange('email')}
          required
        />

        <CardDetails>
          <CardElement style={{ base: { fontSize: '16px' } }} hidePostalCode />
        </CardDetails>

        <Button appearance="primary" intent="success" type="submit" height={35}>Buy</Button>
      </form>
    );
  }
}

export default CardForm;
