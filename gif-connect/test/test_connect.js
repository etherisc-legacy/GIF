const gif = require('../bin/index.js');


const instance = new gif.Instance('http://localhost:8545', '0x9F544a3Fc3D1045e6ec49D4ecEF6dCD700457165');


console.log(instance);

/**
 *
 * @returns {Promise<void>}
 */
const main = async () => {
  const con = await instance.getContract('Query');
  console.log('Con', con);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
