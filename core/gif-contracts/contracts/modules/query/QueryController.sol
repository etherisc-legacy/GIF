pragma solidity 0.5.2;

import "./QueryStorageModel.sol";
import "../../IOracle.sol";
import "../../shared/ModuleController.sol";

contract QueryController is QueryStorageModel, ModuleController {
    constructor(address _registry) public WithRegistry(_registry) {}

    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat,
        string calldata _description
    ) external onlyOracleOwner {
        require(
            oracleTypes[_oracleTypeName].initialized == false,
            "ERROR::ORACLE_TYPE_ALREADY_INITIALIZED"
        );

        oracleTypes[_oracleTypeName] = OracleType(
            _inputFormat,
            _callbackFormat,
            _description,
            OracleTypeState.Inactive,
            true
        );

        emit LogOracleTypeProposed(
            _oracleTypeName,
            _inputFormat,
            _callbackFormat,
            _description
        );
    }

    function activateOracleType(bytes32 _oracleTypeName)
        external
        onlyInstanceOperator
    {
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            oracleTypes[_oracleTypeName].state != OracleTypeState.Active,
            "ERROR::ORACLE_TYPE_ACTIVE"
        );

        oracleTypes[_oracleTypeName].state = OracleTypeState.Active;

        emit LogOracleTypeActivated(_oracleTypeName);
    }

    function deactivateOracleType(bytes32 _oracleTypeName)
        external
        onlyInstanceOperator
    {
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            oracleTypes[_oracleTypeName].state == OracleTypeState.Active,
            "ERROR::ORACLE_TYPE_NOT_ACTIVE"
        );
        require(
            assignedOraclesIds[_oracleTypeName].length == 0,
            "ERROR::ORACLE_TYPE_HAS_ACTIVE_ORACLES"
        );

        oracleTypes[_oracleTypeName].state = OracleTypeState.Inactive;

        emit LogOracleTypeDeactivated(_oracleTypeName);
    }

    function removeOracleType(bytes32 _oracleTypeName)
        external
        onlyInstanceOperator
    {
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            oracleTypes[_oracleTypeName].state == OracleTypeState.Active,
            "ERROR::ORACLE_TYPE_NOT_ACTIVE"
        );
        require(
            assignedOraclesIds[_oracleTypeName].length == 0,
            "ERROR::ORACLE_TYPE_HAS_ACTIVE_ORACLES"
        );

        delete oracleTypes[_oracleTypeName];

        emit LogOracleTypeDeactivated(_oracleTypeName);
    }

    function proposeOracle(
        address _sender,
        address _oracleContract,
        string calldata _description
    ) external onlyOracleOwner returns (uint256 _oracleId) {
        require(
            oracleIdByAddress[_oracleContract] == 0,
            "ERROR::ORACLE_EXISTS"
        );

        _oracleId = oracleIdIncrement++;

        oracles[_oracleId] = Oracle(
            _sender,
            _oracleContract,
            _description,
            OracleState.Inactive
        );
        oracleIdByAddress[_oracleContract] = _oracleId;

        emit LogOracleProposed(_oracleContract, _description);
    }

    function updateOracleContract(
        address _sender,
        address _newOracleContract,
        uint256 _oracleId
    ) external onlyOracleOwner {
        require(
            oracleIdByAddress[_newOracleContract] == 0,
            "ERROR::ORACLE_EXISTS"
        );
        require(
            oracles[_oracleId].oracleOwner == _sender,
            "ERROR::NOT_ORACLE_OWNER"
        );

        address prevContract = oracles[_oracleId].oracleContract;

        oracleIdByAddress[oracles[_oracleId].oracleContract] = 0;
        oracles[_oracleId].oracleContract = _newOracleContract;
        oracleIdByAddress[_newOracleContract] = _oracleId;

        emit LogOracleContractUpdated(
            _oracleId,
            prevContract,
            _newOracleContract
        );
    }

    function activateOracle(uint256 _oracleId) external onlyInstanceOperator {
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR::ORACLE_NOT_EXISTS"
        );
        require(
            oracles[_oracleId].state != OracleState.Active,
            "ERROR::ORACLE_IS_ACTIVE"
        );

        oracles[_oracleId].state = OracleState.Active;

        emit LogOracleActivated(_oracleId);
    }

    function deactivateOracle(uint256 _oracleId) external onlyInstanceOperator {
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR::ORACLE_NOT_EXISTS"
        );
        require(
            oracles[_oracleId].state == OracleState.Active,
            "ERROR::ORACLE_NOT_ACTIVE"
        );
        require(
            assignedOracleTypes[_oracleId].length != 0,
            "ERROR::ORACLE_ASSIGNED_TO_ORACLE_TYPES"
        );

        oracles[_oracleId].state = OracleState.Inactive;

        emit LogOracleDeactivated(_oracleId);
    }

    function removeOracle(uint256 _oracleId) external onlyInstanceOperator {
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR::ORACLE_NOT_EXISTS"
        );
        require(
            oracles[_oracleId].state != OracleState.Active,
            "ERROR::ORACLE_NOT_ACTIVE"
        );
        require(
            assignedOracleTypes[_oracleId].length != 0,
            "ERROR::ORACLE_ASSIGNED_TO_ORACLE_TYPES"
        );

        delete oracleIdByAddress[oracles[_oracleId].oracleContract];
        delete oracles[_oracleId];
        delete assignedOracleTypes[_oracleId];

        emit LogOracleRemoved(_oracleId);
    }

    function proposeOracleToType(
        address _sender,
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external onlyOracleOwner returns (uint256 _proposalId) {
        require(
            oracles[_oracleId].oracleOwner == _sender,
            "ERROR::NOT_ORACLE_OWNER"
        );
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR::ORACLE_NOT_EXISTS"
        );
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            assignedOracles[_oracleTypeName][_oracleId] != true,
            "ERROR::ORACLE_ASSIGNED"
        );

        _proposalId = proposedOracleIds[_oracleTypeName].length++;
        proposedOracleIds[_oracleTypeName][_proposalId] = _oracleId;

        emit LogOracleProposedToType(_oracleTypeName, _oracleId, _proposalId);
    }

    function revokeOracleToTypeProposal(
        address _sender,
        bytes32 _oracleTypeName,
        uint256 _proposalId
    ) external onlyOracleOwner {
        uint256 oracleId = proposedOracleIds[_oracleTypeName][_proposalId];

        require(
            oracles[oracleId].oracleOwner == _sender,
            "ERROR::NOT_ORACLE_OWNER"
        );
        require(
            oracles[oracleId].oracleContract != address(0),
            "ERROR::ORACLE_NOT_EXISTS"
        );
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );

        emit LogOracleToTypeProposalRevoked(
            _oracleTypeName,
            oracleId,
            _proposalId
        );
    }

    function assignOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _proposalId
    ) external onlyInstanceOperator {
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR::ORACLE_TYPE_NOT_INITIALIZED"
        );

        uint256 oracleId = proposedOracleIds[_oracleTypeName][_proposalId];

        require(
            oracles[oracleId].oracleContract != address(0),
            "ERROR::ORACLE_NOT_EXISTS"
        );
        require(
            assignedOracles[_oracleTypeName][oracleId] != true,
            "ERROR::ORACLE_ASSIGNED"
        );

        assignedOracles[_oracleTypeName][oracleId] = true;
        assignedOraclesIds[_oracleTypeName].push(oracleId);

        emit LogOracleAssignedToOracleType(_oracleTypeName, oracleId);
    }

    function removeOracleFromOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external onlyInstanceOperator {
        require(
            assignedOracles[_oracleTypeName][_oracleId] == true,
            "ERROR::ORACLE_NOT_ASSIGNED"
        );

        assignedOracles[_oracleTypeName][_oracleId] = false;

        emit LogOracleRemovedFromOracleType(_oracleTypeName, _oracleId);
    }

    /* Oracle Request */
    // 1->1
    function request(
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callabackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external onlyPolicyFlow("Query") returns (uint256 _requestId) {
        // todo: validate

        _requestId = oracleRequests.length++;

        // todo: get token from product

        OracleRequest storage req = oracleRequests[_requestId];
        req.data = _input;
        req.callbackMethodName = _callbackMethodName;
        req.callbackContractAddress = _callabackContractAddress;
        req.oracleTypeName = _oracleTypeName;
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

        // todo: send reward

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
