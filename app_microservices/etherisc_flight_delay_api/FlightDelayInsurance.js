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
   * @param {string} policyId
   * @param {{}} payload
   * @return {Promise}
   */
  onLogSetState(policyId, payload) {
    // Applied
    if (payload.state === 0) return this.onPolicyAppliedState(policyId, payload);

    // Accepted
    if (payload.state === 1) return this.onPolicyAcceptedState(policyId, payload);

    // Revoked
    if (payload.state === 2) return this.onPolicyRevoked(policyId, payload);

    // PaidOut
    if (payload.state === 3) return this.onPolicyPaidOutState(policyId, payload);

    // Expired
    if (payload.state === 4) return this.onPolicyExpiredState(policyId, payload);

    // Declined
    if (payload.state === 5) return this.onPolicyDeclinedState(policyId, payload);

    // SendFailed
    if (payload.state === 6) return this.onPolicySendFailedState(policyId, payload);

    return null;
  }

  /**
   * Policy state handlers
   */

  /**
   * Handle applied policy state
   * @param {string} policyId
   */
  onPolicyAppliedState(policyId) {
    // Policy applied
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} applied` });
  }

  /**
   * Handle accepted policy state
   * @param {string} policyId
   */
  onPolicyAcceptedState(policyId) {
    // Policy accepted
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} underwritten by oracle` });

    this.dip.chargeCard(policyId);
  }

  /**
   * Handle revoked policy state
   * @param {string} policyId
   */
  onPolicyRevoked(policyId) {
    // Policy revoked
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} revoked` });
  }

  /**
   * Handle paidOut policy state
   * @param {string} policyId
   */
  onPolicyPaidOutState(policyId) {
    // Policy paidout
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} for payout` });
    this.dip.payout(policyId);
  }

  /**
   * Handle expired policy state
   * @param {string} policyId
   */
  onPolicyExpiredState(policyId) {
    // Policy expired
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} expired` });
  }

  /**
   * Handle declined policy state
   * @param {string} policyId
   */
  onPolicyDeclinedState(policyId) {
    // Policy declined
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} declined` });
  }

  /**
   * Handle send failed policy state
   * @param {string} policyId
   */
  onPolicySendFailedState(policyId) {
    // Policy send failed
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} send failed` });

    // this.dip.notifyAdministrator(policyId, { msg: 'Send failed' });
  }

  /**
   * App logic
   */

  /**
   * On card charged event handler
   * @param {string} policyId
   */
  onCardCharged(policyId) {
    this.dip.issueCertificate(policyId);
  }

  /**
   * On certificated issued event handler
   * @param {string} policyId
   */
  onCertificateIssued(policyId) {
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} accepted` });
  }
}

module.exports = FlightDelayInsurance;
