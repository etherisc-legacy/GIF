import React from 'react';
import PropsTypes from 'prop-types';
import { translate } from 'react-i18next';
import styles from './styles.m.css';
import TestModeNotification from 'components/testModeNotifications/testnet';


const ErrorDialog = ({ application, t }) => (
  <div className="step -left">
    <div className={styles.content}>
      {process.env.DEMO && <TestModeNotification />}

      <h1>{t((application.error && application.error.title) || '')}</h1>
      <div dangerouslySetInnerHTML={{__html: t((application.error && application.error.message) || '', { ...application.error.details })}} />
    </div>
  </div>
);

ErrorDialog.propTypes = {
  application: PropsTypes.shape({}),
  t: PropsTypes.func.isRequired(),
};

export default translate('errorDialog')(ErrorDialog);
