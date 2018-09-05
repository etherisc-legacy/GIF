const amqp = require('amqplib/callback_api');
const uuid = require('uuid/v4');
const dipMessages = require('dip-messages');

module.exports = (config) => {
    const mqBroker = process.env.MESSAGE_BROKER || config.broker;

    let messageQueue = { publish: (_) => { return null; }};

    let { pack, unpack } = dipMessages;

    amqp.connect(mqBroker, function(error, connection) {
        if (error) {
            console.log(`[Broker connection error] ${error.message}`);
            return;
        }
        connection.createChannel(function(error, channel) {
            let exchangeName = 'GeneralTopic';

            channel.assertExchange(exchangeName, 'topic', {durable: true});

            messageQueue.publish = (message) => {
                let key = 'anonymous.info.v1';

                channel.publish(exchangeName, key, pack({ text: message }, 'test'), {
                    correlationId: uuid(),
                    headers: {
                        originatorName: process.env.npm_package_name,
                        originatorVersion: process.env.npm_package_version,
                    }
                });

                console.log(`[Write] ${key}: '${message}'`);
            };

            channel.assertQueue('', {exclusive: true}, function(err, {queue}) {
                channel.bindQueue(queue, exchangeName, '#');

                channel.consume(queue, function(message) {
                    var content = unpack(message.content, 'test');
                    console.log(
                        `[Read] ${message.fields.routingKey}: '${JSON.stringify(content)}' (${JSON.stringify(message.properties)})`
                    );
                }, {noAck: true});
            });

        });
    });

    return messageQueue;
};
