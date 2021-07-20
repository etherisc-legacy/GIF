pragma solidity 0.8.0;

// SPDX-License-Identifier: Apache-2.0

interface IOracleOwnerService {
    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat
    ) external;

    function proposeOracle(
        address _oracleContract
    ) external returns (uint256 _oracleId);

    function proposeOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;

    function revokeOracleFromOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;

}
