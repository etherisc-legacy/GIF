import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { StripeProvider } from 'react-stripe-elements';
import Checkout from 'components/checkout';
import { reduxForm } from 'redux-form';
import { reqApplyForPolicyFiat } from 'modules/api/actions';
import { COUPONS, CURRENCIES_LABELS } from 'shared/constants';
import Spinner from 'shared/components/spinner';
import Steps from 'components/steps';
import TestCardNotification from 'components/testModeNotifications/testCard';
import cn from 'classnames';
import visa from 'assets/images/visa.png';
import masterCard from 'assets/images/master-card.png';
import americanExpess from 'assets/images/american-express.png';
import CaptaionFrankLogo from 'assets/images/cp-logo.png';
import styles from './styles.m.css';
import CustomConfig from './../../shared/customConfig';
import moment from 'moment';


class CardDetails extends Component {
  static propTypes = {
    application: PropTypes.shape.isRequired,
    reqApplyForPolicyFiat: PropTypes.func.isRequired,
    setCurrentWizardView: PropTypes.func.isRequired,
  }

  state = {
    checked: true,
  }

  toggleCheck = () => this.setState({checked: !this.state.checked})

  apply = (data) => this.props.reqApplyForPolicyFiat({
    ...data,
    couponCode: this.state.checked &&
      this.props.application.policy.couponCode &&
      this.props.application.policy.couponCode.exists
      ? this.props.application.policy.coupon
      : null,
  })

  render() {
    const { application, setCurrentWizardView, t } = this.props;

    const policyTableValues = application.policy;

    const showTokenSummit3 = CustomConfig.policyTable.supportsCoupons !== false && policyTableValues.coupon &&
      policyTableValues.coupon === 'd1conf';

    const { premium } = policyTableValues;

    const coupon = CustomConfig.policyTable.supportsCoupons !== false && application.policy.couponCode && application.policy.couponCode.exists &&
    application.policy.couponCode[application.policy.currency];

    const total = premium - ((this.state.checked && coupon) || 0);

    application.policy && (application.policy.isApplyRequest || application.policy.isCreatePolicyRequest) ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll');

    return (
      <div className="step">
        {application.policy && (application.policy.isApplyRequest || application.policy.isCreatePolicyRequest) &&
        <div className="pause-overlay"/>
        }

        {process.env.DEMO && <TestCardNotification />}

        <h1>{t('Your')} {process.env.DEMO ? 'test ' : ''}{t('policy')}</h1>

        <Steps
          steps={application.steps}
          current={application.currentWizardView}
          set={setCurrentWizardView}
          lock={application.policy && (application.policy.isApplyRequest || application.policy.isCreatePolicyRequest)}
        />

        <div>
          <p>
            {t(`You are about to apply for a ${process.env.DEMO ? 'test ' : ''}policy for flight`)}{' '}
            <strong>{application.flight.carrier}{application.flight.flightNumber}</strong>
          </p>
        </div>


        <div className="sub-header">
          {t(`Please, enter your ${process.env.DEMO ? 'test' : ''} card details`)}
        </div>

        <div className="card-type">
          <div className="card-type__items">
            <div>
              <label htmlFor="card-0"><img alt="Visa" src={visa} /></label>
            </div>
            <div>
              <label htmlFor="card-1"><img alt="Master Card" src={masterCard} /></label>
            </div>
            <div>
              <label htmlFor="card-2"><img alt="American Express" src={americanExpess} /></label>
            </div>
          </div>
        </div>

        <StripeProvider apiKey={process.env.STRIPE_PKEY}>
          <Checkout
            apply={this.apply}
            lock={application.policy && (application.policy.isApplyRequest || application.policy.isCreatePolicyRequest)}
          />
        </StripeProvider>

        {CustomConfig.cardDetails.showFlightDetails && (
          <div style={{marginTop: 15, marginBottom: 15}}>
            <p dangerouslySetInnerHTML={{__html: t('flight_details', {
                carrier: application.flight.carrier,
                flightNumber: application.flight.flightNumber,
                departure: moment(application.flight.departureTime).utcOffset(moment.parseZone(application.flight.departureTime).utcOffset()).format('HH:mm YYYY-MM-DD '),
                origin: application.flight.origin,
                destination: application.flight.destination,
              })}} />
          </div>
        )}

        {process.env.DEMO ? (
          <div className={styles.details}>
            <div>
              {t('Premium')}, {CURRENCIES_LABELS[application.policy.currency]}: <b>{premium}</b>
            </div>
          </div>
        ) : (
          <div className={styles.details}>
            <div>
              {t('Premium')}, {CURRENCIES_LABELS[application.policy.currency]}: <b>{premium}</b>
            </div>

            {CustomConfig.policyTable.supportsCoupons !== false && coupon && this.state.checked && (
              <div className={styles.coupon}>
                Discount, {CURRENCIES_LABELS[application.policy.currency]}:{' '}
                <span><b>-{coupon}</b></span>
              </div>)}

            <div>{t('Stamp duty in Malta')}, EUR: <b>13.00</b></div>
            <div>
              {t('Discount for stamp duty')}, EUR
              <span className={styles.asterisc}>*</span>
              : <b>-13.00</b>
            </div>
            <div>
              {t('Total')},{' '}
              {CURRENCIES_LABELS[application.policy.currency]}:{' '}
              <b>{Math.round(total * 100) / 100}</b>
            </div>
            <div className={styles.note}>
              <span className={styles.asterisc}>*</span>
              {' '}- {t('Stamp Duty will be paid by Atlas Insurance PCC Limited on your behalf')}
            </div>
          </div>
        )}

        <div className={cn({
            [styles.spinnerPlace]: true,
            [styles.visible]:
              (application.policy && application.policy.isApplyRequest) ||
              (application.policy && application.policy.isCreatePolicyRequest),
          })}
        >
          {application.policy && application.policy.isApplyRequest && <Spinner info={t('Applying for a policy') + '...'} />}
          {application.policy && application.policy.isCreatePolicyRequest && CustomConfig.workflow.waitTx &&
            <Spinner info={t('Waiting for transaction to be mined') + '...'} />
          }

        </div>
      </div>
    );
  }
}

const form = 'checkout';

export default translate('cardDetails')(connect(
  ({application}) => ({application}),
  {
    reqApplyForPolicyFiat,
  },
)(reduxForm({ form })(CardDetails)));
