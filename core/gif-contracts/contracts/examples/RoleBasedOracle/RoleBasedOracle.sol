pragma solidity 0.5.2;

import "../../Oracle.sol";

contract RoleBasedOracle is Oracle {
    constructor(address _oracleController) public Oracle(_oracleController) {}

    function request() external {}

    function underwrite() external {}
}
