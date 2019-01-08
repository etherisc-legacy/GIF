import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { I18nextProvider } from 'react-i18next';
import Layout from '../containers/layout';


const Root = ({history, store, i18n}) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <I18nextProvider i18n={i18n}>
        <Layout history={history} />
      </I18nextProvider>
    </ConnectedRouter>
  </Provider>);

Root.propTypes = {
  store: PropTypes.shape({}),
  history: PropTypes.shape({}),
  i18n: PropTypes.shape({})
};

export default Root;
