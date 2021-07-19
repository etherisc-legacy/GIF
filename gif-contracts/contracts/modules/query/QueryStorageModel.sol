pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IQuery.sol";

contract QueryStorageModel is IQuery {
    // Oracle types
    // OracleTypeName => OracleType
    mapping(bytes32 => OracleType) public oracleTypes;
    // OracleTypeName => OracleId => OracleAssignmentState
    mapping(bytes32 => mapping(uint256 => OracleAssignmentState))
        public assignedOracles;
    // OracleTypeName Index => OracleTypeName
    mapping(uint256 => bytes32) public oracleTypeNames;
    uint256 public oracleTypeNamesCount;

    // Oracles
    mapping(uint256 => Oracle) public oracles;
    mapping(address => uint256) public oracleIdByAddress;
    uint256 public oracleCount;

    // Requests
    OracleRequest[] public oracleRequests;

    // Responses
    OracleResponse[] public oracleResponses;
}
