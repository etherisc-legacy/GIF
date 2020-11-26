const fs = require('fs');
const Web3 = require('web3');
const _ = require('lodash');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const EventEmitter = require('events');
const FlightStatsClient = require('./flightstats/flightStatsClient');
const registerRoutes = require('./routes');
const services = require('./services');
const models = require('./models/module');
const artifacts = require('./FlightDelayOraclize.json');
const oracleAbi = require('./OracleAbi.json');


const MNEMONIC = process.env.FDD_MNEMONIC
    || 'way web chapter satisfy solid future avoid push insane viable dizzy conduct fork fantasy asthma';
const CONTRACT = process.env.FDD_CONTRACT || '0xFb646F9713463b0FA024FCd3aBC1B61b8a73a6c6';
const ACCOUNT = process.env.FDD_ACCOUNT || '0x5E391721c8f61C4F1E58A74d1a2f02428e922CDE';
const HTTP_PROVIDER = process.env.FDD_HTTP_PROVIDER || 'https://rinkeby.infura.io/1reQ7FJQ1zs0QGExhlZ8';

const FLIGHT_RATINGS_ORACLE = process.env.FLIGHT_RATINGS_ORACLE || '0xbAa03abA88737b83467f3faf68E36661536f024d';
const FLIGHT_STATUSES_ORACLE = process.env.FLIGHT_STATUSES_ORACLE || '0x2A4884d49A1FDDFc36e74967A95eE938121270dA';


/**
 * Signer factory
 * @return {{}}
 */
const signer = () => new Web3(new HDWalletProvider(MNEMONIC, HTTP_PROVIDER, 0, 1, false));


/** */
class FddApi {
  /**
   * @param {{}} DI
   */
  constructor({
    amqp,
    router,
    genericInsurance,
    db,
    log,
  }) {
    this._amqp = amqp;
    this._log = log;
    // this._gif = genericInsurance;
    this._messageBus = new EventEmitter();
    this._db = models(db);
    const config = process.env;

    this._contract = () => new (signer()).eth.Contract(artifacts.abi, CONTRACT, {
      gasPrice: 10 * (10 ** 9),
      gas: 3000000,
      from: ACCOUNT,
    });

    this._flightRatingsOracle = () => new (signer()).eth.Contract(oracleAbi, FLIGHT_RATINGS_ORACLE, {
      gasPrice: 10 * (10 ** 9),
      gas: 3000000,
      from: ACCOUNT,
    });

    this._flightStatusesOracle = () => new (signer()).eth.Contract(oracleAbi, FLIGHT_STATUSES_ORACLE, {
      gasPrice: 10 * (10 ** 9),
      gas: 3000000,
      from: ACCOUNT,
    });

    const flightStatsClient = new FlightStatsClient({ ...config });
    const deps = {
      config,
      flightStatsClient,
      amqp,
      log,
      signer,
      genericInsurance,
      contract: () => this._contract(),
      flightRatingsOracle: () => this._flightRatingsOracle(),
      flightStatusesOracle: () => this._flightStatusesOracle(),
      messageBus: this._messageBus,
      db: this._db,
    };
    const servicesDeps = services({ ...deps });
    registerRoutes({ router, ...deps, ...servicesDeps });
    this._gif = servicesDeps.gif;
  }

