pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IQuery.sol";

contract QueryStorageModel is IQuery {
    // Oracle types
    mapping(bytes32 => OracleType) public oracleTypes;
    mapping(bytes32 => mapping (uint256 => OracleAssignmentState)) public assignedOracles;
    bytes32[] public oracleTypeNames;
    uint256 public oracleTypeNamesIncrement = 1; // first oracleType is 1


    // Oracles
    mapping(uint256 => Oracle) public oracles;
    mapping(address => uint256) public oracleIdByAddress;
    uint256 public oracleIdIncrement = 1; // first oracleId is 1

    // Requests
    OracleRequest[] public oracleRequests;

    // Responses
    OracleResponse[] public oracleResponses;
}
