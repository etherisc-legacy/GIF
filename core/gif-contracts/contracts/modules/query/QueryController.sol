pragma solidity 0.5.2;

import "./QueryStorageModel.sol";
import "../../IOracle.sol";
import "../../shared/ModuleController.sol";

contract QueryController is QueryStorageModel, ModuleController {
    constructor(address _registry) public WithRegistry(_registry) {}

    /* OracleTypesRegistry */
    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat,
        string calldata _description,
        bytes32 _currency
    ) external onlyOracleOwner {
        require(
            !oracleTypes[_oracleTypeName].initialized,
            "ERROR::ORACLE_TYPE_INITIALIZED"
        );

        // todo: check currency existence

        oracleTypes[_oracleTypeName] = OracleType(
            _inputFormat,
            _callbackFormat,
            _description,
            _currency,
            OracleTypeState.Inactive,
            true
        );

        emit LogOracleTypeProposed(
            _oracleTypeName,
            _inputFormat,
            _callbackFormat,
            _description,
            _currency
        );
    }

    function activateOracleType(bytes32 _oracleTypeName) external onlyDAO {
        require(
            oracleTypes[_oracleTypeName].initialized,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );

        oracleTypes[_oracleTypeName].state = OracleTypeState.Active;

        emit LogOracleTypeActivated(_oracleTypeName);
    }

    function deactivateOracleType(bytes32 _oracleTypeName) external onlyDAO {
        require(
            oracleTypes[_oracleTypeName].initialized,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            assignedOracles[_oracleTypeName].length == 0,
            "ERROR::ORACLE_TYPE_HAS_ACTIVE_ORACLES"
        );

        oracleTypes[_oracleTypeName].state = OracleTypeState.Inactive;

        emit LogOracleTypeDeactivated(_oracleTypeName);
    }

    function removeOracleType(bytes32 _oracleTypeName) external onlyDAO {
        require(
            oracleTypes[_oracleTypeName].initialized,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            assignedOracles[_oracleTypeName].length == 0,
            "ERROR::ORACLE_TYPE_HAS_ACTIVE_ORACLES"
        );

        delete oracleTypes[_oracleTypeName];

        emit LogOracleTypeRemoved(_oracleTypeName);
    }

    /* OracleRegistry */
    function proposeOracle(
        address _oracleContract,
        string calldata _description,
        uint256 _responseDeadline
    ) external onlyOracleOwner returns (uint256 _oracleId) {
        // todo: check if exists
        //require(oracles[oraclesIndexes[_oracleContract]].oracleContract == address(0), "ERROR::ORACLE_EXISTS");

        _oracleId = oracles.length++;

        oracles[_oracleId] = Oracle(
            _oracleContract,
            _description,
            _responseDeadline,
            OracleState.Inactive
        );
        oraclesIndexes[_oracleContract] = _oracleId;

        emit LogOracleProposed(_oracleContract, _description, _responseDeadline);
    }

    function updateOracleContract(address _oracleContract, uint256 _oracleId)
        external
        onlyOracleOwner
    {
        address prevContract = oracles[_oracleId].oracleContract;

        require(prevContract != address(0), "ERROR::ORACLE_NOT_EXISTS");

        // todo: check if oracle builder is owner

        oracles[_oracleId].oracleContract = _oracleContract;

        emit LogOracleContractUpdated(_oracleId, prevContract, _oracleContract);
    }

    function activateOracle(uint256 _oracleId) external onlyDAO {
        // todo: validate

        oracles[_oracleId].state = OracleState.Active;

        emit LogOracleActivated(_oracleId);
    }

    function deactivateOracle(uint256 _oracleId) external onlyDAO {
        // todo: validate

        oracles[_oracleId].state = OracleState.Inactive;

        emit LogOracleDeactivated(_oracleId);
    }

    function removeOracle(uint256 _oracleId) external onlyDAO {
        // todo: validate
        // todo: remove from oracle types

        oraclesIndexes[oracles[_oracleId].oracleContract] = 0;
        delete oracles[_oracleId];

        emit LogOracleRemoved(_oracleId);
    }

    function proposeOracleToType(
        uint256 _oracleId,
        uint256 _oracleTypeId,
        uint256 _price
    ) external onlyOracleOwner {
        // todo: validate
        // todo: implement

        emit LogOracleProposedToType(_oracleId, _oracleTypeId, _price);
    }

    // only oracle builder
    function updateOraclePriceInType(
        uint256 _oracleId,
        uint256 _oracleTypeId,
        uint256 _price
    ) external onlyOracleOwner {
        // todo: implement

        emit LogOraclePriceUpdatedInType(_oracleId, _oracleTypeId, _price);
    }

    function assignOracleToOracleType(uint256 _oracleId, uint256 _oracleTypeId)
        external
        onlyDAO
    {
        // todo: implement

        emit LogOracleAssignedToOracleType(_oracleId, _oracleTypeId);
    }

    function removeOracleFromOracleType(
        uint256 _oracleId,
        uint256 _oracleTypeId
    ) external onlyDAO {
        // todo: implement

        emit LogOracleRemovedFromOracleType(_oracleId, _oracleTypeId);
    }

    /* Oracle Request */
    // only product, 1->1
    function request(
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callabackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external onlyPolicyFlow("Query") returns (uint256 _requestId) {
        // todo: validate

        _requestId = oracleRequests.length++;

        OracleRequest storage req = oracleRequests[_requestId];
        req.data = _input;
        req.callbackMethodName = _callbackMethodName;
        req.callbackContractAddress = _callabackContractAddress;
        req.oracleTypeName = _oracleTypeName;
        req.requestType = OracleRequestType.Direct;
        req.responsibleOracleId = _responsibleOracleId;
        req.createdAt = block.timestamp;

        IOracle(oracles[_responsibleOracleId].oracleContract).request(
            _requestId,
            _input
        );

        emit LogOracleRequested(_requestId, _responsibleOracleId);
    }

    /* Oracle Response */
    function respond(
        uint256 _requestId,
        address _responder,
        bytes calldata _data
    ) external onlyOracle returns (uint256 _responseId) {
        OracleRequest storage req = oracleRequests[_requestId];

        (bool status, ) = req.callbackContractAddress.call(
            abi.encodeWithSignature(
                string(
                    abi.encodePacked(req.callbackMethodName, "(uint256,bytes)")
                ),
                _requestId,
                _data
            )
        );

        _responseId = oracleResponses.length++;
        oracleResponses[_responseId] = OracleResponse(
            _requestId,
            _responder,
            block.timestamp,
            status
        );

        emit LogOracleResponded(_requestId, _responseId, _responder, status);
    }
}
