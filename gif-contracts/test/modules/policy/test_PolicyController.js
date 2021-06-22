const PolicyController = artifacts.require('PolicyController');

const str2Bytes32 = str => web3.utils.utf8ToHex(str).substr(0, 32).padEnd(32, '0');


contract('PolicyController', (accounts) => {
  it('should create a PolicyFlow', async () => {
    const PC = await PolicyController.deployed();
    await PC.createPolicyFlow(1, str2Bytes32('abc'));
  });
});
