import React from 'react';
import { translate } from 'react-i18next';

const Privacy = ({ t }) => (
  <div className="step -left">
    <h1>{t('Privacy policy')}</h1>
    <iframe
      title="privacy-policy"
      width="100%"
      height="400px"
      frameBorder="0"
      src={t('privacy_policy_doc')}
    />
  </div>
);

export default translate('applyForm')(Privacy);
