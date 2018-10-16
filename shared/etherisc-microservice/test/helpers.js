/**
 * Delete AMQP exchange along with the queues and the bindings
 * @param {Object} amqp
 * @param {string} [exchangeName=test]
 */
module.exports.deleteTestExchange = async (amqp, exchangeName) => {
  await amqp._channel.deleteExchange(exchangeName, { ifUnused: false });
  console.log(`Deleted exchange ${exchangeName}`);
};
