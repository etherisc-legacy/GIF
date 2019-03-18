.. _rst_table_of_contents:

Modules
=======
A module represents a group of smart contracts, with each module containing at least one storage and one controller contract.

A storage contract acts as a database for the core objects. A controller contract includes an implementation that helps to manage core objects in a storage contract. In its turn, a storage contract delegates methods and makes calls to a controller contract, which modifies the state of a storage contract.


Here is the list of the modules behind the Generic Insurance Framework:

- a **policy module** (manages applications, policies, claims, payouts, and metadata objects)

- a **registry module** (registers sets of the core contracts used in a policy flow lifecycle in release groups)

- a **license module** (manages products)

- a **query module** (manages queries made to oracles and delivers responses from them).

The license module
==================
The **license module** stores registration data and the data related to the registered products. The module is responsible for authorization of a particular contract address and rejects calls from unauthorized senders.

The approval or disapproval of calls is managed by the responsible methods invoked by the instance operator. A product contract can be managed by any Ethereum account, be it a single account, a multisig, or a DAO.

Product contracts are registered in a smart contract, and its registration proposal is on review for the instance operator, which can then perform certain actions related to the registration of product contracts.

All **license controller methods** are used by the instance operator, except for the register method, which can be called by product owners only.

The methods invoked by the license controller include:

- **register** is used to register a proposal by a product contract.
- **declineRegistration** is called by the instance operator to decline registration.
- **approveRegistration** is called by the instance operator to approve registration.
- **disapproveProduct** is called when the instance operator wants to decline the registration, which was previously approved by it.
- **reapproveProduct** is used to approve the registration after it was declined by the instance operator.
- **pauseProduct** is employed by the instance operator to pause a product contract.
- **unpauseProduct** is used by the instance operator to unpause a product contract.
- **isApprovedProduct** is used by the instance operator to check if a product contract is approved.
- **isPausedProduct** is used by the instance operator to check if a product contract is paused.
- **isValidCall** is used by the instance operator to check if a product contract call is valid.
- **authorize** is used by the instance operator to check if a product contract address is authorized and what policy flow it uses.
- **getProductId** is used by the instance operator to check a product contract ID.

Below, you can see how to invoke all the above-mentioned methods available through the license controller.

.. code-block:: solidity
   :linenos:

    interface ILicenseController {
         
            function register(bytes32 _name, address _addr, bytes32 _policyFlow)
                external
                returns (uint256 _registrationId);
         
            function declineRegistration(uint256 _registrationId) external;
         
            function approveRegistration(uint256 _registrationId)
                external
                returns (uint256 _productId);
         
            function disapproveProduct(uint256 _productId) external;
         
            function reapproveProduct(uint256 _productId) external;
         
            function pauseProduct(uint256 _productId) external;
         
            function unpauseProduct(uint256 _productId) external;
         
            function isApprovedProduct(address _addr)
                external
                view
                returns (bool _approved);
         
            function isPausedProduct(address _addr)
                external
                view
                returns (bool _paused);
         
            function isValidCall(address _addr) external view returns (bool _valid);
         
            function authorize(address _sender)
                external
                view
                returns (bool _authorized, address _policyFlow);
         
            function getProductId(address _addr)
                external
                view
                returns (uint256 _productId);
        }

The policy module
=================
The **policy module** is responsible for managing applications, policies, claims, payouts, and metadata objects. The policy module is managed by a policy flow contract.

The methods invoked by the policy controller are as follows:

- **createPolicyFlow** is called to create a new policy flow.

- **setPolicyFlowState** is employed to set a policy flow state.

- **createApplication** is used to create a new application.

- **setApplicationState** sets an application state.

- **getApplicationData** helps to view application data per application ID.

- **getPayoutOptions** is called to view payout options per application ID.

- **getPremium** is invoked to view a premium amount per application ID.

- **createPolicy** creates a new policy.

- **setPolicyState** automatically sets a policy state.

- **createClaim** creates a new claim.

- **setClaimState** automatically sets a claim state.

- **createPayout** creates a new payout.

- **payOut** is called to get data on a payout remainder.

- **setPayoutState** automatically sets a payout state.


The code below illustrates how to invoke the above-mentioned methods of the policy module.

