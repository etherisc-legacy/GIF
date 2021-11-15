const gif = require('../bin/index.js');


const { log } = console;
/**
 * Main function
 * @returns {Promise<void>}
 */
const main = async () => {
  const instance = new gif.Instance('http://localhost:8545', '0x9F544a3Fc3D1045e6ec49D4ecEF6dCD700457165');
  log(instance);

  const conConfig = await instance.getContractConfig('Query');
  log(`Contract address: ${conConfig.address}, ABI: ${conConfig.abi.length} elements.`);

  const con = await instance.getContract('Query');
  log(`Contract object Class=${con.constructor.name}`);

  log(instance);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    log(err);
    process.exit(1);
  });
