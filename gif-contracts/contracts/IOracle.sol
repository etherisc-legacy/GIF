pragma solidity >0.6.0; // TODO: Change this to 0.8.0 as soon as Chainlink releases 0.8
// SPDX-License-Identifier: Apache-2.0

interface IOracle {
    function request(uint256 _requestId, bytes calldata _input) external;
}
