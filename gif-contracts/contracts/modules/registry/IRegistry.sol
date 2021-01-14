pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

interface IRegistry {
    event LogContractRegistered(
        uint256 release,
        bytes32 contractName,
        address contractAddress
    );

    event LogContractDeregistered(uint256 release, bytes32 contractName);

    event LogInterfaceIdRegistered(bytes4 interfaceId, bytes32 contractName);

    event LogReleasePrepared(uint256 release);
}