  /**
   * Bootstrap application
   * @return {void}
   */
  async bootstrap() {
    await this._amqp.consume({
      messageType: 'stateChanged',
      messageVersion: '1.*',
      handler: this.onStateChanged.bind(this),
    });
    await this._amqp.consume({
      messageType: 'certificateIssued',
      messageVersion: '1.*',
      handler: this.onCertificateIssued.bind(this),
    });
    await this._amqp.consume({
      messageType: 'policyCreationError',
      messageVersion: '1.*',
      handler: this.onPolicyCreationError.bind(this),
    });
    await this._amqp.consume({
      messageType: 'policyCreationSuccess',
      messageVersion: '1.*',
      handler: this.onPolicyCreationSuccess.bind(this),
    });
    await this._amqp.consume({
      messageType: 'processPaymentResult',
      messageVersion: '1.*',
      handler: this.handleProcessPaymentResult.bind(this),
    });
    await this._amqp.consume({
      messageType: 'policyGetResponse',
      messageVersion: '1.*',
      handler: this.policyGetResponse.bind(this),
    });
    await this._amqp.consume({
      messageType: 'decodedEvent',
      messageVersion: '1.*',
      handler: this.handleDecodedEvent.bind(this),
    });
    await this._amqp.consume({
      messageType: 'paidOut',
      messageVersion: '1.*',
      handler: this.handlePaidOut.bind(this),
    });
    await this._amqp.consume({
      messageType: 'payoutError',
      messageVersion: '1.*',
      handler: this.handlePayoutError.bind(this),
    });

    await new Promise(resolve => setTimeout(resolve, 20 * 1000));

    await this._gif.setupNotifications({
      transports: [
        {
          name: 'smtp',
          props: { from: 'policies@etherisc.com' },
          events: ['policy_issued', 'charge_error', 'policy_issue_error'],
        },
        {
          name: 'telegram',
          props: { chatId: -319007131 },
          events: ['policy_issued', 'claim_paid_out', 'policy_error', 'charge_error', 'policy_issue_error'],
        },
      ],
      templates: [
        {
          event: 'policy_issued',
          transport: 'smtp',
          template: fs.readFileSync('./templates/policy_issued_letter.html', 'utf8'),
        },
        {
          event: 'policy_issue_error',
          transport: 'smtp',
          template: fs.readFileSync('./templates/policy_issue_error_letter.html', 'utf8'),
        },
        {
          event: 'policy_issue_error',
          transport: 'telegram',
          template: fs.readFileSync('./templates/policy_issue_error_telegram.html', 'utf8'),
        },
        {
          event: 'claim_paid_out',
          transport: 'telegram',
          template: '🔔 *Claim paid out:*\nPolicy : _{{policy.id}}_\nTransferwise Transfer : _{{transferwiseTransferId}}_',
        },
        {
          event: 'charge_error',
          transport: 'smtp',
          template: fs.readFileSync('./templates/charge_error_smtp.html', 'utf8'),
        },
        {
          event: 'charge_error',
          transport: 'telegram',
          template: fs.readFileSync('./templates/charge_error_telegram.html', 'utf8'),
        },
      ],
    });
    await this._gif.setupCertificateTemplate({
      templates: [{
        name: 'certificate',
        body: fs.readFileSync('./templates/policy_certificate.html', 'utf8'),
      }],
    });
  }

  /**
   * On policy state changed
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onStateChanged({ content, fields, properties }) {
    this._log.info('stateChanged', content);
    this._messageBus.emit('stateChanged', content, fields, properties);
  }

  /**
   * On certificate issued
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  async onCertificateIssued({ content, fields, properties }) {
    this._log.info('certificateIssued', content);

    const { policyId, bucket, path } = content;
    const { Customer, Policy, PolicyExtra } = this._db;

    const policy = await Policy.query().where('id', policyId).first();
    const extra = await PolicyExtra.query().where('policyId', policyId)
      .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

    if (policy) {
      const customer = await Customer.query().where('id', policy.customerId).first();
      await this._gif.sendNotification({
        type: 'policy_issued',
        data: { customer, policy, policyExtra: extra },
        props: {
          recipient: customer.email,
          subject: 'Insurance Policy has been issued',
          attachments: [{
            bucket,
            path,
            type: 'application/pdf',
            name: 'certificate.pdf',
          }],
        },
      });
    }

    this._messageBus.emit('certificateIssued', content);
  }

  /**
   * On policy creation error
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onPolicyCreationError({ content, fields, properties }) {
    this._log.info('policyCreationError', content);
    this._messageBus.emit('policyCreationError', content, fields, properties);
  }

  /**
   * On policy creation success
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onPolicyCreationSuccess({ content, fields, properties }) {
    this._log.info('policyCreationSuccess', content);
    this._messageBus.emit('policyCreationSuccess', content, fields, properties);
  }

  /**
   * get policy response
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  async policyGetResponse({ content, fields, properties }) {
    this._log.info('policyGetResponse', content);
    this._messageBus.emit('policyGetResponse', content, fields, properties);
  }

  /**
   * Handle decoded ethereum event
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  async handleDecodedEvent({ content, fields, properties }) {
    switch (content.eventName) {
      case 'LogRequestPayment':
        await this.handleLogRequestPayment(content);
        break;
      case 'LogNewPolicy':
        await this.handleLogNewPolicy(content);
        break;
      case 'LogNewPayout':
        await this.handleLogNewPayout(content);
        break;
      case 'LogClaimStateChanged':
        break;
      default:
    }

    this._messageBus.emit('decodedEvent', content, fields, properties);
  }

  /**
   * LogRequestPayment
   * @param {{}} content
   */
  async handleLogRequestPayment(content) {
    const { applicationId: contractApplicationId, requestId: contractRequestId } = content.eventArgs;

    const { Policy } = this._db;

    const policy = await Policy.query().where({ contractApplicationId }).first();

    if (policy) {
      await policy.$query().updateAndFetch({ contractRequestId });
      await this._gif.processPayment({ policyId: policy.id });
      this._log.info('LogRequestPayment', content);
    }
  }

