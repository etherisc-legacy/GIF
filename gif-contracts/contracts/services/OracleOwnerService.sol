pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "../modules/query/IQuery.sol";
import "../modules/query/IQueryController.sol";
import "../shared/WithRegistry.sol";

contract OracleOwnerService is WithRegistry {
    bytes32 public constant NAME = "OracleOwnerService";

    constructor(address _registry) WithRegistry(_registry) {}

    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat,
        string calldata _description
    ) external {
        // todo: oracle owner should be approved
        query().proposeOracleType(
            _oracleTypeName,
            _inputFormat,
            _callbackFormat,
            _description
        );
    }

    function proposeOracle(
        address _oracleContract,
        string calldata _description
    ) external returns (uint256 _oracleId) {
        // todo: oracle owner should be approved
        _oracleId = query().proposeOracle(
            msg.sender,
            _oracleContract,
            _description
        );
    }

    function proposeOracleToOracleType(bytes32 _oracleTypeName, uint256 _oracleId)
        external
    {
        // todo: oracle owner should be approved
        query().proposeOracleToOracleType(
            msg.sender,
            _oracleTypeName,
            _oracleId
        );
    }

    /* Lookup */
    function query() internal view returns (IQueryController) {
        return IQueryController(registry.getContract("Query"));
    }
}
