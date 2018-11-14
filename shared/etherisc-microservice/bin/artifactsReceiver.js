#!/usr/bin/env node

const fs = require('fs-extra');
const { fabric } = require('../index');


const product = process.env.npm_package_name;
const network = process.env.NETWORK || 'development';
const { s3, log } = fabric();

(
  async () => {
    try {
      await s3.bootstrap('dip-artifacts-storage');

      fs.emptyDirSync('./build/contracts');

      const artifacts = await s3.getArtifacts(product, network);
      log.info(`Received ${artifacts.length} artifacts`);
      await Promise.all(
        artifacts.map(o => fs.writeFile(`./build/contracts/${o.name}`, JSON.stringify(o.content))),
      );
      process.exit(0);
    } catch (e) {
      log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
      process.exit(1);
    }
  }
)();
