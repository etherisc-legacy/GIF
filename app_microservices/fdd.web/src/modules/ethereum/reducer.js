import { handleActions } from 'redux-actions';
import * as ethActions from './actions';

const reducer = handleActions({
  [ethActions.setNetworkData]: (state, {payload}) => ({
    ...state,
    network: {
      ...state.network,
      ...payload,
    },
  }),
}, {
  network: {},
});

export default reducer;
