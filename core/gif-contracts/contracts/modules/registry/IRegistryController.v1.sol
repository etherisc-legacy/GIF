pragma solidity 0.5.2;

interface IRegistryController {
    function registerInRelease(
        uint256 _release,
        bytes32 _contractName,
        address _contractAddress
    ) external;

    function register(bytes32 _contractName, address _contractAddress) external;

    function registerService(bytes32 _name, address _addr) external;

    function deregisterInRelease(uint256 _release, bytes32 _contractName)
        external;

    function deregister(bytes32 _contractName) external;

    function prepareRelease() external returns (uint256 _release);

    function getContractInRelease(uint256 _release, bytes32 _contractName)
        external
        view
        returns (address _contractAddress);

    function getContract(bytes32 _contractName)
        external
        view
        returns (address _contractAddress);

    function getService(bytes32 _contractName)
        external
        view
        returns (address _contractAddress);

    function getRelease() external view returns (uint256 _release);
}
