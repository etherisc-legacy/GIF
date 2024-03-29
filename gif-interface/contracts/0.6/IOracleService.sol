// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.0;

interface IOracleService {
    function respond(uint256 _requestId, bytes calldata _data) external;

    function getContractFromRegistry(bytes32 _contractName)
        external
        view
        returns (address _contractAddress);
}
