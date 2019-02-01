pragma solidity 0.5.2;

import "./IQuery.sol";

interface IQueryController {
    /* OracleTypesRegistry */
    // only oracle builders
    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat,
        string calldata _description,
        bytes32 _currency
    ) external;

    // only dao
    function activateOracleType(bytes32 _oracleTypeName) external;

    // only dao
    function deactivateOracleType(bytes32 _oracleTypeName) external;

    // only dao
    function removeOracleType(bytes32 _oracleTypeName) external;

    /* OracleRegistry */
    // only oracle builders
    function proposeOracle(
        address _oracleContract,
        string calldata _description,
        uint256 _responseDeadline
    ) external returns (uint256 _oracleId);

    // only oracle builder
    function updateOracle(address _oracleContract, uint256 _oracleId) external;

    // only dao
    function activateOracle(uint256 _oracleId) external;

    // only dao
    function deactivateOracle(uint256 _oracleId) external;

    // only dao
    function removeOracle(uint256 _oracleId) external;

    // only oracle builder
    function proposeOracleToType(
        uint256 _oracleId,
        uint256 _oracleTypeId,
        uint256 _price
    ) external;

    // only oracle builder
    function updateOraclePriceInType(
        uint256 _oracleId,
        uint256 _oracleTypeId,
        uint256 _price
    ) external;

    // only dao
    function assignOracleToOracleType(uint256 _oracleId, uint256 _oracleTypeId)
        external;

    // only dao
    function removeOracleFromOracleType(
        uint256 _oracleId,
        uint256 _oracleTypeId
    ) external;

    /* Oracle Request */
    // only product, 1->1
    function request(
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callabackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId);

    // only productm 1->many
    //    function request(
    //        bytes32 _oracleTypeName,
    //        bytes calldata _input,
    //        address _callabackContractAddress,
    //        string calldata _callbackMethodName
    //        // + sorting details
    //        // + pricing details
    //    ) external returns (uint256 _requestId);

    function updatePriceForRequest(uint256 _requestId) external;

    function requestNext(uint256 _requestId) external;

    /* Oracle Response */
    // only oracle builders
    function respond(
        uint256 _requestId,
        address _responder,
        bytes calldata _data
    ) external returns (uint256 _responseId);

    /* Disputes */
    // only oracle builder
    // function openRequestDispute(uint256 _requestId);

    // only product builder
    // function openResponseDispute(uint256 _responseId);

    // only dao
    // function resolveRequestDispute(uint256 _requestId);
    // function rejectRequestDispute(uint256 _requestId);

    // only dao
    // function resolveResponseDispute(uint256 _responseId);
    // function rejectResponseDispute(uint256 _responseId);

}
