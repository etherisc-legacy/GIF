#!/usr/bin/env node
require('dotenv').config();
const path = require('path');
const fs = require('fs-jetpack');
const pinataSDK = require('@pinata/sdk');
const cf = require('cloudflare')({
  token: process.env.CLOUDFLARE_API_TOKEN,
});


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

  artifactPaths.forEach((_path) => {
    const artifact = require(path.join(process.cwd(), _path));
    const metaFN = `${releasePath}${metaPath}/${artifact.contractName}.meta.json`;
    const srcFN = `${releasePath}${srcPath}/${artifact.contractName}.sol`;
    // log(`Writing ${artifact.contractName} to ${metaFN} / ${srcFN} ...`);
    fs.write(metaFN, artifact.metadata);
    fs.write(srcFN, artifact.source);
  });

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

  let ipfsHash;
  try {
    const result = await pinata.pinFromFS(ipfsPath, options);
    log(result);
    ipfsHash = result.IpfsHash;
  } catch ({ message, stack }) {
    log(message, stack);
  }

  log('Updating DNSLink');
  log('========================================================');

  const cfRecords = await cf.dnsRecords.browse(process.env.CLOUDFLARE_ZONE_ID, {
    page: 1,
    per_page: 100,
  });

  const cfId = cfRecords.result.find(item => item.name === '_dnslink.ipfs.etherisc.com');
  cfId.content = `dnslink=/ipfs/${ipfsHash}`;
  const result = await cf.dnsRecords.edit(process.env.CLOUDFLARE_ZONE_ID, cfId.id, cfId);
  log(result);

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