  /**
   * LogNewPolicy
   * @param {{}} content
   */
  async handleLogNewPolicy(content) {
    const { applicationId: contractApplicationId, policyId: contractPolicyId } = content.eventArgs;
    const { Policy } = this._db;

    const policy = await Policy.query().where({ contractApplicationId }).first();

    if (policy) {
      await policy.$query().updateAndFetch({ contractPolicyId });
      await this._gif.issueCertificate(policy.id);
      this._log.info('LogNewPolicy', content);
    }
  }

  /**
   * LogNewPayout
   * @param {{}} content
   */
  async handleLogNewPayout(content) {
    const {
      policyId: contractPolicyId,
      payoutId: contractPayoutId,
      amount,
      state,
    } = content.eventArgs;
    const { Policy, PolicyExtra } = this._db;

    const policy = await Policy.query().where({ contractPolicyId }).first();

    if (policy && state === '0') {
      const { currency } = await PolicyExtra.query().where('policyId', policy.id)
        .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));
      await this._gif.makePayout({
        provider: 'transferwise',
        currency,
        payoutAmount: Number(amount),
        policyId: policy.id,
        contractPayoutId,
      });
      this._log.info('LogNewPayout', content);
    }
  }

  /**
   * Handle Payment result event
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  async handleProcessPaymentResult({ content, fields, properties }) {
    const {
      policyId,
      error,
    } = content;

    const { Policy, Customer } = this._db;
    const policy = await Policy.query().where({ id: policyId }).first();

    if (error) {
      const customer = await Customer.query().where('id', policy.customerId).first();

      await this._gif.sendNotification({
        type: 'charge_error',
        data: { customer, error, policy: { id: policy.id } },
        props: {
          recipient: customer.email,
          subject: 'Insurance Policy payment has been failed',
        },
      });
      await this._gif.handlePaymentFailure(policy.contractRequestId, error);
    } else {
      try {
        await this._gif.confirmPaymentSuccess(policy.contractRequestId);
      } catch (gifException) {
        const customer = await Customer.query().where('id', policy.customerId).first();
        await this._gif.sendNotification({
          type: 'policy_issue_error',
          data: { customer, policy, error: JSON.stringify(gifException) },
          props: {
            recipient: customer.email,
            subject: 'Insurance Policy processing has been failed',
          },
        });
      }
    }
  }

  /**
   * Handle PaidOut event
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  async handlePaidOut({ content, fields, properties }) {
    const {
      contractPayoutId,
      amount,
      policyId,
      details,
    } = content;
    await this._gif.confirmPayout(contractPayoutId, amount);
    await this._gif.sendNotification({
      type: 'claim_paid_out',
      data: { policy: { id: policyId }, transferwiseTransferId: details.transfer.id },
      props: {},
    });
  }

  /**
   * Handle PaidOut error event
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  async handlePayoutError({ content, fields, properties }) {
    const { policyId, error } = content;
    await this._gif.sendNotification({
      type: 'policy_error',
      data: { policy: { id: policyId }, error },
      props: {},
    });
  }
}

module.exports = FddApi;
