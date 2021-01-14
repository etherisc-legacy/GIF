pragma solidity 0.6.11;

interface IOracle {
    function request(uint256 _requestId, bytes calldata _input) external;
}