.. code-block:: solidity
   :linenos:

    interface IPolicyController {
 
    function createPolicyFlow(uint256 _productId)
        external
        returns (uint256 _metadataId);
  
    function setPolicyFlowState(
        uint256 _productId,
        uint256 _metadataId,
        IPolicy.PolicyFlowState _state
    ) external;
  
    function createApplication(
        uint256 _productId,
        uint256 _metadataId,
        bytes32 _customerExternalId,
        uint256 _premium,
        bytes32 _currency,
        uint256[] calldata _payoutOptions
    ) external returns (uint256 _applicationId);
 
    function setApplicationState(
        uint256 _productId,
        uint256 _applicationId,
        IPolicy.ApplicationState _state
    ) external;
 
    function createPolicy(uint256 _productId, uint256 _metadataId)
        external
        returns (uint256 _policyId);
 
    function setPolicyState(
        uint256 _productId,
        uint256 _policyId,
        IPolicy.PolicyState _state
    ) external;
 
    function createClaim(uint256 _productId, uint256 _policyId, bytes32 _data)
        external
        returns (uint256 _claimId);
 
    function setClaimState(
        uint256 _productId,
        uint256 _claimId,
        IPolicy.ClaimState _state
    ) external;
 
    function createPayout(uint256 _productId, uint256 _claimId, uint256 _amount)
        external
        returns (uint256 _payoutId);
 
    function payOut(uint256 _productId, uint256 _payoutId, uint256 _amount)
        external
        returns (uint256 _remainder);
 
    function setPayoutState(
        uint256 _productId,
        uint256 _payoutId,
        IPolicy.PayoutState _state
    ) external;
 
    function getApplicationData(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (
        uint256 _metadataId,
        bytes32 _customerExternalId,
        uint256 _premium,
        bytes32 _currency,
        IPolicy.ApplicationState _state
    );
 
    function getPayoutOptions(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (uint256[] memory _payoutOptions);
 
    function getPremium(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (uint256 _premium);
 
    function getApplicationState(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (IPolicy.ApplicationState _state);
 
    function getPolicyState(uint256 _productId, uint256 _policyId)
        external
        view
        returns (IPolicy.PolicyState _state);
 
    function getClaimState(uint256 _productId, uint256 _claimId)
        external
        view
        returns (IPolicy.ClaimState _state);
 
    function getPayoutState(uint256 _productId, uint256 _payoutId)
        external
        view
        returns (IPolicy.PayoutState _state);
        }

The query module
================
The **query module** allows any product contract to use oracles and access risk model data or get a confirmation about a particular real-world event off-chain.

The methods invoked by the query module include:

- **proposeOracleType** is called by oracle owners or product owners to submit a data input, a callback format, and definitions for a particular oracle type.
- **activateOracleType** is used by the instance operator to activate an oracle type.
- **deactivateOracleType** is employed by the instance operator to deactivate an oracle type.
- **removeOracleType** is used by the instance operator to remove an oracle type.
- **proposeOracle** is called by oracle owners or product owners to propose a particular oracle.
- **updateOracleContract** is called by oracle owners or product owners to update an oracle contract for a particular oracle.
- **activateOracle** is used by the instance operator to activate an oracle.
- **deactivateOracle** is used by the instance operator to deactivate an oracle.
- **proposeOracleToType** is called by oracle or product owners to propose a particular oracle to a specific oracle type.
- **revokeOracleToTypeProposal** is called by oracle owners or product owners to remove a proposal before it is approved.
- **assignOracleToOracleType** is used by the instance operator to assign an oracle to an oracle type.
- **removeOracleFromOracleType** is used by the instance operator to remove an oracle from an oracle type.
- **request** is called by a product to request data from an oracle by an oracle type.
- **respond** is called by the Oracle Service after an oracle response to respond to the request of a product.

Below, you can see how the above-mentioned methods can be invoked.

.. code-block:: solidity
   :linenos:

    interface IQueryController {
    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat,
        string calldata _description
    ) external;
 
    function activateOracleType(bytes32 _oracleTypeName) external;
 
    function deactivateOracleType(bytes32 _oracleTypeName) external;
 
    function removeOracleType(bytes32 _oracleTypeName) external;
 
    function proposeOracle(
        address _sender,
        address _oracleContract,
        string calldata _description
    ) external returns (uint256 _oracleId);
 
    function updateOracleContract(
        address _sender,
        address _newOracleContract,
        uint256 _oracleId
    ) external;
 
    function activateOracle(uint256 _oracleId) external;
 
    function deactivateOracle(uint256 _oracleId) external;
 
    function removeOracle(uint256 _oracleId) external;
 
    function proposeOracleToType(
        address _sender,
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external returns (uint256 _proposalId);
 
    function revokeOracleToTypeProposal(
        address _sender,
        bytes32 _oracleTypeName,
        uint256 _proposalId
    ) external;
 
    function assignOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _proposalId
    ) external;
 
    function removeOracleFromOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;
 
    function request(
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callabackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId);
 
    function respond(
        uint256 _requestId,
        address _responder,
        bytes calldata _data
    ) external returns (uint256 _responseId);
        }

The registry module
===================
The **registry module** is responsible for registering sets of core contracts, which are used in a policy flow life cycle in release groups. The registry module is managed by the instance operator.

The functions available through this module are the following:

- **registerInRelease** is used to register new policies in a new release version.
- **register** is used to register a contract in the last release. 
- **deregisterInRelease** is used to delete a contract from a release.
- **deregister** is used to delete a contract in the last release.
- **prepareRelease** is called to create a new release, move contracts from the last release to a new one, and update a release version.
- **getInContractRelease** is used to get a contract address depending on a release version.
- **getContract** is used to get a contract address in the last release.
- **getRelease** is used to get the last release's number.
- **registerService** is used to register a new service.
- **getService** is used to view a new service.

The code below illustrates how to invoke the functions of the registry module listed above.

.. code-block:: solidity
   :linenos:

    interface IRegistryController {
    function registerInRelease(
    uint256 _release,
    bytes32 _contractName,
    address _contractAddress
    ) external;
 
    function register(
    bytes32 _contractName, 
    address _contractAddress
    ) external;
 
    function registerService(
    bytes32 _name, 
    address _addr
    ) external;
 
    function deregisterInRelease(
    uint256 _release, 
    bytes32 _contractName
    ) external;
 
    function deregister(
    bytes32 _contractName
    ) external;
 
    function prepareRelease(
    ) external returns (uint256 _release);
 
    function getContractInRelease(
    uint256 _release, 
    bytes32 _contractName
    ) external
    view
    returns (address _contractAddress);
 
    function getContract(bytes32 _contractName
    ) external
    view
    returns (address _contractAddress);
 
    function getService(bytes32 _contractName
    ) external
    view
    returns (address _contractAddress);
 
    function getRelease(
    ) external view returns (uint256 _release);
    }
