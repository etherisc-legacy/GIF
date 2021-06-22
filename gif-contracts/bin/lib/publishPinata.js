#!/usr/bin/env node
require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const path = require('path');
const fs = require('fs-jetpack');
const fileStream = require('fs');


const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);


const { log } = console;

async function main() {
  const artifactPaths = fs.find('./build', { matching: '*.json' });

  log('Uploading sources & metadata to IPFS (via Pinata)...');
  log('========================================================');

  for (const _path of artifactPaths) {
    const artifact = require(path.join(process.cwd(), _path));
    const options = {
      pinataMetadata: {
        name: artifact.contractName,
        keyvalues: {
          type: 'metadata',
          date: Date.now(),
        },
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    log();
    log(artifact.contractName);
    log('-'.repeat(artifact.contractName.length));

    const resM = await pinata.pinJSONToIPFS(JSON.parse(artifact.metadata), options);
    log(`metadata: ${resM.IpfsHash}`);

    options.pinataMetadata.keyvalues.type = 'source';
    fs.write('/tmp/source.txt', artifact.source);
    const readableStream = fileStream.createReadStream('/tmp/source.txt');
    const resS = await pinata.pinFileToIPFS(readableStream, options);

    log(`source:   ${resS.IpfsHash}`);
  }

  log();
  log('Finished.');
  log();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    log(err);
    process.exit(1);
  });
