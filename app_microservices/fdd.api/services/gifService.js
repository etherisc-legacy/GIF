
/**
 * GIF service
 */
class GIFService {
  /**
   * constructor
   * @param {object} di
   */
  constructor({
    amqp,
    signer,
    log,
    messageBus,
    contract,
    flightRatingsOracle,
    flightStatusesOracle,
  }) {
    this._amqp = amqp;
    this._log = log;
    this._signer = signer;
    this._messageBus = messageBus;
    this._contract = contract;
    this._flightRatingsOracle = flightRatingsOracle;
    this._flightStatusesOracle = flightStatusesOracle;
  }

  /**
   * Policy creation request
   * @param {*} content
   */
  async policyCreationRequest(content) {
    await this._amqp.publish({
      messageType: 'policyCreationRequest',
      messageVersion: '1.*',
      content,
    });

    const result = await this.handleRequestLikeMessage(
      'policyCreationSuccess', 'policyCreationError',
      ({ creationId }, done) => { if (creationId === content.creationId) { done(); } },
      ({ creationId }, done) => { if (creationId === content.creationId) { done(); } },
    );

    return result;
  }

  /**
   * Make Payout
   * @param {{}} content
   */
  async makePayout(content) {
    await this._amqp.publish({
      messageType: 'payout',
      messageVersion: '1.*',
      content,
    });
  }

  /**
   * Issue Certificate
   * @param {*} policyId
   */
  async issueCertificate(policyId) {
    await this._amqp.publish({
      messageType: 'issueCertificate',
      messageVersion: '1.*',
      content: { policyId },
    });
  }

  /**
   * Send notifications
   * @param {*} content
   */
  async sendNotification(content) {
    await this._amqp.publish({
      messageType: 'notification',
      messageVersion: '1.*',
      content,
    });
  }

  /**
   * Setup notifications
   * @param {*} content
   */
  async setupNotifications(content) {
    await this._amqp.publish({
      messageType: 'notificationSettingsUpdate',
      messageVersion: '1.*',
      content,
    });
  }

  /**
   * Send notifications
   * @param {*} content
   */
  async setupCertificateTemplate(content) {
    await this._amqp.publish({
      messageType: 'pdfTemplatesUpdate',
      messageVersion: '1.*',
      content,
    });
  }

  /**
   * Apply For Policy
   * @param {object} application
   * @return {Promise<*>}
   */
  applyForPolicy(application) {
    return this._contract().methods.applyForPolicy(
      application.carrierFlightNumber,
      application.yearMonthDay,
      application.departureTime,
      application.arrivalTime,
      application.premium,
      application.currency,
      application.payoutOptions,
      application.customerExternalId,
    ).send();
  }

  /** Request Payment Processing
   * @param {object} content
   * @return {Promise<*>}
   */
  async processPayment(content) {
    await this._amqp.publish({
      messageType: 'processPayment',
      messageVersion: '1.*',
      content,
    });
  }

  /**
   * Confirm Payment Success
   * @param {number} requestId
   * @return {Promise<*>}
   */
  confirmPaymentSuccess(requestId) {
    return this._contract().methods.confirmPaymentSuccess(requestId).send();
  }

  /**
   * Handle Payment Failure
   * @param {number} requestId
   * @param {string} error
   * @return {Promise<*>}
   */
  handlePaymentFailure(requestId, error) {
    // TODO: Publish error for other services
    return this._contract().methods.confirmPaymentFailure(requestId).send();
  }

  /**
   * Calculate payout options based on premium and flight rating
   * @param {*} premium
   * @param {*} statistics
   * @return {*}
   */
  calculatePayouts(premium, statistics) {
    return this._contract().methods.calculatePayouts(premium, statistics).call();
  }

  /**
   * Check FlightRatingsOracle test mode
   * @return {Promise<{testMode: *}>}
   */
  checkFlightRatingsMode() {
    return this._flightRatingsOracle().methods.testMode().call();
  }

  /**
   * Check FlightStatusesOracle test mode
   * @return {Promise<{testMode: *}>}
   */
  checkFlightStatusesMode() {
    return this._flightStatusesOracle().methods.testMode().call();
  }

  /**
   * Check balance
   * @return {Promise<{testMode: *}>}
   */
  async checkBalance() {
    const signer = this._signer();
    const results = await Promise.all([
      signer.eth.getBalance(this._contract().options.from),
      signer.eth.getBalance(this._flightRatingsOracle().options.address),
      signer.eth.getBalance(this._flightStatusesOracle().options.address),
    ]);

    const { BN, toWei } = signer.utils;
    const minBalance = new BN(toWei('0.1', 'ether'));

    for (let i = 0, l = results.length; i < l; i += 1) {
      if (minBalance.cmp(new BN(results[i])) !== -1) {
        return false;
      }
    }

    return true;
  }

  /**
   * Apply For Policy
   * @param {number} payoutId
   * @param {number} sum
   * @return {Promise<*>}
   */
  confirmPayout(payoutId, sum) {
    return this._contract().methods.confirmPayout(payoutId, sum).send();
  }

  /**
   * Apply For Policy Result
   * @param {object} content
   * @return {Promise<*>}
   */
  async applyForPolicySuccess(content) {
    await this._amqp.publish({
      messageType: 'applyForPolicySuccess',
      messageVersion: '1.*',
      content,
    });
  }

  /**
   * Apply For Policy Failure
   * @param {object} content
   * @return {Promise<*>}
   */
  async applyForPolicyError(content) {
    await this._amqp.publish({
      messageType: 'applyForPolicyError',
      messageVersion: '1.*',
      content,
    });
  }

  /**
   * Handle request like message
   * @param {*} successEvent
   * @param {*} errorEvent
   * @param {*} successCallback
   * @param {*} errorCallback
   */
  async handleRequestLikeMessage(successEvent, errorEvent, successCallback, errorCallback) {
    const that = this;

    const result = await new Promise((resolve, reject) => {
      // eslint-disable-next-line require-jsdoc
      function onSuccess(content) {
        successCallback(content, () => {
          // eslint-disable-next-line no-use-before-define
          removeListeners();
          resolve(content);
        });
      }

      // eslint-disable-next-line require-jsdoc
      function onError(error) {
        errorCallback(error, () => {
          // eslint-disable-next-line no-use-before-define
          removeListeners();
          reject(error);
        });
      }

      // eslint-disable-next-line require-jsdoc
      function removeListeners() {
        that._messageBus.removeListener(successEvent, onSuccess);
        that._messageBus.removeListener(errorEvent, onError);
      }

      that._messageBus.on(successEvent, onSuccess);
      that._messageBus.on(errorEvent, onError);
    });

    return result;
  }
}

module.exports = GIFService;
