pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./RegistryStorageModel.sol";
import "../../shared/BaseModuleController.sol";
import "../../shared/AccessModifiers.sol";

contract RegistryController is RegistryStorageModel, BaseModuleController, AccessModifiers {
    constructor(bytes32 _initialRelease) {
        // Init
        release = _initialRelease;
        contracts[release]["InstanceOperatorService"] = msg.sender;
    }

    function assignStorage(
        address _storage
    )
        external
        onlyInstanceOperator
    {
        _assignStorage(_storage);
    }

    /**
     * @dev Register contract in certain release
     */
    function registerInRelease(
        bytes32 _release,
        bytes32 _contractName,
        address _contractAddress
    )
        public
        onlyInstanceOperator
    {

        bool isNew = false;

        require(
            contractNames[_release].length <= maxContracts,
            "ERROR::MAX_CONTRACTS_LIMIT"
        );

        if (contracts[_release][_contractName] == address(0)) {
            contractNames[_release].push(_contractName);
            contractsInRelease[_release] += 1;
            isNew = true;
        }

        contracts[_release][_contractName] = _contractAddress;
        require(contractsInRelease[_release] == contractNames[_release].length, 'ERROR::CONTRACT_NUMBER_MISMATCH');

        emit LogContractRegistered(_release, _contractName, _contractAddress, isNew);
    }

    /**
     * @dev Register contract in the current release
     */
    function register(
        bytes32 _contractName,
        address _contractAddress
    )
        public
        onlyInstanceOperator
    {
        registerInRelease(release, _contractName, _contractAddress);
    }

    /**
     * @dev Deregister contract in certain release
     */
    function deregisterInRelease(
        bytes32 _release,
        bytes32 _contractName
    )
        public
        onlyInstanceOperator
    {
        uint256 indexToDelete;
        uint256 countContracts = contractNames[_release].length;

        // todo: think about how to avoid this loop
        for (uint256 i = 0; i < countContracts; i++) {
            if (contractNames[_release][i] == _contractName) {
                indexToDelete = i;
                break;
            }
        }

        if (indexToDelete < countContracts - 1) {
            contractNames[_release][indexToDelete] = contractNames[_release][countContracts - 1];
        }

        contractNames[_release].pop();
        contractsInRelease[_release] -= 1;
        require(contractsInRelease[_release] == contractNames[_release].length, 'ERROR::CONTRACT_NUMBER_MISMATCH');

        emit LogContractDeregistered(_release, _contractName);
    }

    /**
     * @dev Deregister contract in the current release
     */
    function deregister(
        bytes32 _contractName
    )
        public
        onlyInstanceOperator
    {
        deregisterInRelease(release, _contractName);
    }

    /**
     * @dev Create new release, copy contracts from previous release
     */
    function prepareRelease(
        bytes32 _newRelease
    )
        public
        onlyInstanceOperator
    {
        uint256 countContracts = contractsInRelease[release];

        require(countContracts > 0, "ERROR::EMPTY_RELEASE");
        require(contractsInRelease[_newRelease] == 0, 'ERROR::NEW_RELEASE_NOT_EMPTY');

        // todo: think about how to avoid this loop
        for (uint256 i = 0; i < countContracts; i++) {
            bytes32 contractName = contractNames[release][i];
            registerInRelease(
                _newRelease,
                contractName,
                contracts[release][contractName]
            );
        }

        release = _newRelease;

        emit LogReleasePrepared(release);
    }

    /**
     * @dev get current release
     */
    function getRelease()
        external view
        returns (bytes32 _release)
    {
        _release = release;
    }

    /**
     * @dev Get contract's address in certain release
     */
    function getContractInRelease(
        bytes32 _release,
        bytes32 _contractName
    )
        public view
        returns (address _addr)
    {
        _addr = contracts[_release][_contractName];
    }

    /**
     * @dev Get contract's address in the current release
     */
    function getContract(
        bytes32 _contractName
    )
        public view override
        returns (address _addr)
    {
        _addr = getContractInRelease(release, _contractName);
    }

}
