pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "../shared/WithRegistry.sol";
import "../modules/policy/IPolicy.sol";
import "../modules/policy/IPolicyController.sol";
import "../modules/license/ILicenseController.sol";
import "../modules/query/IQueryController.sol";

/*
 * PolicyFlowDefault is a delegate of ProductService.sol.
 * Access Control is maintained:
 * 1) by checking condition in ProductService.sol
 * 2) by modifiers "onlyPolicyFlow" in StakeController.sol
 * For all functions here, msg.sender is = address of ProductService.sol which is registered in the Registry.
 * (if not, it reverts in StakeController.sol)
 */

contract PolicyFlowDefault is WithRegistry {
    bytes32 public constant NAME = "PolicyFlowDefault";

    // solhint-disable-next-line no-empty-blocks
    constructor(address _registry) WithRegistry(_registry) {}

    function newApplication(
        bytes32 _bpKey,
        bytes calldata _data // replaces premium, currency, payoutOptions
    ) external {
        IPolicyController policy = getPolicyContract();
        // the calling contract is the Product contract, which needs to have a productId in the license contract.
        uint256 productId = getLicenseContract().getProductId(msg.sender);

        policy.createPolicyFlow(productId, _bpKey);
        policy.createApplication(_bpKey, _data);
    }

    function underwrite(bytes32 _bpKey) external {
        IPolicyController policy = getPolicyContract();
        require(
            policy.getApplication(_bpKey).state ==
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
        IPolicyController policy = getPolicyContract();
        require(
            policy.getApplication(_bpKey).state ==
                IPolicy.ApplicationState.Applied,
            "ERROR:PFD-002:INVALID_APPLICATION_STATE"
        );

        policy.setApplicationState(_bpKey, IPolicy.ApplicationState.Declined);
    }

    function newClaim(bytes32 _bpKey, bytes calldata _data)
        external
        returns (uint256 _claimId)
    {
        _claimId = getPolicyContract().createClaim(_bpKey, _data);
    }

    function confirmClaim(
        bytes32 _bpKey,
        uint256 _claimId,
        bytes calldata _data
    ) external returns (uint256 _payoutId) {
        IPolicyController policy = getPolicyContract();
        require(
            policy.getClaim(_bpKey, _claimId).state ==
            IPolicy.ClaimState.Applied,
            "ERROR:PFD-003:INVALID_CLAIM_STATE"
        );

        policy.setClaimState(_bpKey, _claimId, IPolicy.ClaimState.Confirmed);

        _payoutId = policy.createPayout(_bpKey, _claimId, _data);
    }

    function declineClaim(bytes32 _bpKey, uint256 _claimId) external {
        IPolicyController policy = getPolicyContract();
        require(
            policy.getClaim(_bpKey, _claimId).state ==
            IPolicy.ClaimState.Applied,
            "ERROR:PFD-004:INVALID_CLAIM_STATE"
        );

        policy.setClaimState(_bpKey, _claimId, IPolicy.ClaimState.Declined);
    }

    function expire(bytes32 _bpKey) external {
        IPolicyController policy = getPolicyContract();
        require(
            policy.getPolicy(_bpKey).state == IPolicy.PolicyState.Active,
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
        getPolicyContract().payOut(_bpKey, _payoutId, _complete, _data);
    }

    function proposeProduct(bytes32 _productName, bytes32 _policyFlow)
    external
    returns (uint256 _productId)
    {
        _productId = getLicenseContract().proposeProduct(
            _productName,
            msg.sender,
            _policyFlow
        );
    }

    function request(
        bytes32 _bpKey,
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callbackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId) {
        _requestId = getQueryContract().request(
            _bpKey,
            _input,
            _callbackMethodName,
            _callbackContractAddress,
            _oracleTypeName,
            _responsibleOracleId
        );
    }

    function getApplicationData(bytes32 _bpKey)
        external
        view
        returns (bytes memory _data)
    {
        IPolicyController policy = getPolicyContract();
        return policy.getApplication(_bpKey).data;
    }

    function getClaimData(bytes32 _bpKey, uint256 _claimId)
        external
        view
        returns (bytes memory _data)
    {
        IPolicyController policy = getPolicyContract();
        return policy.getClaim(_bpKey, _claimId).data;
    }

    function getPayoutData(bytes32 _bpKey, uint256 _payoutId)
        external
        view
        returns (bytes memory _data)
    {
        IPolicyController policy = getPolicyContract();
        return policy.getPayout(_bpKey, _payoutId).data;
    }

    function getLicenseContract() internal view returns (ILicenseController) {
        return ILicenseController(getContractFromRegistry("License"));
    }

    function getPolicyContract() internal view returns (IPolicyController) {
        return IPolicyController(getContractFromRegistry("Policy"));
    }

    function getQueryContract() internal view returns (IQueryController) {
        return IQueryController(getContractFromRegistry("Query"));
    }
}
