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
   * @param {string} correlationId
   * @param {{}} payload
   * @return {Promise}
   */
  onLogSetState(correlationId, payload) {
    // Applied
    if (payload.state === 0) return this.onPolicyAppliedState(correlationId, payload);

    // Accepted
    if (payload.state === 1) return this.onPolicyAcceptedState(correlationId, payload);

    // Revoked
    if (payload.state === 2) return this.onPolicyRevoked(correlationId, payload);

    // PaidOut
    if (payload.state === 3) return this.onPolicyPaidOutState(correlationId, payload);

    // Expired
    if (payload.state === 4) return this.onPolicyExpiredState(correlationId, payload);

    // Declined
    if (payload.state === 5) return this.onPolicyDeclinedState(correlationId, payload);

    // SendFailed
    if (payload.state === 6) return this.onPolicySendFailedState(correlationId, payload);

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
   * @param {string} correlationId
   * @param {{}} payload
   */
  onCardCharged(correlationId, payload) {
    this.dip.issueCertificate(correlationId, payload.policyId);
  }

  /**
   * On certificated issued event handler
   * @param {string} correlationId
   * @param {{}} payload
   */
  onCertificateIssued(correlationId, payload) {
    this.dip.send(correlationId, { from: this.name, msg: `Policy ${payload.policyId} accepted` });
  }
}

module.exports = FlightDelayInsurance;
