import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { calculatePayouts } from 'shared/calculations';
import { CURRENCIES, MIN_PREMIUM, MAX_PREMIUM, SUGGESTED_PREMIUM } from 'shared/constants';
import { FdiInput } from 'shared/components/fields';
import { required, number } from 'shared/components/fields/validations';
import { submitPolicyTable, selectEth, selectFiat } from 'modules/application/actions';
import { checkCoupon } from 'modules/api/actions';
import i18next from 'i18next';
import Steps from 'components/steps';
import cn from 'classnames';
import Spinner from 'shared/components/spinner';
import TestModeNotification from 'components/testModeNotifications/testnet';
import cardStyles from '../cardDetails/styles.m.css';
import styles from './styles.m.css';
import CustomConfig from './../../shared/customConfig';

let currentCurrency = '3';

class PolicyTable extends Component {
  static propTypes = {
    application: PropTypes.shape.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    currency: PropTypes.string.isRequired,
    premium: PropTypes.number.isRequired,
    initialValues: PropTypes.shape.isRequired,
    submitPolicyTable: PropTypes.func.isRequired,
    selectEth: PropTypes.func.isRequired,
    selectFiat: PropTypes.func.isRequired,
    setCurrentWizardView: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  }

  state = {
    checked: true,
  }

  componentDidMount() {
    const { application } = this.props;
    if (
      (application.policy && application.policy.currency) &&
      (application.policy && application.policy.premium)
    ) {
      this.setFields(application.policy.currency, application.policy.premium);
    } else if (window.web3 && CustomConfig.policyTable.supportsEth !== false) {
      this.setFields('0', SUGGESTED_PREMIUM[Number('0')]);
      this.props.selectEth();
    } else {
      this.setFields('1', SUGGESTED_PREMIUM[Number('1')]);
      this.props.selectFiat();
    }
  }

  setFields = (cur, premium) => {
    currentCurrency = cur;
    this.props.change('currency', cur);
    this.props.change('premium', premium);
  }

  toggleCheck = () => this.setState({checked: !this.state.checked})

  selectCurrency = (e) => {
    if (
      this.props.application && this.props.application.policy &&
      (
        this.props.application.policy.isApplyPolicyEthReq ||
        this.props.application.policy.isCreatePolicyEthReq ||
        this.props.application.policy.isApplyRequest ||
        this.props.application.policy.isCreatePolicyRequest
      )
    ) {
      return;
    }


    const eth = e.target.value === '0';

    currentCurrency = e.target.value;
    this.props.change('premium', SUGGESTED_PREMIUM[Number(currentCurrency)]);
    if (eth) {
      this.props.selectEth();
    } else {
      this.props.selectFiat();
    }
  }

  minPremium = value => {
    const min = MIN_PREMIUM[Number(currentCurrency)];
    return value && value < min ? i18next.t('must_be_great_or_equal', { min, ns: 'validations' }) : undefined;
  }

  maxPremium = value => {
    const max = MAX_PREMIUM[Number(currentCurrency)];
    return value && value > max ? i18next.t('must_be_less_or_equal', { max, ns: 'validations' }) : undefined;
  }

  checkCoupon = e => {
    this.props.checkCoupon({couponCode: e.target.value, date: this.props.application.date});
  }

  calculatePayouts = calculatePayouts(this.props.application.flight.flightRating);

  submit = values => {
    this.props.submitPolicyTable({
      ...values,
      payouts: this.calculatePayouts(values.premium, values.currency),
      couponCode: this.state.checked && this.props.application.policy &&
      this.props.application.policy.couponCode &&
      this.props.application.policy.couponCode.exists
        ? this.props.application.policy.couponCode
        : null,
      date: this.props.application.date,
    });
  }

