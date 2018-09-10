const WebSocket = require('ws');
const uuid = require('uuid/v1');
const amqp = require('amqplib');

const shared = {
  exhanges: {
    policy: 'POLICY',
  },
  queues: {
    policyLog: 'policy.log',
    policyCreate: 'policy.create',
  },
  topic: {
    policyCreate: 'policy.create',
    policyCreationSuccess: 'policy.creation_success',
  },
};



class Logger {
  constructor() {
    this.info = console.log;
    this.error = console.error;
  }
};


class GenericInsurance {
  constructor(app) {
    const logger = new Logger();

    this._app = app;
    this._app.dip = this;
    this._app.log = logger;

    this.log = logger;

    this._connections = {};

    this._amqp = null;
  }

  async listen({ amqpBroker, wsPort }) {
    const conn = await amqp.connect(amqpBroker);

    this._amqp = await conn.createChannel();

    const wss = new WebSocket.Server({ port: wsPort });
    wss.on('connection', ws => this.register(ws));

    await this._amqp.assertExchange(shared.exhanges.policy, 'topic', { durable: true });

    const q = await this._amqp.assertQueue(shared.queues.policyLog, { exclusive: false });
    await this._amqp.bindQueue(q.queue, shared.exhanges.policy, '#');

    await this._amqp.consume(q.queue, (message) => {
      console.log(`[READ]: ${message.fields.routingKey}: '${message.content.toString()}'`);

      this.send(message.properties.correlationId, {
        from: `${message.properties.headers.originatorName}.v${message.properties.headers.originatorVersion}`,
        topic: message.fields.routingKey,
        msg: message.content.toString(),
      });

      if (message.fields.routingKey === 'policy.state_changed.v1') {
        this._app.onLogStateContractEvent(message.properties.correlationId, {
          state: JSON.parse(message.content.toString()).state,
        });
      }

      if (message.fields.routingKey === 'policy.card_charged.v1') {
        this._app.onCardCharged(message.properties.correlationId, {});
      }

      if (message.fields.routingKey === 'policy.sertificate_issued.v1') {
        this._app.onCertificateIssued(message.properties.correlationId, {});
      }

    }, { noAck: true });


    this.log.info(`${this._app.name} listening at ws://localhost:${wsPort}/ws`);
  }

  register(connection) {
    const connectionId = uuid();

    this._connections[connectionId] = connection;

    this.send(connectionId, {
      from: `${process.env.npm_package_name}.v${process.env.npm_package_version}`,
      topic: null,
      msg: 'WebSocket connection successfully established'
    });

    connection.on('message', message => this.processMessage(connectionId, message));
  }

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

  send(connectionId, msg) {
    this._connections[connectionId].send(JSON.stringify(msg));
  }

  async createPolicy(clientId, payload) {
    const key = `${shared.topic.policyCreate}.v1`;

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish(shared.exhanges.policy, key, Buffer.from(JSON.stringify(payload)), {
      correlationId: clientId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }

  async chargeCard(policyId) {
    const key = 'policy.charge_card.v1';

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish(shared.exhanges.policy, key, Buffer.from(JSON.stringify({ policyId })), {
      correlationId: policyId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }

  async payout(policyId) {
    const key = 'policy.payout.v1';

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish(shared.exhanges.policy, key, Buffer.from(JSON.stringify({ policyId })), {
      correlationId: policyId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }

  async issueCertificate(policyId) {
    const key = 'policy.issue_certificate.v1';

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish(shared.exhanges.policy, key, Buffer.from(JSON.stringify({ policyId })), {
      correlationId: policyId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }
}

module.exports = GenericInsurance;
