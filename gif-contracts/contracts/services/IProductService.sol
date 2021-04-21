pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

interface IProductService {
    function register(bytes32 _productName, bytes32 _policyFlow)
        external
        returns (uint256 _registrationId);

    function newApplication(
        bytes32 _bpExternalKey,
        uint256 _premium,
        bytes32 _currency,
        uint256[] calldata _payoutOptions
    ) external returns (uint256 _applicationId);

    function underwrite(uint256 applicationId)
        external
        returns (uint256 _policyId);

    function decline(uint256 _applicationId) external;

    function newClaim(uint256 _policyId) external returns (uint256 _claimId);

    function confirmClaim(uint256 _claimId, uint256 _sum)
        external
        returns (uint256 _payoutId);

    function declineClaim(uint256 _claimId) external;

    function expire(uint256 _policyId) external;

    function payout(uint256 _payoutId, uint256 _sum)
        external
        returns (uint256 _remainder);

    function getPayoutOptions(uint256 _applicationId)
        external
        returns (uint256[] memory _payoutOptions);

    function getPremium(uint256 _applicationId)
        external
        returns (uint256 _premium);

    function request(
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callabackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId);

    function getContract(bytes32 _contractName)
        external
        view
        returns (address _contractAddress);

    function getService(bytes32 _contractName)
        external
        view
        returns (address _contractAddress);
}
