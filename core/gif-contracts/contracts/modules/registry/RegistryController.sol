pragma solidity 0.5.2;

import "./RegistryStorageModel.sol";
import "../../shared/BaseModuleController.sol";
import "../../shared/AccessModifiers.sol";

contract RegistryController is RegistryStorageModel, BaseModuleController, AccessModifiers {
    constructor() public {
        // Init
        controllers["InstanceOperator"] = msg.sender;
        register("Registry", address(this));
    }

    function assignStorage(address _storage) external onlyInstanceOperator {
        _assignStorage(_storage);
    }

    function registerService(bytes32 _name, address _addr)
        external
        onlyInstanceOperator
    {
        controllers[_name] = _addr;
    }

    function getRelease() external view returns (uint256 _release) {
        _release = release;
    }

    /**
     * @dev Register contract in certain release
     */
    function registerInRelease(
        uint256 _release,
        bytes32 _contractName,
        address _contractAddress
    ) public onlyInstanceOperator {
        require(
            contractNames[_release].length <= maxContracts,
            "ERROR::MAX_CONTRACTS_LIMIT"
        );

        if (contracts[_release][_contractName] == address(0)) {
            contractNames[_release].push(_contractName);
        }

        contracts[_release][_contractName] = _contractAddress;

        emit LogContractRegistered(_release, _contractName, _contractAddress);
    }

    /**
     * @dev Register contract in the latest release
     */
    function register(bytes32 _contractName, address _contractAddress)
        public
        onlyInstanceOperator
    {
        registerInRelease(release, _contractName, _contractAddress);
    }

    /**
     * @dev Deregister contract in certain release
     */
    function deregisterInRelease(uint256 _release, bytes32 _contractName)
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

        contractNames[_release].length--;
        delete contracts[_release][_contractName];

        emit LogContractDeregistered(_release, _contractName);
    }

    /**
     * @dev Deregister contract in the latest release
     */
    function deregister(bytes32 _contractName) public onlyInstanceOperator {
        deregisterInRelease(release, _contractName);
    }

    /**
     * @dev Create new release, copy contracts from previous release
     */
    function prepareRelease()
        public
        onlyInstanceOperator
        returns (uint256 _release)
    {
        uint256 countContracts = contractNames[release].length;

        require(countContracts > 0, "ERROR::EMPTY_RELEASE");

        uint256 nextRelease = release + 1;

        // todo: think about how to avoid this loop
        for (uint256 i = 0; i < countContracts; i++) {
            bytes32 contractName = contractNames[release][i];
            registerInRelease(
                nextRelease,
                contractName,
                contracts[release][contractName]
            );
        }

        release = nextRelease;
        _release = release;

        emit LogReleasePrepared(release);
    }

    /**
     * @dev Get contract's address in certain release
     */
    function getContractInRelease(uint256 _release, bytes32 _contractName)
        public
        view
        returns (address _addr)
    {
        _addr = contracts[_release][_contractName];
    }

    /**
     * @dev Get contract's address in the latest release
     */
    function getContract(bytes32 _contractName)
        public
        view
        returns (address _addr)
    {
        _addr = getContractInRelease(release, _contractName);
    }

    function getService(bytes32 _contractName)
        public
        view
        returns (address _addr)
    {
        _addr = controllers[_contractName];
    }
}
