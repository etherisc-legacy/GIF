pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IRegistryController.sol";
import "./RegistryStorageModel.sol";
import "../../shared/BaseModuleController.sol";
import "../../shared/AccessModifiers.sol";

contract RegistryController is
    IRegistryController,
    RegistryStorageModel,
    BaseModuleController,
    AccessModifiers
{
    bytes32 public constant NAME = "RegistryController";

    constructor(bytes32 _initialRelease) {
        // Init
        release = _initialRelease;
        contracts[release]["InstanceOperatorService"] = msg.sender;
    }

    function assignStorage(address _storage) external onlyInstanceOperator {
        _assignStorage(_storage);
    }

    /**
     * @dev Register contract in certain release
     */
    function _registerInRelease(
        bytes32 _release,
        bytes32 _contractName,
        address _contractAddress
    )  internal onlyInstanceOperator {
        bool isNew = false;

        require(
            contractNames[_release].length <= maxContracts,
            "ERROR:REC-001:MAX_CONTRACTS_LIMIT"
        );

        if (contracts[_release][_contractName] == address(0)) {
            contractNames[_release].push(_contractName);
            contractsInRelease[_release] += 1;
            isNew = true;
        }

        contracts[_release][_contractName] = _contractAddress;
        require(
            contractsInRelease[_release] == contractNames[_release].length,
            "ERROR:REC-002:CONTRACT_NUMBER_MISMATCH"
        );

        emit LogContractRegistered(
            _release,
            _contractName,
            _contractAddress,
            isNew
        );
    }

    /**
     * @dev Register contract in certain release
     */
    function registerInRelease(
        bytes32 _release,
        bytes32 _contractName,
        address _contractAddress
    )  external override onlyInstanceOperator {
        _registerInRelease(
            _release,
            _contractName,
            _contractAddress
        );
    }

    /**
     * @dev Register contract in the current release
     */
    function register(bytes32 _contractName, address _contractAddress)
        external override
        onlyInstanceOperator
    {
        _registerInRelease(release, _contractName, _contractAddress);
    }

    /**
     * @dev Deregister contract in certain release
     */
    function _deregisterInRelease(bytes32 _release, bytes32 _contractName)
        internal
        onlyInstanceOperator
    {
        uint256 indexToDelete;
        uint256 countContracts = contractNames[_release].length;

        // todo: think about how to avoid this loop
        for (uint256 i = 0; i < countContracts; i += 1) {
            if (contractNames[_release][i] == _contractName) {
                indexToDelete = i;
                break;
            }
        }

        if (indexToDelete < countContracts - 1) {
            contractNames[_release][indexToDelete] = contractNames[_release][
                countContracts - 1
            ];
        }

        contractNames[_release].pop();
        contractsInRelease[_release] -= 1;
        require(
            contractsInRelease[_release] == contractNames[_release].length,
            "ERROR:REC-003:CONTRACT_NUMBER_MISMATCH"
        );

        emit LogContractDeregistered(_release, _contractName);
    }

    function deregisterInRelease(bytes32 _release, bytes32 _contractName)
        external override
        onlyInstanceOperator
    {
        _deregisterInRelease(_release, _contractName);
    }

    /**
     * @dev Deregister contract in the current release
     */
    function deregister(bytes32 _contractName) external override onlyInstanceOperator {
        _deregisterInRelease(release, _contractName);
    }

    /**
     * @dev Create new release, copy contracts from previous release
     */
    function prepareRelease(bytes32 _newRelease) external override onlyInstanceOperator {
        uint256 countContracts = contractsInRelease[release];

        require(countContracts > 0, "ERROR:REC-001:EMPTY_RELEASE");
        require(
            contractsInRelease[_newRelease] == 0,
            "ERROR:REC-004:NEW_RELEASE_NOT_EMPTY"
        );

        // todo: think about how to avoid this loop
        for (uint256 i = 0; i < countContracts; i += 1) {
            bytes32 contractName = contractNames[release][i];
            _registerInRelease(
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
    function getRelease() external override view returns (bytes32 _release) {
        _release = release;
    }

    /**
     * @dev Get contract's address in certain release
     */
    function _getContractInRelease(bytes32 _release, bytes32 _contractName)
        internal
        view
        returns (address _addr)
    {
        _addr = contracts[_release][_contractName];
    }

    /**
     * @dev Get contract's address in certain release
     */
    function getContractInRelease(bytes32 _release, bytes32 _contractName)
        external override
        view
        returns (address _addr)
    {
        _addr = _getContractInRelease(_release, _contractName);
    }

    /**
     * @dev Get contract's address in the current release
     */
    function getContract(bytes32 _contractName)
        public override
        view
        returns (address _addr)
    {
        _addr = _getContractInRelease(release, _contractName);
    }

    function getContractFromRegistry(bytes32 _contractName)
        public override
        view
        returns (address _addr)
    {
        _addr = _getContractInRelease(release, _contractName);
    }
}
