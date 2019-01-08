import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import moment from 'moment';
import * as appActions from 'modules/application/actions';
import TestModeNotification from 'components/testModeNotifications/testnet';


const PolicyApplied = ({application, showCertificate, t}) => (
  <div className="step">
    <div>
      {process.env.DEMO && <TestModeNotification />}

      <h1>{t(`Your ${process.env.DEMO ? 'test ' : ''} policy`)}</h1>

      <div>
        <p>{t(`You have applied for a ${process.env.DEMO ? 'test ' : ''} policy for flight`)}<br />
          <strong>
            {application.flight.carrier}{application.flight.flightNumber}
            &nbsp;{t('on')}&nbsp;
            {moment(application.flight.departureTime).format('YYYY-MM-DD')}
          </strong>
        </p>
      </div>

      <div className="sub-header proof">
        <div onClick={() => showCertificate()}>
          {t('Certificate of Insurance')}
        </div>
      </div>

      <div className="sub-header proof">
        <a href={`${process.env.ETHERSCAN}/tx/${application.policy.txHash}`} target="_blank" rel="noopener noreferrer">
          {t('View transaction on Etherscan')}
        </a>
      </div>
    </div>
  </div>
);

PolicyApplied.propTypes = {
  application: PropTypes.shape.isRequired,
  showCertificate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default connect(null, {
  showCertificate: appActions.showCertificate,
})(translate('policyApplied')(PolicyApplied));
