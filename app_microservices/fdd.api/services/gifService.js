
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
    log,
    messageBus,
    contract,
  }) {
    this._amqp = amqp;
    this._log = log;
    this._messageBus = messageBus;
    this._contract = contract;
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
   * Apply For Policy
   * @param {object} application
   * @return {Promise<*>}
   */
  applyForPolicy(application) {
    return this._contract.methods.applyForPolicy(
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
