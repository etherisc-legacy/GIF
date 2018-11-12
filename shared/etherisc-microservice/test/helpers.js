/**
 * Delete AMQP exchange along with the queues and the bindings
 * @param {Object} amqp
 * @param {string} [exchangeName=test]
 */
module.exports.deleteTestExchange = async (amqp, exchangeName) => {
  await amqp._channel.deleteExchange(exchangeName, { ifUnused: false });
};

/**
 * Delete S3 bucket
 * @param {Object} s3
 * @param {string} bucketName
 */
module.exports.deleteTestBucket = async (s3, bucketName) => {
  const { Contents: list } = await s3.listObjectsV2({ Bucket: bucketName }).promise();
  await Promise.all(list.map(o => s3.deleteObject({ Bucket: bucketName, Key: o.Key }).promise()));
  await s3.deleteBucket({ Bucket: bucketName }).promise();
};
