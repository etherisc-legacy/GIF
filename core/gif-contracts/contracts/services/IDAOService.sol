pragma solidity 0.5.2;

interface IDAOService {
    // License module tasks
    function approveProduct(uint256 _productId) external;

    function disapproveProduct(uint256 _productId) external;

    function pauseProduct(uint256 _productId) external;

    function unpauseProduct(uint256 _productId) external;

    // Query module tasks
    function assignOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;
}
