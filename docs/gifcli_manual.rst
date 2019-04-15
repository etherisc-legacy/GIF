.. _rst_table_of_contents:

######################################################
User Manual for the GIF sandbox Command Line Interface
######################################################

.. pull-quote::

    Once developed by the Etherisc team, the Generic Insurance Framework (GIF) is released as an environment where product builders can create their own products. To access the GIF and to make user experience more enjoyable, the Etherisc team has also created a so-called "sandbox" — a particular working environment where product builders are able to experiment with their products in a test mode, not worrying about possible "unexpected" results.

    The next step is to equip product builders with a plain and powerful solution, enabling them to operate the GIF, as well as a sandbox for it. Such a solution is now available for product builders through the GIF Command Line Interface (CLI). Here, we present a quick reference on how to use the Command Line Interface while working with the GIF.

    For better understanding of this document, you can refer to the `User manual for the GIF <https://gif-manual.readthedocs.io/en/latest/index.html>`_ to refresh the content and the features of the framework. There you can also find basic methods necessary for creating your own product's contract.
    
Prerequisites
*************

To make interactions with the GIF efficient and pleasant, the very first thing to do is to setup the required working environment. 
Such environment already exists and runs in the sandbox with all the necessary core smart contracts deployed, as well as microservices activated and ready to use. 
In addition, you should install `NodeJS <https://nodejs.org/>`_ (version 8.12.0 or later, npm version 6.4.1 or later) and `Python <https://www.python.org/>`_.

After that, to install the CLI you just need to insert the ``npm install -g @etherisc/gifcli`` command in the command line of your computer. 
You can also check the version of the CLI by running the ``gifcli version`` command, as in the example below.

::

    $ npm install -g @etherisc/gifcli

    $ gifcli (-v|--version|version)
    @etherisc/gifcli/1.1.2 win32-x64 node-v10.15.3

General description
*******************

The basic principle of the CLI is the same as of any other command line: to manage a programming working environment with commands. Actually, you run the CLI within the operating system console of your computer (e.g., a command line of Microsoft Windows, Ubuntu, etc.).

Here, we list commands available for product builders and will further describe each command in more detail. There are a few basic commands in the **CLI mode** available right after installation of the **gifcli** necessary for making the very first steps: ``gifcli console`` , ``gifcli exec`` , ``gifcli help [or any other gifcli command with a space after "help" and without an additional "gifcli", 
e.g. *gifcli help user:register*]`` , ``gifcli user:register`` , ``gifcli product:create`` , ``gifcli product:select`` , ``gifcli artifact:send`` and ``gifcli user:logout`` .

The other commands are used when you have already created a product. These commands (beginning with "gif") are available in the **console mode** , which is run by the ``gifcli console`` command.

In the table below, you can see a list of commands, available on the GIF CLI.

