const fs = require('promise-fs');
const { fabric } = require('@etherisc/microservice');


const version = process.env.npm_package_version;
const network = process.env.NETWORK || 'development';
const { amqp, log } = fabric();
let contracts;

/**
 * Request artifacts
 * @param {object} message
 * @return {void}
 */
const requestArtifacts = ({ content, fields, properties }) => {
  try {
    if (content.network !== network || content.version !== version) return;
    contracts = content.list;
    if (contracts.length === 0) process.exit(0);
    contracts.forEach((contract) => {
      amqp.publish({
        messageType: 'artifactRequest',
        messageVersion: '1.*',
        content: { network, version, contract },
        correlationId: '',
      });
    });
  } catch (e) {
    log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
  }
};

/**
 * Save artifact
 * @param {object} message
 * @return {void}
 */
const saveArtifact = async ({ content, fields, properties }) => {
  try {
    if (content.network !== network || content.version !== version) return;
    const { contract, artifact } = content;
    await fs.writeFile(`./build/contracts/${contract}.json`, artifact);
    contracts = contracts.filter(e => e !== contract);
    if (contracts.length === 0) process.exit(0);
  } catch (e) {
    log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
  }
};

(
  async () => {
    try {
      await amqp.bootstrap();

      await amqp.publish({
        messageType: 'artifactListRequest',
        messageVersion: '1.*',
        content: { network, version },
      });

      amqp.consume({
        messageType: 'artifactList',
        messageVersion: '1.*',
        handler: requestArtifacts,
      });

      amqp.consume({
        messageType: 'artifact',
        messageVersion: '1.*',
        handler: saveArtifact,
      });

      setTimeout(() => {
        log.error(new Error('Failed to receive artifacts in 30s'));
        process.exit(1);
      }, 30 * 1000);
    } catch (e) {
      log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
      process.exit(1);
    }
  }
)();
