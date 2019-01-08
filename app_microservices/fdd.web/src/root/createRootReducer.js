import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import reducers from './reducers';

export default () =>
  combineReducers({
    ...reducers,
    router,
    form,
  });
