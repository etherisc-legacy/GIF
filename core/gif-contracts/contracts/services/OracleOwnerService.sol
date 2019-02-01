pragma solidity 0.5.2;

import "../modules/query/IQuery.sol";
import "../modules/query/IQueryController.sol";
import "../shared/WithRegistry.sol";

contract OracleOwnerService is WithRegistry {
    bytes32 public constant NAME = "OracleOwnerService";

    constructor(address _registry) public WithRegistry(_registry) {}

    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat,
        string calldata _description,
        bytes32 _currency
    ) external {
        // todo: oracle owner should be approved
        query().proposeOracleType(
            _oracleTypeName,
            _inputFormat,
            _callbackFormat,
            _description,
            _currency
        );
    }

    function proposeOracle(
        address _oracleContract,
        string calldata _description,
        uint256 _responseDeadline
    ) external returns (uint256 _oracleId) {
        // todo: oracle owner should be approved
        _oracleId = query().proposeOracle(
            _oracleContract,
            _description,
            _responseDeadline
        );
    }

    /* Lookup */
    function query() internal view returns (IQueryController) {
        return IQueryController(registry.getContract("Query"));
    }
}