  render() {
    const {
      handleSubmit,
      application,
      setCurrentWizardView,
      currency,
      premium,
      coupon,
      t
    } = this.props;

    const cur = CURRENCIES[currency || 0];
    const curCode = cur.code;
    const curLabel = cur.label;

    const payouts = this.calculatePayouts(premium, currency);

    let showTokenSummit3 = false;
    if (
      CustomConfig.policyTable.supportsCoupons !== false
      && coupon
      && currency === '0'
      && application.policy
      && application.policy.couponCode
      && application.policy.couponCode.exists
      && application.policy.couponCode.code === 'd1conf') {

      showTokenSummit3 = true;
    }

    const applyStarted = (application.policy && application.policy.isApplyPolicyEthReq) ||
    (application.policy && application.policy.isCreatePolicyEthReq)

    return (
      <div className="step">
        {process.env.DEMO && <TestModeNotification />}

        <h1>{t('Your')} {process.env.DEMO ? 'test ' : ''} {t('policy')}</h1>

        <Steps
          steps={application.steps}
          current={application.currentWizardView}
          set={setCurrentWizardView}
          lock={application.policy && (application.policy.isCreatePolicyEthReq || application.policy.isApplyPolicyEthReq)}
        />

        <p>
          {t(`You are about to apply for a ${process.env.DEMO ? 'test ' : ''}policy for flight`)}{' '}
          {' '}
          <strong>{application.flight.carrier}{application.flight.flightNumber}</strong>
        </p>

        <form onSubmit={handleSubmit(this.submit)}>

          {!applyStarted && (
          <div>
            <div className="payment-type">
              <div className="payment-type__title">
                <strong>{t('Currency')}:</strong>
              </div>
              <div className="payment-type__items">
                {/* {CustomConfig.policyTable.supportsEth !== false &&
                  <div>
                    <label htmlFor="eth">
                      <Field id="eth" name="currency" onChange={v => this.selectCurrency(v)} component="input"
                             type="radio" value="0"/>
                      <span>ETH</span>
                    </label>
                  </div>
                } */}
                {CustomConfig.policyTable.disabledEth &&
                <div className={styles.disabled}>
                  <label htmlFor="eth">
                    <Field id="eth" name="currency" onChange={v => this.selectCurrency(v)} component="input"
                           type="radio" value="0" disabled />
                    <span>ETH</span>
                    <div className={styles.small}>(back soon!)</div>
                  </label>
                </div>
                }
                <div>
                  <label htmlFor="eur">
                    <Field id="eur" name="currency" onChange={v => this.selectCurrency(v)} component="input"
                           type="radio" value="1" />
                    <span>EUR</span>
                  </label>
                </div>
                <div className={styles.disabled}>
                  <label htmlFor="usd">
                    <Field id="usd" name="currency" onChange={v => this.selectCurrency(v)} component="input"
                           type="radio" value="2" disabled />
                    <span>USD</span>
                    <div className={styles.small}>(back soon!)</div>
                  </label>
                </div>
                <div className={styles.disabled}>
                  <label htmlFor="gbp">
                    <Field id="gbp" name="currency" onChange={v => this.selectCurrency(v)} component="input"
                           type="radio" value="3" disabled />
                    <span>GBP</span>
                    <div className={styles.small}>(back soon!)</div>
                  </label>
                </div>
              </div>
            </div>

            <div className={cn(CustomConfig.policyTable.supportsCoupons !== false ? 'col-md-6' : 'col-md-12')}>
              <Field
                name="premium"
                everytime
                className="form-control text-field"
                component={FdiInput}
                label={t('Premium')}
                validate={[required, number, this.minPremium, this.maxPremium]}
              />
            </div>

            {CustomConfig.policyTable.supportsCoupons !== false &&
              <div className="col-md-6">
                <Field
                  disabled={process.env.DEMO}
                  name="coupon"
                  onChange={(v) => this.checkCoupon(v)}
                  normalize={v => v}
                  className="form-control text-field"
                  component={FdiInput}
                  label="Coupon code (optional)"
                />
              </div>
            }

            <div className="info-text">
              {t(`If you pay the premium in ${curLabel} the payout will also be in ${curLabel}`)}
            </div>
          </div>)}

          <div className="form-group form-style -withTable">
            <table className="table">
              <tbody>
                <tr>
                  <td colSpan="6">
                    <strong>
                      {t('Payouts for premium')}:{' '}
                      {premium}<span dangerouslySetInnerHTML={{__html: curCode}} />
                    </strong>
                  </td>
                </tr>
                <tr className="policy-row">
                  <td>{t('Delay in minutes')}</td>
                  {/* <td>15 - 29</td>
                  <td>30 - 44</td> */}
                  <td>45+</td>
                  <td>{t('Cancelled')}</td>
                  <td>{t('Diverted')}</td>
                </tr>
                <tr className="policy-row">
                  <td>{t('Payout')}</td>
                  {/* <td>
                    {payouts && payouts.p1}<span dangerouslySetInnerHTML={{__html: curCode}} />
                  </td>
                  <td>
                    {payouts && payouts.p2}<span dangerouslySetInnerHTML={{__html: curCode}} />
                  </td> */}
                  <td>
                    {payouts && payouts.p3}<span dangerouslySetInnerHTML={{__html: curCode}} />
                  </td>
                  <td>
                    {payouts && payouts.p4}<span dangerouslySetInnerHTML={{__html: curCode}} />
                  </td>
                  <td>
                    {payouts && payouts.p5}<span dangerouslySetInnerHTML={{__html: curCode}} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {showTokenSummit3 && (
            <div>

              <div className={cardStyles.details}>
                <div>
                  {t('Premium')}, {curLabel}: <b>{premium}</b>
                </div>

                {this.state.checked && (
                  <div className={cardStyles.coupon}>
                    Discount, {curLabel}:{' '}
                    <span><b>-{application.policy.couponCode[currency]}</b></span>
                  </div>)}

                {this.state.checked && (
                  <div className={cardStyles.info}>
                    The discount will be paid back after the policy and discount have been approved
                  </div>
                )}

                <div>{t('Stamp duty in Malta')}, EUR: <b>13.00</b></div>
                <div>
                  {t('Discount for stamp duty')}, EUR
                  <span className={cardStyles.asterisc}>*</span>
                  : <b>-13.00</b>
                </div>
                <div>
                  {t('Total')},{' '}
                  {curLabel}:{' '}
                  <b>{premium - application.policy.couponCode[currency]}</b>
                </div>
                <div className={cardStyles.note}>
                  <span className={cardStyles.asterisc}>*</span>
                  {' '}- {t('Stamp Duty will be paid by Atlas Insurance PCC Limited on your behalf')}
                </div>
              </div>
            </div>
          )}

          <div className="form-group form-style">
            {!applyStarted && (
              <button id="fdi_apply_btn_apply" type="submit" className="btn btn-lg btn-outline-inverse">
                {t('Apply')}
              </button>)}
          </div>

          <div className={cn({
            [styles.spinnerPlace]: true,
            [styles.visible]:
              (application.policy && application.policy.isApplyPolicyEthReq) ||
              (application.policy && application.policy.isCreatePolicyEthReq),
          })}
          >
            {application.policy && application.policy.isApplyPolicyEthReq &&
              <Spinner info={t('Applying for a policy') + '...'} />
            }
            {application.policy && application.policy.isCreatePolicyEthReq &&
              <Spinner info={t('Waiting for transaction to be mined') + '...'} />
            }
          </div>


        </form>
      </div>
    );
  }
}

const form = 'policyTable';
const selector = formValueSelector(form);

export default connect(
  state => (
    {
      initialValues: {
        currency: (state.application.policy && state.application.policy.currency),
        premium: (state.application.policy && state.application.policy.premium),
        coupon: (state.application.policy && state.application.policy.coupon) || '',
      },
      premium: selector(state, 'premium'),
      currency: selector(state, 'currency'),
      coupon: selector(state, 'coupon'),
      application: state.application,
    }),
  {
    submitPolicyTable,
    selectEth,
    selectFiat,
    checkCoupon,
  },
)(reduxForm({ form })(translate('policyTable')(PolicyTable)));
