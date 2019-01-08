import { error } from 'react-notification-system-redux';
import i18next from 'i18next';

export default (err, context) => {
  if (process.env.NODE_ENV !== 'development') {
    window.Raven.captureException(err, {
      extra: context,
    });
  } else {
    /* eslint no-console:0 */
    console.error(err);
  }

  const details = {
    ns: 'errorDialog',
    ...err.details,
  };

  return error({
    title: i18next.t('An error has occurred', details),
    message: i18next.t(err.message, details),
    position: 'tc',
    autoDismiss: 8,
  });
};
