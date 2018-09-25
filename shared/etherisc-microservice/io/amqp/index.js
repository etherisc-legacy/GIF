const amqplib = require('amqplib');

/**
 * RabbitMQ client
 */
class Amqp {
  /**
   * Connect to RabbitMQ broker
   * @param {string} connectionString
   * @return {Promise<void>}
   */
  async connect(connectionString) {
    this.connection = await amqplib.connect(connectionString || 'amqp://localhost:5672');
  }
}

module.exports = Amqp;
