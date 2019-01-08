import createHistory from 'history/createBrowserHistory';
import configureStore from './configureStore';
import renderApp from './renderApp';
import Root from './Root';
import configureI18n from './i18n';

export default () => {
  const history = createHistory();
  const store = configureStore(history);
  const i18n = configureI18n();

  const rootProps = {
    history,
    store,
    i18n,
  };

  renderApp(Root, rootProps);

  if (module.hot) {
    module.hot.accept('./Root', () => {
      const nextRoot = require('./Root').default;
      renderApp(nextRoot, rootProps);
    });
  }

  // if (process.env.NODE_ENV === 'production') {
  //   require('./enableOfflineMode');
  // }
};
