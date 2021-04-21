pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "../shared/WithRegistry.sol";
import "../modules/query/IQueryController.sol";

contract OracleService is WithRegistry {
    bytes32 public constant NAME = "OracleService";

    constructor(address _registry) WithRegistry(_registry) {}

    function respond(uint256 _requestId, bytes calldata _data)
        external
        returns (uint256 _responseId)
    {
        // todo: oracle contract should be approved
        _responseId = query().respond(_requestId, msg.sender, _data);
    }

    /* Lookup */
    function query() internal view returns (IQueryController) {
        return IQueryController(registry.getContract("Query"));
    }
}
