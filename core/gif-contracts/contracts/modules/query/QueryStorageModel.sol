pragma solidity 0.5.2;

import "./IQuery.sol";

contract QueryStorageModel is IQuery {
    // Proposals

    // Oracle types
    mapping(bytes32 => OracleType) public oracleTypes;
    mapping(bytes32 => OracleTypeMetadata) public oracleTypesMetadata;
    mapping(bytes32 => uint256[]) public assignedOracles;

    // Oracles
    Oracle[] public oracles;
    mapping(uint256 => uint256[]) public assignedOracleTypes;
    mapping(address => uint256) public oraclesIndexes;

    // Requests
    OracleRequest[] public oracleRequests;

    // Respones
    OracleResponse[] public oracleResponses;


    /////////////////////////////////////////

//
//    mapping(address => Oracle) public oracles;
//    mapping(uint256 => address) public oracleIds;
//    mapping(uint256 => uint256[]) public assignedOracleTypes;
//    uint256 oracleIdCounter;
}
