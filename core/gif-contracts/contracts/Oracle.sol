pragma solidity 0.5.2;

import "./services/IOracleService.sol";
import "./shared/RBAC.sol";
import "./IOracle.sol";

contract Oracle is IOracle, RBAC {
    IOracleService public oracleService;

    constructor(address _oracleService) internal {
        oracleService = IOracleService(_oracleService);
    }

    function _respond(uint256 _requestId, bytes memory _data) internal {
        oracleService.respond(_requestId, _data);
    }
}
