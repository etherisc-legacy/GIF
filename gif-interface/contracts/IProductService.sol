pragma solidity ^0.6.0;

// SPDX-License-Identifier: Apache-2.0

interface IProductService {
    function register(bytes32 _productName, bytes32 _policyFlow) external returns (uint256 _productId);
    function newApplication(bytes32 _bpKey, bytes calldata _data) external;
    function underwrite(bytes32 _bpKey) external;
    function decline(bytes32 _bpKey) external;
    function newClaim(bytes32 _bpKey, bytes calldata _data) external returns (uint256 _claimId);
    function confirmClaim(bytes32 _bpKey, uint256 _claimId, bytes calldata _data) external returns (uint256 _payoutId);
    function declineClaim(bytes32 _bpKey, uint256 _claimId) external;
    function expire(bytes32 _bpKey) external;
    function payout(bytes32 _bpKey, uint256 _payoutId, bool _complete, bytes calldata _data) external;

    function request(
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callbackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId);
    function getContract(bytes32 _contractName) external view returns (address _contractAddress);
    function getService(bytes32 _contractName) external view returns (address _contractAddress);
}
