import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button, Text, TextInputField } from 'evergreen-ui';
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
      from: '',
      to: '',
      date: '',
      token: '',
    },
  };

  static defaultProps = {
    stripe: {},
  };

  static propTypes = {
    stripe: PropTypes.shape(),
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
    const { firstname, lastname, email } = form;
    const { stripe, handleSubmit } = this.props;

    stripe.createSource({
      type: 'card',
      owner: {
        name: `${lastname} ${firstname}`,
        email,
      },
    })
      .then((payload) => {
        if (payload.error) {
          console.error(payload.error);
        } else {
          const sourceId = payload.source.id;

          handleSubmit({ ...form, sourceId });
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
      firstname, lastname, email, from, to, date,
    } = form;

    return (
      <form onSubmit={this.submit}>

        <TextInputField
          label="First name"
          placeholder="Enter your first name"
          value={firstname}
          onChange={this.handleChange('firstname')}
        />

        <TextInputField
          label="Last name"
          placeholder="Enter your last name"
          value={lastname}
          onChange={this.handleChange('lastname')}
        />

        <TextInputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={this.handleChange('email')}
        />

        <TextInputField
          label="From"
          placeholder="Departure airport, e.g. SFO"
          value={from}
          onChange={this.handleChange('from')}
        />

        <TextInputField
          label="To"
          placeholder="Arrival airport, e.g. ZRH"
          value={to}
          onChange={this.handleChange('to')}
        />

        <TextInputField
          label="Date of departure"
          placeholder="Enter date of departure, e.g. 2018-09-01"
          value={date}
          onChange={this.handleChange('date')}
        />

        <Text display="block" paddingBottom={5}>Visa (debit): 4000056655665556</Text>

        <CardDetails>
          <CardElement style={{ base: { fontSize: '16px' } }} hidePostalCode />
        </CardDetails>

        <Button appearance="primary" intent="success" type="submit" height={35} float="right">Apply</Button>
      </form>
    );
  }
}

export default CardForm;
