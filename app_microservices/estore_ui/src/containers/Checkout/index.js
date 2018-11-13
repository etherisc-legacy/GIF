import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { StripeProvider, Elements } from 'react-stripe-elements';
import products from 'products.json';
import numeral from 'numeral';
import CardForm from './form';


const Article = styled.article`
  padding: 100px 20px 20px;
  width: 900px;
  margin: 0 auto;
`;

const Product = styled.div`
  display: flex;
`;

const Details = styled.div`
  flex-glow: 1;
  padding-left: 20px;
`;

const CheckoutForm = styled.div`
  padding: 20px;
  border: 2px solid #39a065;
  background: #fff;
  margin-top: 30px;
  border-radius: 4px;
`;

const Option = styled.div`
  margin-bottom: 8px;
  
  span {
    margin-left: 10px;
  }
`;

const Purchase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

/**
 * Checkout page
 */
class Checkout extends Component {
  state = {
    insurance: 0,
    insuranceOptions: [
      { label: 'No', price: 0 },
      { label: '1 year', price: 10 },
      { label: '2 year', price: 15 },
      { label: '3 year', price: 20 },
    ],
    product: products.find((p) => {
      const { match: { params: { vendorCode } } } = this.props;
      return p.vendorCode === vendorCode;
    }),

    loading: false,

    purchase: null,
  };

  static propTypes = {
    request: PropTypes.func.isRequired,
    match: PropTypes.shape().isRequired,
  };

  /**
   * Calculate total sum
   * @param {number} value
   * @return {number}
   */
  getTotal(value) {
    const price = Number(value);
    const { insuranceOptions, insurance } = this.state;

    return price * (1 + insuranceOptions[insurance].price / 100);
  }

  /**
   * Select insurance option
   * @param {string} insurance
   * @return {void}
   */
  setInsurance = insurance => () => this.setState({ insurance });

  /**
   * Submit checkout form
   * @param {{}} data
   */
  handleSubmit = (data) => {
    const { insurance, product, insuranceOptions } = this.state;
    const { request } = this.props;

    this.setState({ loading: true });

    if (insurance) {
      const input = {
        customer: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
        },
        policy: {
          distributorId: '11111111-1111-1111-1111-111111111111',
          vendorCode: product.vendorCode,
          product: product.product,
          premium: product.price * insuranceOptions[insurance].price,
          sumInsured: product.price,
          currency: product.currency,
          expiration: insuranceOptions[insurance].label,
        },
      };

      request('newPolicy', input)
        .then((result) => {
          this.setState({
            loading: false,
            purchase: {
              product: {
                vendorCode: product.vendorCode,
                product: product.product,
              },
              policy: {
                id: result.data.events.LogPolicySetState.returnValues._policyId,
                transactionHash: result.data.transactionHash,
              },
            },
          });
        });
    } else {
      this.setState({
        loading: false,
        purchase: {
          product: {
            vendorCode: product.vendorCode,
            product: product.product,
          },
        },
      });
    }
  };

  /**
   * Render component
   * @return {*}
   */
  render() {
    const {
      insurance, insuranceOptions, product, loading, purchase,
    } = this.state;

    const options = insuranceOptions.map((option, i) => (
      <Option key={option.label} name={option.label}>
        <label htmlFor={option.label}>
          <input
            type="radio"
            name="insurance"
            value={option.label}
            checked={insurance === i}
            onChange={this.setInsurance(i)}
          />
          <span>
            {option.label} {option.price !== 0 && <div>(+ {numeral(product.price * option.price / 100).format('0,0.00')} {product.currency})</div>}
          </span>
        </label>
      </Option>
    ));

    const NETWORK = 'mainnet';
    const etherscanUrl = NETWORK === 'mainnet' ? 'https://etherscan.io' : `https://${NETWORK}.etherscan.io`;

    return (
      <Article>
        <Helmet>
          <title>Checkout</title>
        </Helmet>

        <Product>
          <img src={product.image} width="200" alt={product.product} />

          <Details>
            <h2>{product.product}</h2>
            <p>{product.details}</p>

            <p>
              <b>
                Price: {numeral(product.price).format('0,0.00')} {product.currency}
              </b>
            </p>
          </Details>
        </Product>

        {!loading && !purchase && (
          <CheckoutForm>
            <h3>Checkout</h3>

            <p>Additional insurance:</p>

            {options}

            <h4>Total: {numeral(this.getTotal(product.price)).format('0,0.00')} {product.currency}</h4>

            <StripeProvider apiKey="pk_RXwtgk4Z5VR82S94vtwmam6P8qMXQ">
              <Elements>
                <CardForm handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
              </Elements>
            </StripeProvider>

          </CheckoutForm>
        )}

        {loading && !purchase && (
          <Purchase>
            <img src="/assets/preloader.gif" alt="Preloader" />
          </Purchase>
        )}

        {!loading && purchase && (
        <div style={{ textAlign: 'center' }}>
          <h3>Congratulations!</h3>
          <p><b>Your purchase:</b></p>
          <p>Product: {product.product}</p>

          {purchase.policy && (
          <div>
            <p><b>Policy ID:</b></p>
            <p>{purchase.policy.id}</p>
            <p>
              <a href={`${etherscanUrl}/tx/${purchase.policy.transactionHash}`} target="_blank" rel="noopener noreferrer">
                Transaction
              </a>
            </p>
          </div>
          )}
        </div>
        )}

      </Article>
    );
  }
}

export default Checkout;
