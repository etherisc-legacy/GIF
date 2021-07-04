#!/usr/bin/env node
require('dotenv').config();
const path = require('path');
const fs = require('fs-jetpack');
const pinataSDK = require('@pinata/sdk');


const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);


const ipfsPath = '/home/christoph/Documents/sandbox/ipfs';
const GIFPath = '/GIF';
const metaPath = '/meta';
const srcPath = '/src';
const { settings: { release } } = require('../../package.json');


const { log } = console;

async function main() {
  const artifactPaths = fs.find('./build', { matching: '*.json' });
  const releasePath = `${ipfsPath}${GIFPath}/releases/${release}`;
  if (fs.exists(releasePath)) {
    throw new Error('Release already published - bump release first!');
  }
  log('Writing sources & metadata...');
  log('========================================================');

  for (const _path of artifactPaths) {
    const artifact = require(path.join(process.cwd(), _path));
    const metaFN = `${releasePath}${metaPath}/${artifact.contractName}.meta.json`;
    const srcFN = `${releasePath}${srcPath}/${artifact.contractName}.sol`;
    log(`Writing ${artifact.contractName} to ${metaFN} / ${srcFN} ...`);
    fs.write(metaFN, artifact.metadata);
    fs.write(srcFN, artifact.source);
  }

  log('Uploading to Pinata');
  log('========================================================');

  const options = {
    pinataMetadata: {
      name: `${GIFPath}/releases/${release}`,
      keyvalues: { release },
    },
    pinataOptions: {
      cidVersion: 0,
      wrapWithDirectory: true,
    },
  };

  pinata.pinFromFS(ipfsPath, options);
  log();
  log('Finished.');
  log();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    log(err.message);
    process.exit(1);
  });
