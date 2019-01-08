import React from 'react';
import { translate } from 'react-i18next';
import CustomConfig from './../../shared/customConfig';

const Terms = ({ t }) => (
  <div className="step -left">
    <h1>{t('Terms of Insurance Policy')}</h1>
    <iframe
      title="policy-terms"
      width="100%"
      height="400px"
      frameBorder="0"
      src={t('policy_terms_doc')} />
  </div>
);

export default translate('applyForm')(Terms);