.. list-table:: 
   :widths: 10 12 12
   :header-rows: 1

   * - Group of commands/ methods
    
     - CLI mode 

       (gifcli [COMMAND] 

       — commands)
     - Console + Execute mode 

       (gif.[METHOD] — methods)
   * - **Common service commands/**

       methods**
     - gifcli console 
       
       gifcli exec 

       gifcli help [type here the name 

       of the necessary command, 

       i.e. product:create]
     - gif.help() 
       
       gif.help('type a command

       here, i.e. product.get')
   * - **Commands related to users** 

       **(product builders)**
     - gifcli user:register

       gifcli user:logout
     - —
   * - **Commands to manage products**
     - gifcli product:create

       gifcli product:select

       gifcli artifact:send
     - gif.product.get
   * - **Methods to set and oversee** 

       **the business processes**

       **of a product**
     - —
     - gif.bp.create

       gif.bp.list

       gif.bp.getById

       gif.bp.getByKey
       
   * - **Methods to interact with** 

       **product contracts**
     - —
     - gif.contract.call

       gif.contract.send
   * - **Methods related to customers** 

       **(end-users of a product,** 

       **developed by**

       **product builders)**
     - —
     - gif.customer.create

       gif.customer.getById

       gif.customer.list
   * - **Methods to manage applications**
     - —
     - gif.application.list

       gif.application.getById
   * - **Methods to interact with a policy**
     - —
     - gif.policy.list

       gif.policy.getById
   * - **Methods to manage claims**
     - —
     - gif.claim.list

       gif.claim.getById
   * - **Methods to work with payouts**
     - —
     - gif.payout.list

       gif.payout.getById

When using the CLI for the first time, you need to register a user. Then, you can create your product, add customers, etc.

There are three modes of working with the CLI: a basic **CLI mode** (you can use it by inputing ``gifcli [COMMAND]`` in your system's command line), a **console mode** (using the ``gifcli console command``) and an **execute mode** (by the ``gifcli exec`` command). As we've mentioned, the first one becomes available right after the installation of the GIF CLI. The other commands would be ready for use just after you have created a user and a product. The **console mode** enables you to input methods one by one directly into the command line, and the **execute mode** allows to write sequence of commands in a particular file and then execute this file in the CLI.

In the console mode, as well as in the execute mode, you interact with your product directly — the CLI executes commands on behalf of the current product (you can see the name of your current product in such a line: ``GIF :: ` **your product name** ` $ [COMMAND]``). As soon as you have several products, you can switch between them getting to the necessary product by the **gifcli product:select** command. To execute the gifcli commands, you should first exit from the console (or execute) mode by running ``Ctrl+C twice``.

In case of doubt, you can always refer to the ``gifcli help [COMMAND]`` command in the **CLI mode**. There, you can find a list of currently available commands. The execution of this command looks like that.

::

    gifcli help
    $ gifcli help
    gifcli ======
 
    VERSION
    @etherisc/gifcli/1.0.5 win32-x64 node-v10.15.3
 
    USAGE
      $ gifcli [COMMAND]
 
    COMMANDS
      artifact  manage artifacts
      console   run console mode
      exec      execute file
      help      display help for gifcli
      product   manage products
      update    update the gifcli CLI
      user      manage user


In the **console mode** (appears by the ``gifcli console`` command), you can input the ``gif.help()`` method into the command line. This will show you methods available for the user. Here is an example. 

::

    $ gifcli console
    GIF :: `your product name` > gif.help()
    gif.info                Information about the product
    gif.help                Get information about the command
    gif.artifact.get        Get artifact for contract
    gif.contract.send       Send transaction to contract
    gif.contract.call       Call contract
    gif.customer.create     Create customer
    gif.customer.getById    Get customer by id
    gif.customer.list       Get all customers
    gif.bp.create           Create new business process
    gif.bp.getByKey         Get business process by key identifier
    gif.bp.getById          Get business process by id identifier
    gif.bp.list             Get all business processes
    gif.application.getById Get application by id
    gif.application.list    Get all applications
    gif.policy.getById      Get policy by id
    gif.policy.list         Get all policies
    gif.claim.getById       Get claim by id
    gif.claim.list          Get all claims
    gif.payout.getById      Get payout by id
    gif.payout.list         Get all payouts
    gif.product.get         Get product instance


To learn more about each of the above-mentioned methods use the ``gif.help('...')`` method. For instance, ``gif.help('product.get')``. 

A step-by-step guide
********************

Here, we present basic steps that demonstrate you how to start working with the GIF and its command line interface — from registering a user to making a payout by your product. In addition, you will find other available extension commands in the General description section. This will help you to execute all the necessary processes.

We will go through all the steps necessary to interact with the GIF CLI on the basis of our default sample contracts. You can create your own products (contracts) using whether required `basic methods <https://gif-manual-test.readthedocs.io/en/latest/core_smart_contracts.html>`_ or other methods and business logic developed and implemented by yourself.

Start working with the GIF CLI directly from running command line on your computer: 

1. First, you need to input the ``gifcli user:register`` command in the CLI. After that, fill in the fields with your first name, last name, and e-mail address, as well as create a password.

::

    $ gifcli user:register

    Firstname: John
    Lastname: Johnson
    Email: john.johnson@mail.com
    Password: ******* 
    Repeat password: ******* 

    User registered 


After this, a user will be created.

.. attention:: Be careful with the ``gifcli user:logout`` command. You need to use it only in case you want to make a new user instead of the previous one. This command clears up the **.gifconfig.json** file in your home directory. After executing the command, you will not be able to access your previously created products and customers. The password, as well as email address, first and last names for a new user should be different to that of the previous one. 

In case you would need to exploit your previous user, you should backup the **.gifconfig.json** file with the required credentials and then use it instead of the .gifconfig.json file with the data of your current one.


2. Then, obviously, you would like to start dealing with your products. If you want to create a product and become a product owner, use the ``gifcli product:create`` command. There, you can specify a product name. This name at the same time is registered at the RabbitMQ message broker.

::

    $ gifcli product:create 

    Product name: one 

    Product created


.. info:: Note that the length of the product's name should be 3 to 20 latin letters.


3. After that, you should create a directory by the ``mkdir`` command (``mkdir my-first-product`` in our example) for your product (the "one" for our case), and go to it (using the ``cd ./my-first-product`` command). 

::

    $ mkdir my-first-product

    Directory: /Users/username

    Mode                LastWriteTime         Length Name
    ----                -------------         ------ ----
    d-----         3/26/2019  16:30 PM                my-first-product


    PS ./Users/username> cd my-first-product
    PS ./Users/username/my-first-product>


4. Then, run the ``npm init -y`` command.

::

    $ npm init -y 

    Wrote to ./my-first-product/package.json:

    {  
      "name": "my-first-product",  
      "version": "1.0.0",  
      "description": "",  
      "main": "index.js",  
      "scripts": {    
        "test": "echo /"Error: no test specified/" && exit 1"  
      },  
      "keywords": [],  
      "author": "",  
      "license": "ISC" 
    }


5. After that, you should use the ``npm install truffle openzeppelin-solidity truffle-hdwallet-provider @etherisc/gif`` command. A successful execution should end up with the following lines.

::

    $ npm install truffle openzeppelin-solidity truffle-hdwallet-provider @etherisc/gif

    ...
    + truffle@5.0.10 
    + truffle-hdwallet-provider@1.0.6 
    + openzeppelin-solidity@2.2.0 
    + @etherisc/gif@1.0.0 
    added 892 packages from 1374 contributors and audited 3757 packages in 79.988s 
    found 0 vulnerabilities 


6. The next step is to execute the ``./node_modules/.bin/truffle init`` command:

::

    $ ./node_modules/.bin/truffle init 

    > Preparing to download 
    > Downloading 
    > Cleaning up temporary files 
    > Setting up box 

    Unbox successful. Sweet! 


    Commands:

      Compile:        truffle compile
      Migrate:        truffle migrate
      Test contracts: truffle test


7. Now you need to create your product's smart contract and deploy it. In our example, we need to take the following steps:

7a. First, we should replace the content of the **truffle-config.js** file in the "my-first-product" directory on our computer with the following one:

.. code-block:: javascript
    :linenos:

    const HDWalletProvider = require('truffle-hdwallet-provider');


    module.exports = {
      migrations_directory: process.env.MIGRATIONS_DIRECTORY || './migrations',
      contracts_build_directory: process.env.CONTRACTS_BUILD_DIRECTORY || './build',

      networks: {
        development: {
          host: 'localhost',
          port: 8545,
          network_id: 7777,
          gas: 6600000,
          gasPrice: 10 * (10 ** 9),
          websockets: true,
        },

        coverage: {
          host: 'localhost',
          network_id: '*',
          port: 8555, // the same port as in .solcover.js.
          gas: 0xfffffffffff,
          gasPrice: 0x01,
        },

        kovan: {
          // MNEMONIC: BIP39 mnemonic, e.g. https://iancoleman.io/bip39/#english
          // HTTP_PRODIVER: e.g. https://kovan.infura.io/<your-token>
          provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.HTTP_PROVIDER),
          network_id: 42,
          confirmation: 2,
          timeoutBlocks: 200,
          skipDryRun: true,
          gas: 6600000,
          gasPrice: 10 * (10 ** 9),
        },

        rinkeby: {
          // MNEMONIC: BIP39 mnemonic, e.g. https://iancoleman.io/bip39/#english
          // HTTP_PRODIVER: e.g. https://rinkeby.infura.io/<your-token>
          provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.HTTP_PROVIDER),
          network_id: 4,
          confirmation: 2,
          timeoutBlocks: 200,
          skipDryRun: true,
          gas: 6600000,
          gasPrice: 10 * (10 ** 9),
        },
      },

      mocha: {
        timeout: 20000,
        useColors: true,
      },

      compilers: {
        solc: {
          version: '0.5.2',
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
            evmVersion: 'byzantium', // -> constantinople
          },
        },
      },
    };

7b. Then, we can create our product contract taking the following one as an example. We create a **SimpleProduct.sol** file in the "contracts" folder in our "my-first-product" directory with the content below.

.. code-block:: solidity
    :linenos:

    pragma solidity 0.5.2;

    import "@etherisc/gif/contracts/Product.sol";


    contract SimpleProduct is Product {

        event NewApplication(uint256 applicationId);
        event NewPolicy(uint256 policyId);
        event ApplicationDeclined(uint256 applicationId);
        event NewClaim(uint256 policyId, uint256 claimId);
        event NewPayout(uint256 claimId, uint256 payoutId, uint256 payoutAmount);
        event PolicyExpired(uint256 policyId);
        event PayoutConfirmation(uint256 payoutId, uint256 amount);

        bytes32 public constant NAME = "SimpleProduct";
        bytes32 public constant POLICY_FLOW = "PolicyFlowDefault";

        constructor(address _productController)
            public
            Product(_productController, NAME, POLICY_FLOW)
        {}

        function applyForPolicy(
            bytes32 _bpExternalKey,
            uint256 _premium,
            bytes32 _currency,
            uint256[] calldata _payoutOptions
        ) external onlySandbox {
            uint256 applicationId = _newApplication(
                _bpExternalKey,
                _premium,
                _currency,
                _payoutOptions
            );
            emit NewApplication(applicationId);
        }

        function underwriteApplication(uint256 _applicationId) external onlySandbox {
            uint256 policyId = _underwrite(_applicationId);
            emit NewPolicy(policyId);
        }

        function declineApplication(uint256 _applicationId) external onlySandbox {
            _decline(_applicationId);
            emit ApplicationDeclined(_applicationId);
        }

        function newClaim(uint256 _policyId) external onlySandbox {
            uint256 claimId = _newClaim(_policyId);
            emit NewClaim(_policyId, claimId);
        }

        function confirmClaim(uint256 _claimId, uint256 _payoutAmount) external onlySandbox {
            uint256 payoutId = _confirmClaim(_claimId, _payoutAmount);
            emit NewPayout(_claimId, payoutId, _payoutAmount);
        }

        function expire(uint256 _policyId) external onlySandbox {
            _expire(_policyId);
            emit PolicyExpired(_policyId);
        }

        function confirmPayout(uint256 _payoutId, uint256 _amount) external onlySandbox {
            _payout(_payoutId, _amount);
            emit PayoutConfirmation(_payoutId, _amount);
        }

        function getQuote(uint256 _sum) external view returns (uint256 _premium) {
            require(_sum > 0);
            _premium = _sum.div(20);
        }
    }

7c. Now we can proceed with making a deployment migration. Like in the previous step, we use the following sample for migration. We create a **2_deploy_SimpleProduct.js** file in the "migrations" folder in our "my-first-product" directory and paste the text of the sample contract here.

.. code-block:: javascript
    :linenos:

    const SimpleProduct = artifacts.require('SimpleProduct');

    const GIF_PRODUCT_SERVICE_CONTRACT = '0x0';

    module.exports = deployer => deployer.deploy(SimpleProduct, GIF_PRODUCT_SERVICE_CONTRACT);

7d. After that, we need to set the value of the constant GIF_PRODUCT_SERVICE_CONTRACT to **0x6520354fa128cc6483B9662548A597f7FcB7a687** — the address of the deployed smart contract. It should be placed in the **GIF_PRODUCT_SERVICE_CONTRACT** line of the **2_deploy_SimpleProduct.js** file. For your convenience we list addresses of the core smart contracts at the end of this manual.

7e. To finish with this step, we need to add the ``"compile": "truffle compile"``, ``"migrate": "truffle migrate"``, commands to the "scripts" section of the **package.json** file in the my-first-product directory.

8. Then, you should execute the ``npm run compile`` command.

::

    $ npm run compile

    > my-first-product@1.0.0 compile ./my-first-product
    > truffle compile

    Compiling your contracts... 
    =========================== 
    > Compiling @etherisc/gif/contracts/Product.sol
    > Compiling @etherisc/gif/contracts/services/IProductService.sol
    > Compiling @etherisc/gif/contracts/shared/RBAC.sol
    > Compiling ./contracts/Migrations.sol
    > Compiling ./contracts/SimpleProduct.sol
    > Compiling openzeppelin-solidity/contracts/math/SafeMath.sol
    > Compiling openzeppelin-solidity/contracts/ownership/Ownable.sol    

        ...

    > Artifacts written to ./my-first-product/build
    > Compiled successfully using:  
        -solc: 0.5.2+commit.1df8f40c.Emscripten.clang

.. note :: Before running the next command, you should create a mnemonic `here <https://iancoleman.io/bip39/#english>`_.
It is also required to fund your account with some test ETH on `Rinkeby test network <https://faucet.rinkeby.io/>`_.


9. After that, you can continue with the migration using the ``HTTP_PROVIDER="https://rinkeby.infura.io/v3/paste your infura key here" MNEMONIC="input here 
the mnemonic, created in the previous step" npm run migrate -- --network rinkeby`` command. To execute the command, you need to create an account at `Infura <https://infura.io/register>`_ (if you haven't yet) and paste the key from your account into the mentioned space in the command.

.. note :: Operating on the Ethereum environment, all the transactions consume "gas". You can face a warning message like this: *"Error:  *** Deployment Failed *** "Migrations" -- The contract code couldn't be stored, please check your gas limit."* In this case, you need to top up your account with some ETH and execute the command again.

::

    $ HTTP_PROVIDER="https://rinkeby.infura.io/v3/paste your infura key here" MNEMONIC="..." npm run migrate -- --network rinkeby 

    > my-first-product-2@1.0.0 migrate ./my-first-product-2
    > truffle migrate "--network" "rinkeby"

    Compiling your contracts...
    ===========================
    > Everything is up to date, there is nothing to compile.

    Starting migrations... 
    ====================== 
    > Network name:    'rinkeby' 
    > Network id:      4 
    > Block gas limit: 0x6acec5

    1_initial_migration.js 
    ======================   
        Deploying 'Migrations'   
        ---------------------   
        > transaction hash:    0x9313aeb218ae3b1174fd365c1ae921cc978e961d36b5616558a1003032d661ea   
        > Blocks: 0            Seconds: 8   
        > contract address:    0xACE701BfFd5c14EEFA565D1651f83D9ED9bd5e48
        > account:             0x1DdCFb13eb5109E53763677E04BC9FB8fAb40D4b   
        > balance:             xx.xxxxxxxx   
        > gas used:            221171   
        > gas price:           10 gwei   
        > value sent:          0 ETH   
        > total cost:          0.00xxxxxx ETH

        > Saving migration to chain.   
        > Saving artifacts   
        ------------------------------------   
        > Total cost:          0.00xxxxxx ETH

    2_deploy_SimpleProduct.js 
    ======================   
        Deploying 'SimpleProduct'   
        ---------------------   
        > transaction hash: 0xcd7bfec51303bb66639bd90cf6db2c40f2e875d744e97b35c41102c3e5a03170   
    ...
        > Saving migration to chain.   
        > Saving artifacts   
        ------------------------------------   
        > Total cost:       0.0xxxxxxx ETH

    Summary 
    ======= 
    > Total deployments: 2 
    > Final cost:        0.0xxxxxxx ETH 


10. Now you should input the ``gifcli artifact:send --file {PATH_TO_CONTRACT_ARTIFACT} --network rinkeby`` command, where PATH_TO_CONTRACT_ARTIFACT stands for a path to the **.json** file with artifacts for the contract. In our example, this part of the command looks like that: gifcli artifact:send --file **./my-first-product/build/SimpleProduct.json** --network rinkeby. You can find the SimpleProduct.json file (from our example) in the “build” folder of the “my-first-product” directory. It will appear on your computer after you execute the npm run compile command. The response for the successful execution of the command will be the following: 

::

    $ gifcli artifact:send --file ./my-first-product/build/SimpleProduct.json --network rinkeby


    { result: 'Artifact saved',
      product: 'one',
      contractName: 'SimpleProduct',
      address: '0xF8450d6b6be91C861d7ef2a91B5e2695aeAf335a',
      network: 'rinkeby',
      version: '1.0.5' }


**Now we've successfully created a product smart contract.**


11. As we are already in the "my-first-product" directory, we can run the console mode to proceed interacting with our product "one". We execute the ``gifcli console`` command.

::

    $ gifcli console


    GIF :: one >


12. By executing the ``gif.product.get()`` method, the CLI demonstrates the artifacts of the current product as they are registered on the GIF (compare the "name" of the product "SimpleProduct" instead of "one" at RabbitMQ).

::

    $ gif.product.get()

    { key: 18,  
        created: '2019-03-26T16:47:07.176Z',  
        updated: '2019-03-26T16:49:21.580Z',  
        productId: 21,  
        name: 'SimpleProduct',  
        addr: '0xf8450d6b6be91c861d7ef2a91b5e2695aeaf335a', 
        policyFlow: 'PolicyFlowDefault',  
        release: 0,  
        policyToken: '0x0000000000000000000000000000000000000000', 
        approved: true,  
        paused: false,
      productOwner: '0x0000000000000000000000000000000000000000' }


13. Now, you can proceed with creating a customer. Here, the ``gif.customer.create({ firstname: '...', 
lastname: '...', email: '...@....com' and other necessary arguments about your customers, e.g., the age: ,etc. })`` method will help:

::

    $ gif.customer.create({firstname:'Dear',lastname:'Customer',email:'dear.customer@mail.com', age: 33})

    { customerId:   
        '5efaf976b1fb4fe0be9b0d68e833c469757c2749863c33b77ce907e6f3bc8cee'
    } 


14. Then, using the ``gif.customer.getById("insert customer ID here")`` method, you can receive specific data related to a certain customer by a customer ID. From the previous step, you will receive the output with the customer's first name, last name, e-mail address, and age.

::

    $ gif.customer.getById("5efaf976b1fb4fe0be9b0d68e833c469757c2749863c33b77ce907e6f3bc8cee")


    { id:
       '5efaf976b1fb4fe0be9b0d68e833c469757c2749863c33b77ce907e6f3bc8cee',
      firstname: 'Dear',
      lastname: 'Customer',
      email: 'dear.customer@mail.com',
      created: '2019-03-26T16:49:59.059Z',
      updated: '2019-03-26T16:49:59.059Z',
      age: '33' }


15. You can also input the ``gif.customer.list()`` method. Like other methods related to the "lists" of particular issues, this method results in the list of customers of your current productt. In our example, we have only one customer.

::

    $ gif.customer.list()

    [ { id:     
         '5efaf976b1fb4fe0be9b0d68e833c469757c2749863c33b77ce907e6f3bc8cee',
        firstname: 'Dear',
        lastname: 'Customer',
        email: 'dear.customer@mail.com',
        created: '2019-03-26T16:50:20.059Z',
        age: '33' } ] 


16. The (bp - business process) ``gif.bp.create({ manager: 'customer_name' or customerId: '...' or both as well})`` method returns **bpExternalKey** required for **applyForPolicy** in a contract to link policy flow objects with an external database. This very method is used to connect a customer (a customer name or an ID is required) and all his/her data (optional inputs are provided in the {} brackets) important for the business process. The method can also look like that: ``gif.bp.create({ manager: 'Dear', customer: 
{ firstname: 'Dear', lastname: 'Customer', email: 'dear.customer@mail.com' } })``.

::

    $ gif.bp.create({manager: 'Dear', customerId:'5efaf976b1fb4fe0be9b0d68e833c469757c2749863c33b77ce907e6f3bc8cee'})

    { bpExternalKey: 'b5aaa0546e264f39a92baea697f53be5',  
        customerId:   
        '5efaf976b1fb4fe0be9b0d68e833c469757c2749863c33b77ce907e6f3bc8cee' } 


17. You can also make a list of your business processes by using the ``gif.bp.list()`` method:

::

    $ gif.bp.list()

    [ { key: 'b5aaa0546e264f39a92baea697f53be5',
        created: '2019-03-26T16:50:53.855Z',
        customerId: '5efaf976b1fb4fe0be9b0d68e833c469757c2749863c33b77ce907e6f3bc8cee',
        contractKey: null,
        productId: 1,
        id: 1,
        applicationId: 1,
        policyId: 0,
        hasPolicy: false,
        hasApplication: true,
        tokenContract: '0x0000000000000000000000000000000000000000',
        tokenId: -1,
        registryContract: '0x0000000000000000000000000000000000000000',
        release: 0,
        state: 0,
        stateMessage: '',
        bpExternalKey: 'b5aaa0546e264f39a92baea697f53be5',
        createdAt: 1553619141,
        updatedAt: 1553619141,
        manager: 'Dear' } ] 


You can use the ``gif.bp.getById()`` method as well as the ``gif.bp.getByKey()`` method to read a part of commonly shared data (metadata) of a particular business process. Metadata is contained both in the product's contract and in the product's database. The ``gif.bp.getById()`` method uses the ID of a business process in the product's contract (as you see the "id" line from above). The ``gif.bp.getByKey()`` method, that requires to input a unique key of the business process — an identifier in your product database (the "key" line in the example above). The same key is used when you apply for a policy (the 20th step in our example).


18. One more step is to execute the ``gif.contract.call("ProductName", "getQuote", [e.g. sum of payout by the contract])`` method. In our case, this method calls the method "getQuote", which sets the premium for our contract. As you can see from the sample, the premium is about 5% of the payout. By the gif.contract.call method, you can read any data of your product's contract or get a result of an executed function. This method does not change the state of the contract and does not make a transaction on the blockchain.

Here is the data from our sample:

::

    $ gif.contract.call('SimpleProduct','getQuote',[200])

    { _premium: '10' } 


19. The ``gif.contract.send("ProductName", "applyForPolicy", ['ExternalKey given at the 18th step', 
sum of payout, 'currency', [sum of premium]])`` method can be used for different purposes. As you can see from our example, it helps to apply for a policy but it is also used for underwriting applications, as well as creating and confirming claims. We will do this in a few steps. By this method, you can send transactions to the contract's method. As a result, the state of the contract is changed and a transaction on the blockchain is made.

::

    $ gif.contract.send('SimpleProduct', 'applyForPolicy', ['b5aaa0546e264f39a92baea697f53be5', 200,'EUR',[10]])

    { blockHash:   
        '0xd21fc587a9dfa50b65e08267b6d4f43d1b68fe7a1dc5a3330c0d0e9bcaae9773',  
        blockNumber: 4139120,  
        contractAddress: null,  
        cumulativeGasUsed: 437007,  
        from: '0x0e48196f6e7c8df0006bb7e7122e1e9f5ef46d6a', 
        gasUsed: 351892,  
        logsBloom:   
    ...
        returnValues: [Object],
        event: 'NewApplication',
        signature:
        '0x0ff47c4a3dc48719ecfd1876116e80d7d76ec7cb67248ae49449f9104747af29',
        raw: [Object] } } }


20. To look through applications of your product, you can execute the ``gif.application.list()`` method.

::

    $ gif.application.list()

    { key: 'e0937732cb1749c7aa81795393c7d3d2',
        created: '2019-03-26T16:52:22.019Z',
        contractKey: null,
        productId: 21,
        id: 13,
        metadataId: 13,
        premium: 200,
        currency: 'EUR',
        payoutOptions: '["10"]',
        state: 0,
        stateMessage: '',
        createdAt: 1553619141,
        updatedAt: 1553619141 } 


21. After creating applications, you can get data of a particular application by its ID using the ``gif.application.getById(ID number of an application)`` method. In our example, we got the ID number of the application (see the previous step). Its ID = 13. Then, we place it in brackets.

::

    $ gif.application.getById(13)
    { key: 'e0937732cb1749c7aa81795393c7d3d2',
        created: '2019-03-26T16:52:22.019Z',
        updated: '2019-03-26T16:52:22.019Z',
        contractKey: null,
        productId: 21,
        id: 13,
        metadataId: 13,
        premium: 200,
        currency: 'EUR',
        payoutOptions: '["10"]',
        state: 0,
        stateMessage: '',
        createdAt: 1553619141,
        updatedAt: 1553619141 } 


22. With the ``gif.contract.send("ProductName", "underwriteApplication", [application ID])`` method, you can underwrite a certain application.

::

    $ gif.contract.send('SimpleProduct','underwriteApplication',[13])

    { blockHash:
        '0x1d580e979734106c2b46eccb8f9b2522e342e58b6666104bbcbcd697fceb9152',
        blockNumber: 4139193,
        contractAddress: null,
    	cumulativeGasUsed: 1884903,
    	from: '0x0e48196f6e7c8df0006bb7e7122e1e9f5ef46d6a',
    	gasUsed: 235013,
    	logsBloom:
    ...
	returnValues: [Object],
        event: 'NewPolicy',
        signature:
         '0x174c94eb4ef02e690e5bd01790c284af662a414381f1c631bf388a8850a5db13',
        raw: [Object] } } } 


23. The ``gif.policy.list()`` method enables you to get a list of policies:

::

    $ gif.policy.list()

    [ { key: '30762af6af2d4267afc72f1714b1eb52',
        created: '2019-03-26T16:56:06.630Z',
        contractKey: null,
        productId: 21,
        id: 3,
        metadataId: 13,
        state: 0,
        stateMessage: '',
        createdAt: 1553619366,
        updatedAt: 1553619366 } ] 


24. You can also receive specific data related to a certain policy by a policy ID using the ``gif.policy.getById(ID number of a policy)`` method. As you can see from the previous step, the ID number of the policy is 3:

::

    $ gif.policy.getById(3)

    { key: '30762af6af2d4267afc72f1714b1eb52',
        created: '2019-03-26T16:56:06.630Z',
        updated: '2019-03-26T16:56:06.630Z',
        contractKey: null,
        productId: 21,
        id: 3,
        metadataId: 13,
        state: 0,
        stateMessage: '',
        createdAt: 1553619366,
        updatedAt: 1553619366 } 


25. To create a claim use the ``gif.contract.send("ProductName", "newClaim", [ID number of a policy])`` method:

::

    $ gif.contract.send('SimpleProduct','newClaim',[3])

    { blockHash:
        '0x30da89398de8083a250f031af72fbfc27fa64cfd2bb1a88d3963e5e151fc9582',
        blockNumber: 4139333,
        contractAddress: null,
        cumulativeGasUsed: 1017872,
        from: '0x0e48196f6e7c8df0006bb7e7122e1e9f5ef46d6a',
        gasUsed: 185825,
        logsBloom:
    ...
        returnValues: [Object],
        event: 'NewClaim',
        signature: '0xcb97bbaee7e6aa4ae5d3a69e8a66d1f15b6d4ebb585e5f8f26eaab86c49ae665',
        raw: [Object] } } } 


26. To list claims, you can use the ``gif.claim.list()`` method.

::

    $ gif.claim.list()

    [ { key: '651328ab2b764b52b4ba696a2f791ab9',
        created: '2019-03-26T16:58:21.538Z',
        contractKey: null,
        productId: 21,
        id: 3,
        metadataId: 13,
        data: '',
        state: 0,
        stateMessage: '',
        createdAt: 1553619501,
        updatedAt: 1553619501 } ] 


27. As you have already seen earlier, the same behavior, can be achieved by the ``gif.claim.getById(ID number of a policy)`` method:

::

    $ gif.claim.getById(3)

    { key: '651328ab2b764b52b4ba696a2f791ab9',
        created: '2019-03-26T16:58:21.538Z',
        updated: '2019-03-26T16:58:21.538Z',
        contractKey: null,
        productId: 21,
        id: 3,
        metadataId: 13,
        data: '',
        state: 0,
        stateMessage: '',
        createdAt: 1553619501,
        updatedAt: 1553619501 } 


28. You can provide a confirmation of a claim by the ``gif.contract.send("ProductName", "confirmClaim", 
[ ID number of a claim, sum of payout - in our case it is less, than amount of the premium])`` method:

::

    $ gif.contract.send('SimpleProduct','confirmClaim',[3,100])

    { blockHash:
        '0x129315bc294f7444c90e84c73ef81e2629c5939dd62bac1d23d15b4538ee809b',
        blockNumber: 4139427,
        contractAddress: null,
        cumulativeGasUsed: 1932170,
        from: '0x0e48196f6e7c8df0006bb7e7122e1e9f5ef46d6a',
        gasUsed: 283098,
        logsBloom:
    ...
        returnValues: [Object],
        event: 'NewPayout',
        signature:
         '0xf2891b2b2049ac20caebda64567475aab2ad4d50f1faa089cda0d70aaa1fb3f2',
        raw: [Object] } } } 


29. To make a payout, you need to confirm it using the ``gif.contract.send("ProductName", "confirmPayout", [ 3, 100  ])`` method:

::

    $ gif.contract.send('SimpleProduct','confirmPayout',[3,100])

    { blockHash:
	    '0x80c925e2f6e4eea469d5c6ab33f70e8291c1a25c3e56478155423e15bf917ae8',
        blockNumber: 4139446,
        contractAddress: null,
        cumulativeGasUsed: 110977,
        from: '0x0e48196f6e7c8df0006bb7e7122e1e9f5ef46d6a',
        gasUsed: 110977,
        logsBloom:
    ...
        returnValues: [Object],
        event: 'PayoutConfirmation',
        signature:
         '0x0ad736fbe1571767f34d1bfa0cebbaf3c0424d30452fdc42167509bb5060ad82',
        raw: [Object] } } } 


30. Finally, you can see a list of payouts of your product by executing the ``gif.payout.list()`` method:

::

    $ gif.payout.list()

    [ { key: 'de2c53312e72425ab913c2e760ec5efd',
        created: '2019-03-26T17:00:06.647Z',
        contractKey: null,
        productId: 21,
        id: 3,
        metadataId: 13,
        claimId: 3,
        expectedAmount: 0,
        actualAmount: 100,
        state: 1,
        stateMessage: '',
        createdAt: 1553619606,
        updatedAt: 1553619741 } ] 


You can also use the ``gif.payout.getById(ID number of a payout)`` method when you want to receive specific data related to a certain payout by its ID.

With these basic steps, you can start using the Generic Insurance Framework.

.. note :: For your convenience, we also provide the addresses of the smart contracts, deployed in the blockchain test network Rinkeby. These contracts enable the necessary functionality for the GIF CLI. In particular, you should use the ProductService contract to deploy your own product's contract.

**Network: rinkeby** (id: 4)  

**InstanceOperatorService:** 0x39F7826D3796BC4a2Eb2F0B8fF3799f30D02CBf5  

**License:** 0x9Fb57F1C2291395a0F654A03C2053309a9928d39  

**LicenseController:** 0xd5337b57c636EEF4Aa5C78625816715AE945f81A  

**Migrations:** 0xa38910BB20F790aaC9F03C498b5bb61382a0dCF7  

**OracleOwnerService:** 0xcD8438bA7580139e5df05067cd868ea31A7eb9E8  

**OracleService:** 0x5F4a25c03054f8072Bd10C6afc515E5C4a146f27  

**Policy:** 0x10154588296B531B880ca669E0807A3dA78F2Ae8  

**PolicyController:** 0x1fCda1D5efBCC82d24e0438C618DDCe7383827AB  

**PolicyFlowDefault:** 0x04EC0D88D70713ba304ad54c6f22200ea93dDd57

**ProductService:** 0x6520354fa128cc6483B9662548A597f7FcB7a687  

**Query:** 0x2936555290B17062e3472CF3a5A3DE3B84A01515

**QueryController:** 0xAd517b5da0b62DfF56ac57d612f4bEf0eA1e1b78

**Registry:** 0x5E78A5a3ffd005761B501D6264cEcD87E2d331B0

**RegistryController:** 0x4Bf8b2622a1b5B6b2865087323E6C518a3946AbA

