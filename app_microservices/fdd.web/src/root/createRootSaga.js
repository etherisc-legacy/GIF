import { all } from 'redux-saga/effects';
import ethereumSaga from '../modules/ethereum/sagas';
import apiSaga from '../modules/api/sagas';

export default () =>
  function* rootSaga() {
    yield all([
      ethereumSaga(),
      apiSaga(),
    ]);
  };
