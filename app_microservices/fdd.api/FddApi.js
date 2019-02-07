const fs = require('fs');
const Web3 = require('web3');
const _ = require('lodash');
const HDWalletProvider = require('truffle-hdwallet-provider');
const EventEmitter = require('events');
const FlightStatsClient = require('./flightstats/flightStatsClient');
const registerRoutes = require('./routes');
const services = require('./services');
const models = require('./models/module');
const artifacts = require('./FlightDelayOraclize.json');


const MNEMONIC = 'way web chapter satisfy solid future avoid push insane viable dizzy conduct fork fantasy asthma';
const CONTRACT = '0xbE5CcF932177F4Bf1FDE7385A85e1e05C293d26A';
const ACCOUNT = '0x5E391721c8f61C4F1E58A74d1a2f02428e922CDE';
const HTTP_PROVIDER = 'https://rinkeby.infura.io/1reQ7FJQ1zs0QGExhlZ8';
const signer = new Web3(new HDWalletProvider(MNEMONIC, HTTP_PROVIDER));


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

    this._contract = new signer.eth.Contract(artifacts.abi, CONTRACT, {
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
      contract: this._contract,
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
      messageType: 'policyGetResponse',
      messageVersion: '1.*',
      handler: this.policyGetResponse.bind(this),
    });
    await this._amqp.consume({
      messageType: 'decodedEvent',
      messageVersion: '1.*',
      handler: this.handleDecodedEvent.bind(this),
    });

    await new Promise(resolve => setTimeout(resolve, 20 * 1000));

    await this._gif.setupNotifications({
      transports: [
        {
          name: 'smtp',
          props: { from: 'policies@etherisc.com' },
          events: ['policy_issued'],
        },
        {
          name: 'telegram',
          props: { chatId: -319007131 },
          events: ['policy_issued'],
        },
      ],
      templates: [
        {
          name: 'policy_issued',
          transport: 'smtp',
          template: fs.readFileSync('./templates/policy_issued_letter.html', 'utf8'),
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

    this._messageBus.emit('certificateIssued', content, fields, properties);
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
   * get policy response
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  async handleDecodedEvent({ content, fields, properties }) {
    if (content.eventName === 'LogNewPolicy') {
      this._log.info('decodedEvent', content);
    }
    this._messageBus.emit('decodedEvent', content, fields, properties);
  }
}

module.exports = FddApi;
