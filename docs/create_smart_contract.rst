.. _rst_table_of_contents:

Create a smart contract
=======================

Create a new file "EStoreInsurance.sol" in the contracts directory with the following content:

::

    pragma solidity 0.5.2;
    import "<PATH_TO_GIF>/core/gif-contracts/contracts/Product.sol";
    contract EStoreInsurance is Product {
      bytes32 public constant NAME = "EStoreInsurance";
      bytes32 public constant POLICY_FLOW = "PolicyFlowDefault";
      constructor(address _productService)
      public
    Product(_productService, NAME, POLICY_FLOW) {}
    }

File: ./contracts/EStoreInsurance.sol


First of all, we imported the Product contract from the GIF package and inherited from it. From now, if we deploy this contract, our product will become a client for GIF contracts through the ProductService contract (we pass its address as a constructor argument). Look at these magic constants: NAME and POLICY_FLOW. NAME is a name for your product. The only restriction here is that it should fit the 32-bytes length. The POLICY_FLOW constant should be defined to choose the core contract, which will represent the policy lifecycle for this product. Right now, we have only this contract — "PolicyFlowDefault". And we have plans to create different versions of it for different policy lifecycles.

In the constructor, we call the Product’s constructor and pass the address of ProductService to it (this address is published in GIF repository on `Github <https://github.com/etherisc/GIF#gif-core-contracts-on-rinkeby>`_ ). The Product’s constructor will call the "register" function and your product contract will be proposed as a product (It should be approved by the administrator before this product starts to accept new applications. But don’t worry, in the sandbox, the product will be approved automatically).

Then let’s define risk. So far, as each product has its own set of fields we keep such data on the product contract side. In this particular case, risk contains brand, model, and year fields.

::

    ...

    bytes32 public constant POLICY_FLOW = "PolicyFlowDefault";
    struct Risk {
      bytes32 brand;
      bytes32 model;
      uint256 year;
    }
    mapping(bytes32 => Risk) public risks;
    constructor(address _productService)

    ...

File: ./contracts/EStoreInsurance.sol


Add a public function to calculate a premium based on a certain price. This function could be used to provide quotas to applicants.

::

    ...

    constructor(address _productService) public Product(_productService, NAME, POLICY_FLOW) {}
    function getQuote(uint256 _price) public pure returns (uint256 _premium) {
      require(_price > 0, "ERROR::INVALID PRICE");
      _premium = _price.div(10);

    }

File: ./contracts/EStoreInsurance.sol


Now we can define a function that will be used to apply for a policy.

::

      ...

      _premium = _price.div(10);
    }
    function applyForPolicy(
      bytes32 _brand,
      bytes32 _model,
      uint256 _year,
      uint256 _price,
      uint256 _premium,
      bytes32 _currency,
      bytes32 _bpExternalKey
    )external onlySandbox {
      require(_premium > 0, "ERROR:INVALID_PREMIUM");
      require(getQuote(_price) == _premium, "ERROR::INVALID_PREMIUM");
      bytes32 riskId = keccak256(abi.encodePacked(_brand, _model, _year));
      risks[riskId] = Risk(_brand, _model, _year);
      uint256[] memory payoutOptions = new uint256[](1);
      payoutOptions[0] = _price;
      uint256 applicationId = _newApplication(_bpExternalKey, _premium, _currency, payoutOptions);
      emit LogRequestUnderwriter(applicationId);
    }

File: ./contracts/EStoreInsurance.sol


We use the modifier "onlySandbox" here. It restricts permissions for this method to the sandbox account. As you will see later, as a product builder you can utilize the sandbox microservice to send transactions to your contract. The applyForPolicy method also contains the _newApplication invocation. It will create a new application in GIF core contracts.

Create other required functions in the same manner.

::

     ...

    emit LogRequestUnderwriter(applicationId);
    }
    function underwriteApplication(uint256 _applicationId) external onlySandbox {
      uint256 policyId = _underwrite(_applicationId);
      emit LogApplicationUnderwritten(_applicationId, policyId);
    }
    function declineApplication(uint256 _applicationId) external onlySandbox {
      _decline(_applicationId);
      emit LogApplicationDeclined(_applicationId);
    }
    function createClaim(uint256 _policyId) external onlySandbox {
      uint256 claimId = _newClaim(_policyId);
      emit LogRequestClaimsManager(_policyId, claimId);
    }
    function confirmClaim(uint256 _applicationId, uint256 _claimId) external onlySandbox {
      uint256[] memory payoutOptions = _getPayoutOptions(_applicationId);
      uint256 payoutId = _confirmClaim(_claimId, payoutOptions[0]);
      emit LogRequestPayout(payoutId);
    }
    function confirmPayout(uint256 _claimId, uint256 _amount) external onlySandbox {
      _payout(_claimId, _amount);
      emit LogPayout(_claimId, _amount);
    }

File: ./contracts/EStoreInsurance.sol


Don’t forget to define events for your product.

::

    contract EStoreInsurance is Product {
      event LogRequestUnderwriter(uint256 applicationId);
      event LogApplicationUnderwritten(uint256 applicationId, uint256 policyId);
      event LogApplicationDeclined(uint256 applicationId);
      event LogRequestClaimsManager(uint256 policyId, uint256 claimId);
      event LogClaimDeclined(uint256 claimId);
      event LogRequestPayout(uint256 payoutId);
      event LogPayout(uint256 claimId, uint256 amount);
      bytes32 public constant NAME = "EStoreInsurance";
    ...

File: ./contracts/EStoreInsurance.sol


Now is the time to deploy this contract. In the migrations folder, create the "2_deploy_EStoreInsurance.js" file with the content:

::

    const EStoreInsurance = artifacts.require("EStoreInsurance");
    const GIF_PRODUCT_SERVICE_CONTRACT ="<!-- Insert address of productService contract -->";
    module.exports = deployer => deployer.deploy(EStoreInsurance, GIF_PRODUCT_SERVICE_CONTRACT);

File: ./migrations/2_deploy_EStoreInsurance.js


Look how we use the address of the ProductService contract to define GIF core contract. This address is published in GIF repository on `Github <https://github.com/etherisc/GIF#gif-core-contracts-on-rinkeby>`_ . The product will interact with it.

::

    npm run compile

If everything is fine, the contract will be compiled without issues.

::

    npm run migrate

The contract will be deployed on the local blockchain.
