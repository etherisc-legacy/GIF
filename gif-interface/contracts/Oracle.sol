pragma solidity ^0.6.0; // TODO: change this to 0.8.0 as soon as Chainlink releases 0.8
// SPDX-License-Identifier: Apache-2.0

import "./IOracleService.sol";
import "./RBAC.sol";
import "./IOracle.sol";
import "./IOracleOwnerService.sol";

abstract contract Oracle is IOracle, RBAC {
    IOracleService public oracleService;
    IOracleOwnerService public oracleOwnerService;

    modifier onlyQuery {
        require(
            msg.sender == oracleService.getContract("Query"),
            "ERROR:ORA-001:ACCESS_DENIED"
        );
        _;
    }

    constructor(
        address _oracleService,
        address _oracleOwnerService,
        bytes32 _oracleTypeName,
        string calldata _description)
        external
    {
        oracleService = IOracleService(_oracleService);
        oracleOwnerService = IOracleOwnerService(_oracleOwnerService);
        uint256 oracleId = oracleOwnerService.proposeOracle(this, _description);
        oracleOwnerService.proposeOracleToOracleType(_oracleTypeName, oracleId);
    }

    function _respond(uint256 _requestId, bytes memory _data) internal {
        oracleService.respond(_requestId, _data);
    }
}
