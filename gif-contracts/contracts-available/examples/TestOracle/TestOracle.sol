pragma solidity 0.5.2;

import "../../Oracle.sol";

contract TestOracle is Oracle {
    constructor(address _oracleController) public Oracle(_oracleController) {}

    uint256 public requestId;

    function request(uint256 _requestId, bytes calldata _input) external {
        requestId = _requestId;
    }

    function publicRespond(uint256 _requestId, uint256 _response) external {
        respond(_requestId, abi.encode(_response));
    }
}
