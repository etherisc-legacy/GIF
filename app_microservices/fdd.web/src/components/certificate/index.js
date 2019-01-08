import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import { CURRENCIES_LABELS } from 'shared/constants';
import { translate } from 'react-i18next';
import CertificateBlank from './certificateBlank';
import styles from './styles.m.css';
import TestModeNotification from 'components/testModeNotifications/testnet';

const Certificate = ({application, t}) => {
  const certificate = {
    policyHolder: {
      firstname: application.firstName,
      lastname: application.lastName,
      email: application.email,
    },
    number: application.policy.policyToken,
    flight: {
      carrier: application.flight.carrier,
      flightNumber: application.flight.flightNumber,
      origin: application.flight.origin,
      destination: application.flight.destination,
      departsAt: `${moment(application.flight.departureTime).utcOffset(moment.parseZone(application.flight.departureTime).utcOffset()).locale(t('locale')).format(t('time_format'))} (${t('local time')})`,
      arrivesAt: `${moment(application.flight.arrivalTime).utcOffset(moment.parseZone(application.flight.arrivalTime).utcOffset()).locale(t('locale')).format(t('time_format'))} (${t('local time')})`,
    },
    policyStartDate: `${moment.unix(application.policy.createdAt).utc().locale(t('locale')).format(t('time_format'))} GMT (Greenwich Mean Time)`,
    policyExpireDate: `${moment(application.flight.arrivalTime).utcOffset(moment.parseZone(application.flight.arrivalTime).utcOffset()).add(24, 'hours').locale(t('locale')).format(t('time_format_destination'))} (${t('local time at destination')})`,

    premium: {
      amount: application.policy.premium,
      currency: CURRENCIES_LABELS[Number(application.policy.currency)],
    },
    compensation: {
      d15: application.policy.payouts.p1,
      d30: application.policy.payouts.p2,
      d45: application.policy.payouts.p3,
      can: application.policy.payouts.p4,
      div: application.policy.payouts.p5,
    },
  };

  return (
    <div className={cn(styles.certificate, 'step')}>
      {process.env.DEMO && <TestModeNotification />}
      <h1>{t('CERTIFICATE OF INSURANCE')}</h1>
      <CertificateBlank certificate={certificate} />
    </div>
  );
};

Certificate.propTypes = {
  application: PropTypes.shape({}),
  t: PropTypes.func.isRequired,
};

export default translate('certificate')(Certificate);
