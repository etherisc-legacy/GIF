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
        string calldata _callbackFormat
    ) external onlyOracleOwner {
        require(
            oracleTypes[_oracleTypeName].state == OracleTypeState.Uninitialized,
            "ERROR:QUC-002:ORACLE_TYPE_ALREADY_EXISTS"
        );

        oracleTypes[_oracleTypeName] = OracleType(
            _inputFormat,
            _callbackFormat,
            OracleTypeState.Proposed,
            0
        );

        oracleTypeNamesCount += 1;
        oracleTypeNames[oracleTypeNamesCount] = _oracleTypeName;

        emit LogOracleTypeProposed(
            _oracleTypeName,
            _inputFormat,
            _callbackFormat
        );
    }

    function approveOracleType(bytes32 _oracleTypeName)
        external
        onlyInstanceOperator
    {
        require(
            oracleTypes[_oracleTypeName].state == OracleTypeState.Proposed,
            "ERROR:QUC-003:ORACLE_TYPE_NOT_PROPOSED"
        );
        require(
            oracleTypes[_oracleTypeName].state != OracleTypeState.Approved,
            "ERROR:QUC-004:ORACLE_TYPE_ALREADY_APPROVED"
        );

        oracleTypes[_oracleTypeName].state = OracleTypeState.Approved;

        emit LogOracleTypeApproved(_oracleTypeName);
    }

    function disapproveOracleType(bytes32 _oracleTypeName)
        external
        onlyInstanceOperator
    {
        require(
            oracleTypes[_oracleTypeName].state == OracleTypeState.Approved,
            "ERROR:QUC-006:ORACLE_TYPE_NOT_ACTIVE"
        );
        require(
            oracleTypes[_oracleTypeName].activeOracles == 0,
            "ERROR:QUC-007:ORACLE_TYPE_HAS_ACTIVE_ORACLES"
        );

        oracleTypes[_oracleTypeName].state = OracleTypeState.Proposed;

        emit LogOracleTypeDisapproved(_oracleTypeName);
    }

    function proposeOracle(bytes32 _name, address _oracleContract)
        external
        onlyOracleOwner
        returns (uint256 _oracleId)
    {
        require(
            oracleIdByAddress[_oracleContract] == 0,
            "ERROR:QUC-008:ORACLE_ALREADY_EXISTS"
        );

        oracleCount += 1;
        _oracleId = oracleCount;

        oracles[_oracleId] = Oracle(
            _name,
            _oracleContract,
            OracleState.Proposed,
            0
        );
        oracleIdByAddress[_oracleContract] = _oracleId;

        emit LogOracleProposed(_oracleId, _name, _oracleContract);
    }

    function updateOracleContract(address _newOracleContract, uint256 _oracleId)
        external
        onlyOracleOwner
    {
        require(
            oracleIdByAddress[_newOracleContract] == 0,
            "ERROR:QUC-009:ORACLE_ALREADY_EXISTS"
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

    function setOracleState(uint256 _oracleId, OracleState _state) internal {
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR:QUC-011:ORACLE_DOES_NOT_EXIST"
        );
        oracles[_oracleId].state = _state;
        LogOracleSetState(_oracleId, _state);
    }

    function approveOracle(uint256 _oracleId) external onlyInstanceOperator {
        setOracleState(_oracleId, OracleState.Approved);
    }

    function pauseOracle(uint256 _oracleId) external onlyInstanceOperator {
        setOracleState(_oracleId, OracleState.Paused);
    }

    function disapproveOracle(uint256 _oracleId) external onlyInstanceOperator {
        setOracleState(_oracleId, OracleState.Proposed);
    }

    function proposeOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external onlyOracleOwner {
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR:QUC-017:ORACLE_DOES_NOT_EXIST"
        );
        require(
            oracleTypes[_oracleTypeName].state == OracleTypeState.Approved,
            "ERROR:QUC-018:ORACLE_TYPE_NOT_APPROVED"
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
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external onlyOracleOwner {
        require(
            oracles[_oracleId].oracleContract != address(0),
            "ERROR:QUC-021:ORACLE_DOES_NOT_EXIST"
        );
        require(
            oracleTypes[_oracleTypeName].state == OracleTypeState.Approved,
            "ERROR:QUC-022:ORACLE_TYPE_NOT_APPROVED"
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
            oracleTypes[_oracleTypeName].state == OracleTypeState.Approved,
            "ERROR:QUC-024:ORACLE_TYPE_NOT_APPROVED"
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
        bytes32 _bpKey,
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
        req.bpKey = _bpKey;
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

        emit LogOracleRequested(_bpKey, _requestId, _responsibleOracleId);
    }

    /* Oracle Response */
    function respond(
        uint256 _requestId,
        address _responder,
        bytes calldata _data
    ) external onlyOracleService isResponsibleOracle(_requestId, _responder) {
        OracleRequest storage req = oracleRequests[_requestId];

        (bool status, ) =
            req.callbackContractAddress.call(
                abi.encodeWithSignature(
                    string(
                        abi.encodePacked(
                            req.callbackMethodName,
                            "(uint256,bytes32,bytes)"
                        )
                    ),
                    _requestId,
                    req.bpKey,
                    _data
                )
            );

        // todo: send reward

        emit LogOracleResponded(req.bpKey, _requestId, _responder, status);
    }

    function getOracleRequestCount() public view returns (uint256 _count) {
        return oracleRequests.length;
    }
}
