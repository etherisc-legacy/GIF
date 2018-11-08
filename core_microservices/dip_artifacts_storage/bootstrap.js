const AWS = require('aws-sdk');
const { bootstrap, isDockerHost } = require('@etherisc/microservice');
const DipArtifactsStorage = require('./DipArtifactsStorage');


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY || 'accesskey',
  secretAccessKey: process.env.AWS_SECRET_KEY || 'secretkey',
  endpoint: process.env.AWS_ENDPOINT || 'http://localhost:9000',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

s3.createBucket({ Bucket: 'dip-artifacts-storage' }).promise()
  .catch((e) => {
    console.error(e);
    if (e.code !== 'BucketAlreadyOwnedByYou') process.exit(1);
  })
  .then(async () => {
    bootstrap(DipArtifactsStorage, {
      httpPort: isDockerHost() && !process.env.CI ? 3000 : 3012,
      s3,
    });
  });
