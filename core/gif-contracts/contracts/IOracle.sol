pragma solidity 0.5.2;

interface IOracle {
    function request(uint256 _requestId, bytes calldata _input) external;
}
