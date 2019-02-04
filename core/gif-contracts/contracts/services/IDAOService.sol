pragma solidity 0.5.2;

interface IDAOService {
    // License module tasks
    function declineRegistration(uint256 _registrationId) external;

    function approveRegistration(uint256 _registrationId)
        external
        returns (uint256 _applicationId);

    function disapproveInsuranceApplication(uint256 _applicationId) external;

    function reapproveInsuranceApplication(uint256 _applicationId) external;

    function pauseInsuranceApplication(uint256 _applicationId) external;

    function unpauseInsuranceApplication(uint256 _applicationId) external;

    function assignOracleToOracleType(bytes32 _oracleTypeName, uint256 _oracleId) external;
}
