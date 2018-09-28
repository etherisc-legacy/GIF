const AWS = require('aws-sdk');
const DipArtifactsStorage = require('./DipArtifactsStorage');


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY || 'accesskey',
  secretAccessKey: process.env.AWS_SECRET_KEY || 'secretkey',
  endpoint: process.env.AWS_ENDPOINT || 'http://localhost:9000',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const dipArtifactsStorage = new DipArtifactsStorage({
  amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672',
  s3,
});

s3.createBucket({ Bucket: 'dip-artifacts-storage' }).promise()
  .catch((e) => {
    console.error(e);
    if (e.code !== 'BucketAlreadyOwnedByYou') process.exit(1);
  })
  .then(async () => {
    console.log('Running listener');
    await dipArtifactsStorage.listen().catch((e) => {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
      process.exit(1);
    });
  });
