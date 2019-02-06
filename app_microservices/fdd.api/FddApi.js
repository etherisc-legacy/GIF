const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const EventEmitter = require('events');
const FlightStatsClient = require('./flightstats/flightStatsClient');
const registerRoutes = require('./routes');
const services = require('./services');
const models = require('./models/module');
const artifacts = require('./FlightDelayOraclize.json');


const MNEMONIC = 'salt spring grid similar fly damage sad taxi fan decline vital mention moon upgrade coyote';
const CONTRACT = '0x077d59D10A2b4bED6640f8dAe71fF8afF4636F0E';
const ACCOUNT = '0xad1Ef51c732746c0F71DdA1420590acbc5B03C8f';
const HTTP_PROVIDER = 'https://kovan.infura.io/1reQ7FJQ1zs0QGExhlZ8';
const WS_PROVIDER = 'wss://kovan.infura.io/ws';

const watcher = new Web3(new Web3.providers.WebsocketProvider(WS_PROVIDER));
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
    watcher.eth.subscribe('logs', { address: [CONTRACT] }, (e) => {
      if (!e) {
        return;
      }
      this._log.info(e);
    })
      .on('data', log => this._log.info(log))
      .on('error', e => this._log.error(e));

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
      templates: [],
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
    const { Customer, Policy } = this._db;

    const policy = await Policy.query().where('id', policyId).first();

    if (policy) {
      const customer = await Customer.query().where('id', policy.customerId).first();
      await this._gif.sendNotification({
        type: 'policy_issued',
        data: { customer, policy },
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
}

module.exports = FddApi;
