pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "../shared/WithRegistry.sol";
import "../modules/policy/IPolicy.sol";
import "../modules/policy/IPolicyController.sol";
import "../modules/license/ILicenseController.sol";
import "../modules/query/IQueryController.sol";

contract PolicyFlowDefault is WithRegistry {
    bytes32 public constant NAME = "PolicyFlowDefault";

    constructor(address _registry) WithRegistry(_registry) {}

    function newApplication(
        bytes32 _bpKey,
        bytes calldata _options // replaces premium, currency, payoutOptions
    ) public {
        IPolicyController policy = policy();
        // the calling contract is the Product contract, which needs to have a productId in the license contract.
        uint256 productId = license().getProductId(msg.sender);

        policy.createPolicyFlow(productId, _bpKey);
        policy.createApplication(_bpKey, _options);
    }

    function underwrite(bytes32 _bpKey) public {
        IPolicyController policy = policy();
        require(
            policy.getApplicationState(_bpKey) ==
                IPolicy.ApplicationState.Applied,
            "ERROR:PFD-001:INVALID_APPLICATION_STATE"
        );
        policy.setApplicationState(
            _bpKey,
            IPolicy.ApplicationState.Underwritten
        );
        policy.createPolicy(_bpKey);
    }

    function decline(bytes32 _bpKey) external {
        IPolicyController policy = policy();
        require(
            policy.getApplicationState(_bpKey) ==
                IPolicy.ApplicationState.Applied,
            "ERROR:PFD-002:INVALID_APPLICATION_STATE"
        );

        policy.setApplicationState(_bpKey, IPolicy.ApplicationState.Declined);
    }

    function newClaim(bytes32 _bpKey, bytes calldata _data)
        external
        returns (uint256 _claimId)
    {
        _claimId = policy().createClaim(_bpKey, _data);
    }

    function confirmClaim(
        bytes32 _bpKey,
        uint256 _claimId,
        bytes calldata _data
    ) external returns (uint256 _payoutId) {
        IPolicyController policy = policy();
        require(
            policy.getClaimState(_bpKey, _claimId) ==
                IPolicy.ClaimState.Applied,
            "ERROR:PFD-003:INVALID_CLAIM_STATE"
        );

        policy.setClaimState(_bpKey, _claimId, IPolicy.ClaimState.Confirmed);

        _payoutId = policy.createPayout(_bpKey, _claimId, _data);
    }

    function declineClaim(bytes32 _bpKey, uint256 _claimId) external {
        IPolicyController policy = policy();
        require(
            policy.getClaimState(_bpKey, _claimId) ==
                IPolicy.ClaimState.Applied,
            "ERROR:PFD-004:INVALID_CLAIM_STATE"
        );

        policy.setClaimState(_bpKey, _claimId, IPolicy.ClaimState.Declined);
    }

    function expire(bytes32 _bpKey) external {
        IPolicyController policy = policy();
        require(
            policy.getPolicyState(_bpKey) == IPolicy.PolicyState.Active,
            "ERROR:PFD-005:INVALID_POLICY_STATE"
        );

        policy.setPolicyState(_bpKey, IPolicy.PolicyState.Expired);
    }

    function payout(
        bytes32 _bpKey,
        uint256 _payoutId,
        bool _complete,
        bytes calldata _data
    ) external {
        policy().payOut(_bpKey, _payoutId, _complete, _data);
    }

    function register(bytes32 _productName, bytes32 _policyFlow) external {
        license().register(_productName, msg.sender, _policyFlow);
    }

    function request(
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callbackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId) {
        _requestId = query().request(
            _input,
            _callbackMethodName,
            _callbackContractAddress,
            _oracleTypeName,
            _responsibleOracleId
        );
    }

    function license() internal view returns (ILicenseController) {
        return ILicenseController(getContract("License"));
    }

    function policy() internal view returns (IPolicyController) {
        return IPolicyController(getContract("Policy"));
    }

    function query() internal view returns (IQueryController) {
        return IQueryController(getContract("Query"));
    }
}
