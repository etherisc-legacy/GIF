import { reducer as form } from 'redux-form';
import {reducer as notifications} from 'react-notification-system-redux';
import ethereum from 'modules/ethereum/reducer';
import application from 'modules/application/reducer';

export default {
  form,
  ethereum,
  application,
  notifications,
};
