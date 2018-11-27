const WebSocket = require('ws');
const uuid = require('uuid/v1');
const http = require('http');


/**
 * Generic Insurance application wrapper
 */
class GenericInsurance {
  /**
   * Constructor
   * @param {string} amqp
   * @param {string} config
   * @param {string} log
   */
  constructor({ amqp, config, log }) {
    this._wsPort = config.wsPort;
    this._app = config.app;
    this._app.dip = this;
    this._app.log = log;

    this.log = log;

    this._connections = {};

    this._amqp = amqp;
  }

  /**
   * Bootstrap and listen
   * @return {*}
   */
  async bootstrap() {
    const server = http.createServer(((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write('{"status":200}');
      res.end();
    }));

    const wss = new WebSocket.Server({ server });

    server.listen(this._wsPort);

    wss.on('connection', ws => this.register(ws));

    await this._amqp.consume({
      messageType: '*',
      messagetypeVersion: '#',
      handler: ({ content, fields, properties }) => {
        this.send(properties.correlationId, {
          from: `${properties.headers.originatorName}.v${properties.headers.originatorVersion}`,
          topic: fields.routingKey,
          msg: JSON.stringify(content),
        });
      },
    });

    await this._amqp.consume({
      messageType: 'stateChanged',
      messageVersion: '1.*',
      handler: this._app.onLogSetState.bind(this._app),
    });

    await this._amqp.consume({
      messageType: 'processPaymentResult',
      messageVersion: '1.*',
      handler: this._app.onPaymentProcessed.bind(this._app),
    });

    await this._amqp.consume({
      messageType: 'certificateIssued',
      messageVersion: '1.*',
      handler: this._app.onCertificateIssued.bind(this._app),
    });

    this.log.info(`${this._app.name} listening at ws://localhost:${this._wsPort}/ws`);
  }

  /**
   * Registrer WebSocket connection
   * @param {{}} connection
   */
  register(connection) {
    const connectionId = uuid();

    this._connections[connectionId] = connection;

    this.send(connectionId, {
      from: `${process.env.npm_package_name}.v${process.env.npm_package_version}`,
      topic: null,
      msg: 'WebSocket connection successfully established',
    });

    connection.on('message', message => this.processMessage(connectionId, message));
  }

  /**
   * Process broker's message
   * @param {string} connectionId
   * @param {{}} message
   */
  processMessage(connectionId, message) {
    const payload = JSON.parse(message);

    if (payload.type === 'apply') {
      this._app.onApplied(connectionId, payload.data);
      this.send(connectionId, {
        from: `${process.env.npm_package_name}.v${process.env.npm_package_version}`,
        topic: null,
        msg: `Applied data: ${message}`,
      });
    }
  }

  /**
   * Send message to WebSocket client
   * @param {string} connectionId
   * @param {{}} msg
   */
  send(connectionId, msg) {
    if (!connectionId || !this._connections[connectionId]) return;
    this._connections[connectionId].send(JSON.stringify(msg));
  }

  /**
   * Send policy creation message to broker
   * @param {string} clientId
   * @param {{}} payload
   * @return {Promise<void>}
   */
  async createPolicy(clientId, payload) {
    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish({
      messageType: 'policyCreationRequest',
      messageVersion: '1.*',
      content: payload,
      correlationId: clientId,
    });
  }

  /**
   * Send process payment message to broker
   * @param {string} correlationId
   * @param {string} policyId
   * @return {Promise<void>}
   */
  async processPayment(correlationId, policyId) {
    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish({
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
   * @return {Promise<void>}
   */
  async payout(correlationId, policyId) {
    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish({
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
   * @return {Promise<void>}
   */
  async issueCertificate(correlationId, policyId) {
    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish({
      messageType: 'issueCertificate',
      messageVersion: '1.*',
      content: { policyId },
      correlationId,
    });
  }
}

module.exports = GenericInsurance;
