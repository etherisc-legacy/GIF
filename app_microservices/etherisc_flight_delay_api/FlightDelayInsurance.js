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
  onLogStateContractEvent(policyId, payload) {
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
  }

  /**
   * Policy state handlers
   */
  onPolicyAppliedState(policyId, payload) {
    // Policy applied
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} applied` });
  }

  onPolicyAcceptedState(policyId, payload) {
    // Policy accepted
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} underwritten by oracle` });

    this.dip.chargeCard(policyId);
  }

  onPolicyRevoked(policyId, payload) {
    // Policy revoked
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} revoked` });
  }

  onPolicyPaidOutState(policyId, payload) {
    // Policy paidout
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} for payout` });
    this.dip.payout(policyId);
  }

  onPolicyExpiredState(policyId, payload) {
    // Policy expired
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} expired` });
  }

  onPolicyDeclinedState(policyId, payload) {
    // Policy declined
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} declined` });
  }

  onPolicySendFailedState(policyId, payload) {
    // Policy send failed
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} send failed` });

    // this.dip.notifyAdministrator(policyId, { msg: 'Send failed' });
  }

  /**
   * App logic
   */
  onCardCharged(policyId, payload) {
    this.dip.issueCertificate(policyId);
  }

  onCertificateIssued(policyId, payload) {
    this.dip.send(policyId, { from: this.name, msg: `Policy ${policyId} accepted` });
  }
}

module.exports = FlightDelayInsurance;
