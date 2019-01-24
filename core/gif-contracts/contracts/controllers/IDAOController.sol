pragma solidity 0.5.2;


interface IDAOController {

    function approveRegistration(uint256 _registrationId) external returns (uint256 _applicationId);

    function declineRegistration(uint256 _registrationId) external;

    function disapproveInsuranceApplication(uint256 _applicationId) external;

    function reapproveInsuranceApplication(uint256 _applicationId) external;

    function pauseInsuranceApplication(uint256 _applicationId) external;

    function unpauseInsuranceApplication(uint256 _applicationId) external;

    function registerInRelease(uint256 _release, bytes32 _contractName, address _contractAddress) external;

    function register(bytes32 _contractName, address _contractAddress) external;

    function deregisterInRelease(uint256 _release, bytes32 _contractName) external;

    function deregister(bytes32 _contractName) external;

    function prepareRelease() external returns (uint256 _release);
}
