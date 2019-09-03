.. _rst_table_of_contents:

Coding part
===========

Configure a Truffle project
***************************

Now we are ready to build a product. Create a new directory for it.

::

    mkdir estore-insurance
    cd estore-insurance

Install required dependencies:

- `Truffle <https://truffleframework.com/>`_ — a development environment for smart contracts, truffle-hdwallet-provider — we use it to sign transactions during the deployment with a mnemonic account.

- @etherisc/gif — GIF core smart contracts — we need the Product.sol contract to inherit from it.

- `openzeppelin-solidity <https://openzeppelin.org/>`_ — a library for smart contract development — we will use Ownerable.sol from it.

The last command here will bootstrap a typical Truffle project for us.

::

    npm init -y
    npm install truffle truffle-hdwallet-provider @etherisc/gif openzeppelin-solidity
    ./node_modules/.bin/truffle init

Edit truffle-config.json

::

        module.exports = {
     networks: {
        development: {
          host: 'localhost',
          port: 8545,
          network_id: 7777,
          gas: 6600000,
          gasPrice: 10 * (10 ** 9),
          websockets: true,
        },
      },
      compilers: {
        solc: {
          version: "0.5.2",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },
      },
    };

Then add "compile" and "migrate" commands to the scripts section in the package.json file. The first one will be used to compile smart contracts. The second one is needed to deploy them to the relevant network (we will deploy to local blockchain).

::

    ...

    "scripts": {
      "compile": "truffle compile",
      "migrate": "truffle migrate"
    },

    ...

File: ./package.json
