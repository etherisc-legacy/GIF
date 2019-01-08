let customization = {};

customization = require('../config/fdd.web/base/module')(process.env.NODE_ENV);


export default class CustomConfig {

  static get payoutCalc() {
    return customization.payoutCalc || { };
  }

  static get applyPolicy() {
    return customization.applyPolicy || { };
  }

  static get policyTable() {
    return customization.policyTable || { };
  }

  static get cardDetails() {
    return customization.cardDetails || { };
  }

  static get workflow() {
    return customization.workflow || { };
  }

  static get i18nOpts() {
    return customization.i18n || {};
  }

  static onAppLoaded() {
    const handler = customization.onAppLoaded;

    if (handler) {
      handler();
    }
  }

  static onPolicyCreated(response) {
    const handler = customization.onPolicyCreated;

    if (handler) {
      handler(response);
    }
  }

}

CustomConfig.onAppLoaded();
