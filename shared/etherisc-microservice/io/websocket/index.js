const WS = require('ws');
const uuid = require('uuid/v1');

/**
 * WebSocket IO
 */
class WebSocket {
  /**
   * Constructor
   * @param {{}} http
   * @param {{}} config
   * @param {{}} log
   */
  constructor({ server, config, log }) {
    this._server = server;
    this._config = config;
    this._log = log;
    this._connections = {};
  }

  /**
   * Start
   */
  async bootstrap() {
    this._wss = new WS.Server({ server: this._server });

    this._wss.on('connection', ws => this._register(ws));
  }

  /**
   * Register new WebSocket connection
   * @param {{}} connection
   * @private
   */
  _register(connection) {
    const connectionId = uuid();

    this._connections[connectionId] = connection;

    this.send(connectionId, {
      microservice: `${this._config.appName}.v${this._config.appVersion}`,
      topic: null,
      msg: 'WebSocket connection successfully established',
    });

    connection.on('message', message => this._handleMessage(connectionId, message));
  }


  /**
   * Handle WebSocker message
   * @param {string} connectionId
   * @param {string} message
   * @private
   */
  _handleMessage(connectionId, message) {
    this._log.info(connectionId, message);

    if (this._handler) {
      this._handler(connectionId, message);
    } else {
      this._log.error('Handler for WebSocket messages is not defined');
    }
  }

  /**
   * Bind external handler for processing WebSocket messages
   * @param {function} handler
   */
  setHandler(handler) {
    this._handler = handler;
  }

  /**
   * Send message to WebSocker connection
   * @param {string} connectionId
   * @param {{}} msg
   */
  send(connectionId, msg) {
    if (!connectionId) return;
    this._connections[connectionId].send(JSON.stringify(msg));
  }
}

module.exports = WebSocket;
