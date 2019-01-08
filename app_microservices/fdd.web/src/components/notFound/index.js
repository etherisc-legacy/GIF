import React from 'react';
import Contact from 'components/contact';
import { translate } from 'react-i18next';

const NotFound = ({application, t}) => {
    return (
      <section id="main-content" className="clearfix">
        <h1>404</h1>
        <h2>{t('Content Not found')}</h2>

        <Contact />
      </section>
  );
}

NotFound.propTypes = {
  application: PropTypes.shape({}),
  t: PropTypes.func.isRequired,
};

export default translate('notFound')(NotFound);
