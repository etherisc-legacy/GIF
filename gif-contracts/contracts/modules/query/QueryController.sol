pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./QueryStorageModel.sol";
import "../../shared/IOracle.sol";
import "../../shared/ModuleController.sol";

contract QueryController is QueryStorageModel, ModuleController {
    bytes32 public constant NAME = "QueryController";

    modifier isResponsibleOracle(uint256 _requestId, address _responder) {
        require(
            oracles[oracleRequests[_requestId].responsibleOracleId]
            .oracleContract == _responder,
            "ERROR:QUC-001:NOT_RESPONSIBLE_ORACLE"
        );
        _;
    }

    constructor(address _registry) WithRegistry(_registry) {}

    function proposeOracleType(
        bytes32 _oracleTypeName,
        string calldata _inputFormat,
        string calldata _callbackFormat,
        string calldata _description
    ) external onlyOracleOwner {
        require(
            oracleTypes[_oracleTypeName].initialized == false,
            "ERROR:QUC-002:ORACLE_TYPE_ALREADY_INITIALIZED"
        );

        oracleTypes[_oracleTypeName] = OracleType(
            _inputFormat,
            _callbackFormat,
            _description,
            OracleTypeState.Inactive,
            true,
            0
        );

        oracleTypeNames[oracleTypeNamesIncrement] = _oracleTypeName;
        oracleTypeNamesIncrement += 1;

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
            "ERROR:QUC-003:ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            oracleTypes[_oracleTypeName].state != OracleTypeState.Active,
            "ERROR:QUC-004:ORACLE_TYPE_ALREADY_ACTIVE"
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
            "ERROR:QUC-005:ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            oracleTypes[_oracleTypeName].state == OracleTypeState.Active,
            "ERROR:QUC-006:ORACLE_TYPE_NOT_ACTIVE"
        );
        require(
            oracleTypes[_oracleTypeName].activeOracles == 0,
            "ERROR:QUC-007:ORACLE_TYPE_HAS_ACTIVE_ORACLES"
        );

        oracleTypes[_oracleTypeName].state = OracleTypeState.Inactive;

        emit LogOracleTypeDeactivated(_oracleTypeName);
    }

    function proposeOracle(
        address _sender,
        address _oracleContract,
        string calldata _description
    ) external onlyOracleOwner returns (uint256 _oracleId) {
        require(
            oracleIdByAddress[_oracleContract] == 0,
            "ERROR:QUC-008:ORACLE_ALREADY_EXISTS"
        );

        _oracleId = oracleIdIncrement;
        oracleIdIncrement += 1;

        oracles[_oracleId] = Oracle(
            _sender,
            _oracleContract,
            _description,
            OracleState.Inactive,
            0
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
            "ERROR:QUC-009:ORACLE_ALREADY_EXISTS"
        );
        require(
            oracles[_oracleId].oracleOwner == _sender,
            "ERROR:QUC-010:NOT_ORACLE_OWNER"
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
            "ERROR:QUC-011:ORACLE_DOES_NOT_EXIST"
        );
        require(
            oracles[_oracleId].state != OracleState.Active,
            "ERROR:QUC-012:ORACLE_IS_ALREADY_ACTIVE"
        );

        oracles[_oracleId].state = OracleState.Active;

        emit LogOracleActivated(_oracleId);
    }

    function deactivateOracle(uint256 _oracleId) external onlyInstanceOperator {
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR:QUC-013:ORACLE_DOES_NOT_EXIST"
        );
        require(
            oracles[_oracleId].state == OracleState.Active,
            "ERROR:QUC-014:ORACLE_NOT_ACTIVE"
        );
        require(
            oracles[_oracleId].activeOracleTypes == 0,
            "ERROR:QUC-015:ORACLE_ALREADY_ASSIGNED_TO_ORACLE_TYPES"
        );

        oracles[_oracleId].state = OracleState.Inactive;

        emit LogOracleDeactivated(_oracleId);
    }

    function proposeOracleToOracleType(
        address _sender,
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external onlyOracleOwner {
        require(
            oracles[_oracleId].oracleOwner == _sender,
            "ERROR:QUC-016:NOT_ORACLE_OWNER"
        );
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR:QUC-017:ORACLE_DOES_NOT_EXIST"
        );
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR:QUC-018:ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            assignedOracles[_oracleTypeName][_oracleId] ==
                OracleAssignmentState.Unassigned,
            "ERROR:QUC-019:ORACLE_ALREADY_PROPOSED_OR_ASSIGNED"
        );

        assignedOracles[_oracleTypeName][_oracleId] = OracleAssignmentState
        .Proposed;

        emit LogOracleProposedToOracleType(_oracleTypeName, _oracleId);
    }

    function revokeOracleFromOracleType(
        address _sender,
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external onlyOracleOwner {
        require(
            oracles[_oracleId].oracleOwner == _sender,
            "ERROR:QUC-020:NOT_ORACLE_OWNER"
        );
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR:QUC-021:ORACLE_DOES_NOT_EXIST"
        );
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR:QUC-022:ORACLE_TYPE_NOT_INITIALIZED"
        );
        require(
            assignedOracles[_oracleTypeName][_oracleId] !=
                OracleAssignmentState.Unassigned,
            "ERROR:QUC-023:ORACLE_NOT_PROPOSED_OR_ASSIGNED"
        );

        assignedOracles[_oracleTypeName][_oracleId] = OracleAssignmentState
        .Unassigned;
        oracleTypes[_oracleTypeName].activeOracles -= 1;
        oracles[_oracleId].activeOracleTypes -= 1;

        emit LogOracleRevokedFromOracleType(_oracleTypeName, _oracleId);
    }

    function assignOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external onlyInstanceOperator {
        require(
            oracleTypes[_oracleTypeName].initialized == true,
            "ERROR:QUC-024:ORACLE_TYPE_NOT_INITIALIZED"
        );

        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR:QUC-025:ORACLE_DOES_NOT_EXIST"
        );
        require(
            assignedOracles[_oracleTypeName][_oracleId] ==
                OracleAssignmentState.Proposed,
            "ERROR:QUC-026:ORACLE_NOT_PROPOSED"
        );

        assignedOracles[_oracleTypeName][_oracleId] = OracleAssignmentState
        .Assigned;
        oracleTypes[_oracleTypeName].activeOracles += 1;
        oracles[_oracleId].activeOracleTypes += 1;

        emit LogOracleAssignedToOracleType(_oracleTypeName, _oracleId);
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

        _requestId = oracleRequests.length;
        oracleRequests.push();

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
    )
        external
        onlyOracleService
        isResponsibleOracle(_requestId, _responder)
        returns (uint256 _responseId)
    {
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

        _responseId = oracleResponses.length;
        oracleResponses.push(
            OracleResponse(_requestId, _responder, block.timestamp, status)
        );

        emit LogOracleResponded(_requestId, _responseId, _responder, status);
    }
}
