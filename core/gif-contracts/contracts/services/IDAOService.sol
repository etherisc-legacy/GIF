pragma solidity 0.5.2;

interface IDAOService {
    // License module tasks
    function declineRegistration(uint256 _registrationId) external;

    function approveRegistration(uint256 _registrationId)
        external
        returns (uint256 _applicationId);

    function disapproveProduct(uint256 _productId) external;

    function reapproveProduct(uint256 _productId) external;

    function pauseProduct(uint256 _productId) external;

    function unpauseProduct(uint256 _productId) external;

    function assignOracleToOracleType(bytes32 _oracleTypeName, uint256 _oracleId) external;
}
