#!/usr/bin/env node

const fs = require('fs-jetpack')
const {verify} = require('truffle-source-verify/lib')
const {info} = require('../../io/logger')

/**
 *
 * @param{string} contract
 * @returns {Promise<void>}
 */
const checkThenVerify = async contract => {
  if (fs.find('contracts', {matching: `${contract}.sol`, recursive: true})) {
    const code = await verify([contract], 'xdai', 'Apache-2.0')
    return (code === 0 ? `${contract}: successfully verified` : `${contract}: verification failed`)
  }
  return `${contract}: not deployed on xdai`
}

/**
 *
 * @returns {Promise<void>}
 */
const doVerify = async () => {
  const contracts = [
    'Registry',
    'RegistryController',
    'License',
    'LicenseController',
    'Policy',
    'PolicyController',
    'Query',
    'QueryController',
    'ProductService',
    'OracleOwnerService',
    'OracleService',
    'PolicyFlowDefault',
    'InstanceOperatorService',
  ]

  const res = []
  for (let idx = 0; idx < contracts.length; idx += 1) {
    res.push(await checkThenVerify(contracts[idx]))
  }

  info(JSON.stringify(res, null, 2))
}

doVerify()
