const amqp = require('amqplib/callback_api');
const dipMessages = require('@etherisc/messages');


module.exports = (config) => {
  const mqBroker = process.env.MESSAGE_BROKER || config.broker;

  const messageQueue = { publish: () => null };

  const { pack, unpack, headers } = dipMessages;

  amqp.connect(mqBroker, (error, connection) => {
    if (error) {
      console.log(`[Broker connection error] ${error.message}`);
      return;
    }
    connection.createChannel((err, channel) => {
      const exchangeName = 'GeneralTopic';

      channel.assertExchange(exchangeName, 'topic', {
        durable: true,
      });

      messageQueue.publish = (message) => {
        const key = 'anonymous.test.v1';

        channel.publish(exchangeName, key, pack({ text: message }, 'test'), headers());

        console.log(`[Write] ${key}: '${message}'`);
      };

      channel.assertQueue('', { exclusive: true }, (e, { queue }) => {
        channel.bindQueue(queue, exchangeName, '#');

        channel.consume(queue, (message) => {
          const content = unpack(message.content, 'test');
          console.log(
            `[Read] ${message.fields.routingKey}: '${JSON.stringify(content)}' (${JSON.stringify(message.properties)})`,
          );
        }, { noAck: true });
      });
    });
  });

  return messageQueue;
};
