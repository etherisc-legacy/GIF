pragma solidity 0.5.2;

import "./IQuery.sol";

contract QueryStorageModel is IQuery {
    // Oracle types
    mapping(bytes32 => OracleType) public oracleTypes;
    mapping(bytes32 => mapping(uint256 => bool)) public assignedOracles;
    mapping(bytes32 => uint256[]) public assignedOraclesIds;
    mapping(bytes32 => uint256[]) public proposedOracleIds;

    // Oracles
    mapping(uint256 => Oracle) public oracles;
    mapping(address => uint256) public oracleIdByAddress;
    mapping(uint256 => bytes32[]) public assignedOracleTypes;
    uint256 public oracleIdIncrement;

    // Requests
    OracleRequest[] public oracleRequests;

    // Responses
    OracleResponse[] public oracleResponses;
}
