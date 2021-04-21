pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IQuery.sol";

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

    function proposeOracleToOracleType(
        address _sender,
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;

    function revokeOracleFromOracleType(
        address _sender,
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;

    function assignOracleToOracleType(
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
