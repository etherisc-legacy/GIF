// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.0;

interface IOracleOwnerService {

    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat
    ) external;

    function proposeOracle(
        bytes32 _oracleName
    ) external returns (uint256 _oracleId);

    function proposeOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;

}
