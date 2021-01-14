pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "./services/IOracleService.sol";
import "./shared/RBAC.sol";
import "./IOracle.sol";

abstract contract Oracle is IOracle, RBAC {
    IOracleService public oracleService;

    modifier onlyQuery {
        require(
            msg.sender == oracleService.getContract("Query"),
            "ERROR::ACCESS_DENIED"
        );
        _;
    }

    constructor(address _oracleService) internal {
        oracleService = IOracleService(_oracleService);
    }

    function _respond(uint256 _requestId, bytes memory _data) internal {
        oracleService.respond(_requestId, _data);
    }
}
