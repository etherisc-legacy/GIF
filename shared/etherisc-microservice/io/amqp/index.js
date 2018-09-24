const amqplib = require('amqplib');


class Amqp {
  async connect(connectionString) {
    this.connection = await amqplib.connect(connectionString || 'amqp://localhost:5672');
  }
}

module.exports = Amqp;
