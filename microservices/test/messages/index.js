const amqp = require('amqplib/callback_api');
const uuid = require('uuid/v4');

module.exports = (config) => {
    const mqBroker = process.env.MESSAGE_BROKER || config.broker;

    let messageQueue = { publish: (_) => { return null; }};

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
                channel.publish(exchangeName, key, new Buffer.from(message), {
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
                    console.log(
                        `[Read] ${message.fields.routingKey}: '${message.content.toString()}' (${JSON.stringify(message.properties)})`
                    );
                }, {noAck: true});
            });

        });
    });

    return messageQueue;
};
