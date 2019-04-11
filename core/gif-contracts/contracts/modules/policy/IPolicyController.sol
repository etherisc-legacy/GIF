pragma solidity 0.5.2;
pragma experimental ABIEncoderV2;

import "./IPolicy.sol";

interface IPolicyController {
    function createPolicyFlow(uint256 _productId, bytes32 _bpExternalKey)
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
