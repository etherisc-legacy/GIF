pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IQuery.sol";

interface IQueryController {
    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat
    ) external;

    function approveOracleType(bytes32 _oracleTypeName) external;

    function disapproveOracleType(bytes32 _oracleTypeName) external;

    function removeOracleType(bytes32 _oracleTypeName) external;

    function proposeOracle(
        bytes32 _name,
        address _oracleContract
    ) external returns (uint256 _oracleId);

    function updateOracleContract(
        address _newOracleContract,
        uint256 _oracleId
    ) external;

    function approveOracle(uint256 _oracleId) external;

    function disapproveOracle(uint256 _oracleId) external;

    function proposeOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;

    function revokeOracleFromOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;

    function assignOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;

    function request(
        bytes32 _bpKey,
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callbackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId);

    function respond(
        uint256 _requestId,
        address _responder,
        bytes calldata _data
    ) external returns (uint256 _responseId);
}
