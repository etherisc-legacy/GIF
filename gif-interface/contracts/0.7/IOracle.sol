// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.7.0;

// If this interface is changed, the respective interface in the GIF Core Contracts package needs to be changed as well.
interface IOracle {
    function request(uint256 _requestId, bytes calldata _input) external;
}
