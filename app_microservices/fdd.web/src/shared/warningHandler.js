import { warning } from 'react-notification-system-redux';
import i18next from 'i18next';

export default (type, message, context) => {
  const warningData = {
    title: i18next.t(type, { ns: 'warningDialog' }),
    position: 'tc',
    uid: type,
    autoDismiss: 8,
  };
  if (message) { warningData.message = i18next.t(message, { ns: 'warningDialog' }) }
  return warning(warningData);
};
