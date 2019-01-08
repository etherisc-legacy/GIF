import React from 'react';
import { translate } from 'react-i18next';

const InfoForPolicyholders = ({ t }) => (
  <div className="step -left">
    <h1>{t('Information for Existing and Prospective Policyholders')}</h1>
    <iframe
      title="policy-terms"
      width="100%"
      height="400px"
      frameBorder="0"
      src={t('policy_holder_doc')} />
  </div>
);

export default translate('applyForm')(InfoForPolicyholders);
