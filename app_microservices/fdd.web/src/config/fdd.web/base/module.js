/* eslint-disable no-unused-vars */

module.exports = env => ({
  payoutCalc: require('./../../common/payoutCalculation'),

  policyTable: {
    supportsEth: false,
    disabledEth: true,
    supportsCoupons: true,
  },

  i18n: {
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: require('./enLocale'),
    },
  },
});
