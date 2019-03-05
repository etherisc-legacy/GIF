const uuid = require('uuid/v1');

/**
 * Generic insurance
 */
class GenericInsurance {
  /**
   * Constructor
   * @param {{}} amqp
   */
  constructor({ amqp }) {
    this._amqp = amqp;
  }

  /**
   * Send policy creation message to broker
   * @param {string} correlationId
   * @param {{}} payload
   */
  createPolicy(correlationId, payload) {
    this._amqp.publish({
      messageType: 'policyCreationSuccess',
      messageVersion: '1.*',
      content: payload,
      correlationId: correlationId || uuid(),
    });
  }

  /**
   * Send process payment message to broker
   * @param {string} correlationId
   * @param {string} policyId
   */
  processPayment(correlationId, policyId) {
    this._amqp.publish({
      messageType: 'processPayment',
      messageVersion: '1.*',
      content: { policyId },
      correlationId,
    });
  }

  /**
   * Send fiat payout message to broker
   * @param {string} correlationId
   * @param {string} policyId
   */
  payout(correlationId, policyId) {
    this._amqp.publish({
      messageType: 'payout',
      messageVersion: '1.*',
      content: { policyId },
      correlationId,
    });
  }

  /**
   * Send certificate issuing message to broker
   * @param {string} correlationId
   * @param {string} policyId
   */
  issueCertificate(correlationId, policyId) {
    this._amqp.publish({
      messageType: 'issueCertificate',
      messageVersion: '1.*',
      content: { policyId },
      correlationId,
    });
  }
}

module.exports = GenericInsurance;
