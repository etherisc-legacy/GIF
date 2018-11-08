/**
 * FlightDelay API microservice
 */
class FlightDelayInsurance {
  /**
   * Constructor
   */
  constructor() {
    this.name = `${process.env.npm_package_name}.v${process.env.npm_package_version}`;
  }

  /**
   * Process submitted application data
   * @param {string} clientId
   * @param {{}} payload
   */
  onApplied(clientId, payload) {
    // validate form data
    this.log.info('Form applied:', clientId, payload);

    this.dip.createPolicy(clientId, payload);
  }

  /**
   * Handle error
   * @param {string} client
   * @param {Error} error
   */
  onError(client, error) {
    this.log.error(client, error);
  }

  /**
   * Handle LogSetState event from contract
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   * @return {Promise}
   */
  onLogSetState({ content, fields, properties }) {
    // Applied
    if (content.state === 0) return this.onPolicyAppliedState(properties.correlationId, content);

    // Accepted
    if (content.state === 1) return this.onPolicyAcceptedState(properties.correlationId, content);

    // Revoked
    if (content.state === 2) return this.onPolicyRevoked(properties.correlationId, content);

    // PaidOut
    if (content.state === 3) return this.onPolicyPaidOutState(properties.correlationId, content);

    // Expired
    if (content.state === 4) return this.onPolicyExpiredState(properties.correlationId, content);

    // Declined
    if (content.state === 5) return this.onPolicyDeclinedState(properties.correlationId, content);

    // SendFailed
    if (content.state === 6) return this.onPolicySendFailedState(properties.correlationId, content);

    return null;
  }

  /**
   * Policy state handlers
   */

  /**
   * Handle applied policy state
   * @param {string} correlationId
   * @param {{}} payload
   */
  onPolicyAppliedState(correlationId, payload) {
    // Policy applied
    this.dip.send(correlationId, { from: this.name, msg: `Policy ${payload.policyId} applied` });
  }

  /**
   * Handle accepted policy state
   * @param {string} correlationId
   * @param {{}} payload
   */
  onPolicyAcceptedState(correlationId, payload) {
    // Policy accepted
    this.dip.send(correlationId, { from: this.name, msg: `Policy ${payload.policyId} underwritten by oracle` });

    this.dip.chargeCard(correlationId, payload.policyId);
  }

  /**
   * Handle revoked policy state
   * @param {string} correlationId
   * @param {{}} payload
   */
  onPolicyRevoked(correlationId, payload) {
    // Policy revoked
    this.dip.send(correlationId, { from: this.name, msg: `Policy ${payload.policyId} revoked` });
  }

  /**
   * Handle paidOut policy state
   * @param {string} correlationId
   * @param {{}} payload
   */
  onPolicyPaidOutState(correlationId, payload) {
    // Policy paidout
    this.dip.send(correlationId, { from: this.name, msg: `Policy ${payload.policyId} for payout` });
    this.dip.payout(correlationId, payload.policyId);
  }

  /**
   * Handle expired policy state
   * @param {string} correlationId
   * @param {{}} payload
   */
  onPolicyExpiredState(correlationId, payload) {
    // Policy expired
    this.dip.send(correlationId, { from: this.name, msg: `Policy ${payload.policyId} expired` });
  }

  /**
   * Handle declined policy state
   * @param {string} correlationId
   * @param {{}} payload
   */
  onPolicyDeclinedState(correlationId, payload) {
    // Policy declined
    this.dip.send(correlationId, { from: this.name, msg: `Policy ${payload.policyId} declined` });
  }

  /**
   * Handle send failed policy state
   * @param {string} correlationId
   * @param {{}} payload
   */
  onPolicySendFailedState(correlationId, payload) {
    // Policy send failed
    this.dip.send(correlationId, { from: this.name, msg: `Policy ${payload.policyId} send failed` });

    // this.dip.notifyAdministrator(policyId, { msg: 'Send failed' });
  }

  /**
   * App logic
   */

  /**
   * On card charged event handler
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onCardCharged({ content, fields, properties }) {
    this.dip.issueCertificate(properties.correlationId, content.policyId);
  }

  /**
   * On certificated issued event handler
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onCertificateIssued({ content, fields, properties }) {
    this.dip.send(properties.correlationId, { from: this.name, msg: `Policy ${content.policyId} accepted` });
  }
}

module.exports = FlightDelayInsurance;
