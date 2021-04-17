const axios = require('axios');
const fs = require('fs-jetpack');


/**
 *
 * @param {{}} contractJson
 * @param {string} flattenedSourceFile
 * @param {string} network
 * @returns {{}}
 */
const xDaiVerifyContract = async (contractJson, flattenedSourceFile, network) => {
  const baseUrl = 'https://blockscout.com/xdai/mainnet/api';
  const urlParams = '?module=contract&action=verify';
  const source = fs.read(flattenedSourceFile);
  const metadata = JSON.parse(contractJson.metadata);
  if (!contractJson.networks[network]) {
    return {
      success: false,
      message: `Contract ${contractJson.contractName} is not deployed on network ${network}`,
    };
  }
  const { address } = contractJson.networks[network];

  const payload = {
    name: contractJson.contractName,
    addressHash: address,
    compilerVersion: metadata.compiler.version,
    optimization: metadata.settings.optimizer.enabled,
    optimizationRuns: metadata.settings.optimizer.runs,
    autodetectConstructorArguments: true,
    evmVersion: metadata.settings.evmVersion,
  };

  // eslint-disable-next-line no-console
  console.log('Attempting contract verification', JSON.stringify(payload, null, 2));

  payload.contractSourceCode = source;

  const response = await axios.post(baseUrl + urlParams, payload);

  if (response.status === 200) {
    return {
      success: true,
      message: 'Contract verified',
    };
  }
  return {
    success: false,
    message: response.statusText,
  };
};

module.exports = { xDaiVerifyContract };
