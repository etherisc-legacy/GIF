const amqp = require('amqplib');
const fs = require('promise-fs');


const amqpBroker = process.env.MESSAGE_BROKER || 'amqp://localhost:5672';
const version = process.env.npm_package_version;
const network = process.env.NETWORK || 'development';
let ch;
let contracts;

/**
 * Request artifacts
 * @param {object} message
 * @return {void}
 */
const requestArtifacts = (message) => {
  try {
    const content = JSON.parse(message.content.toString());
    if (content.network !== network || content.version !== version) return;
    contracts = content.list;
    if (contracts.length === 0) process.exit(0);
    contracts.forEach((contract) => {
      ch.publish('POLICY', 'contract.get_artifact.v1', Buffer.from(JSON.stringify({ network, version, contract })), {
        headers: {
          originatorName: process.env.npm_package_name,
          originatorVersion: process.env.npm_package_version,
        },
      });
    });
  } catch (e) {
    console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
  }
};

/**
 * Save artifact
 * @param {object} message
 * @return {void}
 */
const saveArtifact = async (message) => {
  try {
    const content = JSON.parse(message.content.toString());
    if (content.network !== network || content.version !== version) return;
    const { contract, artifact } = content;
    await fs.writeFile(`./build/contracts/${contract}.json`, artifact);
    contracts = contracts.filter(e => e !== contract);
    if (contracts.length === 0) process.exit(0);
  } catch (e) {
    console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
  }
};

(
  async () => {
    try {
      const conn = await amqp.connect(amqpBroker);
      ch = await conn.createChannel();
      await ch.assertExchange('POLICY', 'topic', { durable: true });

      let getArtifactList = await ch.assertQueue('contract.get_artifact_list.v1', { exclusive: false });
      while (getArtifactList.consumerCount === 0) {
        getArtifactList = await ch.assertQueue('contract.get_artifact_list.v1', { exclusive: false });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      ch.publish('POLICY', getArtifactList.queue, Buffer.from(JSON.stringify({ network, version })), {
        headers: {
          originatorName: process.env.npm_package_name,
          originatorVersion: process.env.npm_package_version,
        },
      });

      const artifactList = await ch.assertQueue('contract.artifact_list.v1', { exclusive: false });
      await ch.bindQueue(artifactList.queue, 'POLICY', 'contract.artifact_list.v1');
      await ch.consume(artifactList.queue, requestArtifacts, { noAck: true });

      const artifact = await ch.assertQueue('contract.artifact.v1', { exclusive: false });
      await ch.bindQueue(artifact.queue, 'POLICY', 'contract.artifact.v1');
      await ch.consume(artifact.queue, saveArtifact, { noAck: true });
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
      process.exit(1);
    }
  }
)();
