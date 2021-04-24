pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

interface IRegistryController {

    function registerInRelease(
        bytes32 _release,
        bytes32 _contractName,
        address _contractAddress
    )
        external;

    function register(
        bytes32 _contractName,
        address _contractAddress
    )
        external;

    function deregisterInRelease(
        bytes32 _release,
        bytes32 _contractName
    )
        external;

    function deregister(
        bytes32 _contractName
    )
        external;

    function prepareRelease()
        external
        returns (uint256 _release);

    function getContractInRelease(
        bytes32 _release,
        bytes32 _contractName)
        external view
        returns (address _contractAddress);

    function getContract(
        bytes32 _contractName
    )
        external view
        returns (address _contractAddress);

    function getRelease()
        external view
        returns (bytes32 _release);
}
