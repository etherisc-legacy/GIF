pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

interface IRegistry {

    event LogContractRegistered(
        bytes32 release,
        bytes32 contractName,
        address contractAddress,
        bool isNew
    );

    event LogContractDeregistered(
        bytes32 release,
        bytes32 contractName
    );

    event LogReleasePrepared(
        bytes32 release
    );

}
