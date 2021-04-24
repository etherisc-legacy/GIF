#!/usr/bin/env node

const fs = require('fs-jetpack');
const { verify } = require('truffle-source-verify/lib');
const { info } = require('../../io/logger');

/**
 *
 * @param{string} contract
 * @returns {Promise<void>}
 */
const checkThenVerify = async (contract) => {
  if (fs.find('contracts', { matching: `${contract}.sol`, recursive: true })) {
    info('Verifying Registry on Blockscout');
    await verify([contract], 'xdai', 'Apache-2.0');
  }
};

/**
 *
 * @returns {Promise<void>}
 */
const doVerify = async () => {
  await checkThenVerify('Registry');
  await checkThenVerify('RegistryController');
  await checkThenVerify('License');
  await checkThenVerify('LicenseController');
  await checkThenVerify('Policy');
  await checkThenVerify('PolicyController');
  await checkThenVerify('Query');
  await checkThenVerify('QueryController');
  await checkThenVerify('ProductService');
  await checkThenVerify('OracleOwnerService');
  await checkThenVerify('OracleService');
  await checkThenVerify('PolicyFlowDefault');
  await checkThenVerify('InstanceOperatorService');
};

doVerify();
