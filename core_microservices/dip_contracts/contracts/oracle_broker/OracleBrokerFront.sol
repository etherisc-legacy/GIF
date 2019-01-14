pragma solidity >0.4.99 <0.6.0;

import './OracleTypeRegistry.sol';
import './OracleRegistry.sol';
import './OracleRequestRegistry.sol';
import './OracleResponseHandler.sol';
import './libraries/OracleBrokerBackend.sol';
import './libraries/OracleBridgeInterface.sol';

contract OracleBrokerFront {

    address owner;

    address oracleTypeRegistryAddress;
    address oracleRegistryAddress;
    address oracleRequestRegistryAddress;
    address oracleResponseHandlerAddress;

    event NewRequest(bytes32 _id, string _oracleType, bytes input, address _responsibleOracle);
    event ResponseProvided(bytes32 _id, bool success, bool validResponse);

    constructor(
        address _oracleTypeRegistry,
        address _oracleRegistry,
        address _oracleRequestRegistry,
        address _oracleResponseHandler
    ) public {
        owner = msg.sender;  // TODO: better owner logic, since it is a central administrative account

        registerOracleTypeRegistry(_oracleTypeRegistry);
        registerOracleRegistry(_oracleRegistry);
        registerRequestRegistry(_oracleRequestRegistry);
        registerResponseHandler(_oracleResponseHandler);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function registerOracleTypeRegistry(address _registryAddress) public onlyOwner {
        require(
            _registryAddress == address(0) ||
            OracleBrokerBackend(_registryAddress).getFrontAddress() == address(this)
        );
        oracleTypeRegistryAddress = _registryAddress;
    }
    function registerOracleRegistry(address _registryAddress) public onlyOwner {
        require(
            _registryAddress == address(0) ||
            OracleBrokerBackend(_registryAddress).getFrontAddress() == address(this)
        );
        oracleRegistryAddress = _registryAddress;
    }
    function registerRequestRegistry(address _registryAddress) public onlyOwner {
        require(
            _registryAddress == address(0) ||
            OracleBrokerBackend(_registryAddress).getFrontAddress() == address(this)
        );
        oracleRequestRegistryAddress = _registryAddress;
    }
    function registerResponseHandler(address _registryAddress) public onlyOwner {
        require(
            _registryAddress == address(0) ||
            OracleBrokerBackend(_registryAddress).getFrontAddress() == address(this)
        );
        oracleResponseHandlerAddress = _registryAddress;
    }

    function oracleTypeRegistry() internal view returns(OracleTypeRegistry) {
        return OracleTypeRegistry(oracleTypeRegistryAddress);
    }
    function oracleRegistry() internal view returns(OracleRegistry) {
        return OracleRegistry(oracleRegistryAddress);
    }
    function requestRegistry() internal view returns(OracleRequestRegistry) {
        return OracleRequestRegistry(oracleRequestRegistryAddress);
    }
    function responseHandler() internal view returns(OracleResponseHandler) {
        return OracleResponseHandler(oracleResponseHandlerAddress);
    }

function proposeOracleType(
        string memory _oracleTypeId,
        string memory _callbackSignature,
        string memory _inputFormat,
        string memory _description,
        address _customTypeLogicAddress
    ) public {
        oracleTypeRegistry().proposeOracleType(
            _oracleTypeId,
            _callbackSignature,
            _inputFormat,
            _description,
            _customTypeLogicAddress
        );
    }
    function getOracleType(
        string memory _oracleTypeId
    ) public view returns(
        bool typeExists,
        string memory callbackSignature,
        string memory inputFormat,
        string memory description,
        OracleTypeRegistry.TypeState state,
        address customLogicContract
    ) {
        return oracleTypeRegistry().getOracleType(_oracleTypeId);
    }

    function makeRequest(
        string memory _oracleType,
        bytes32 _internalId,
        bytes memory _input,
        address _callabckContractAddress,
        string memory _callbackMethodName
    ) public {
        // TODO: load-balancing address
        /* address responsibleOracleAddress = oracleRegistry.nextResponsibleOracle(
            _oracleType
        ) */
        address responsibleOracleAddress;
        (, responsibleOracleAddress) = oracleRegistry().getOracleInfoByIndex(_oracleType, 0);

        bytes32 requestId = requestRegistry().makeRequest(
            _oracleType,
            _internalId,
            _input,
            _callabckContractAddress,
            _callbackMethodName,
            responsibleOracleAddress
        );

        emit NewRequest(
            requestId,
            _oracleType,
            _input,
            responsibleOracleAddress
        );

        OracleBridgeInterface(responsibleOracleAddress).forwardRequest(_oracleType, requestId, _input);
    }

    function getRequest(
        bytes32 _requestId
    )  public view returns (
        OracleRequestRegistry.RequestState /* state */,
        string memory /* oracleType */,
        bytes memory /* input */,
        bytes32 /* internalId */,
        uint256 /* timestamp */

    ) {
        requestRegistry().getRequestPayload(_requestId);
    }

    function submitResponse(
        bytes32 _requestId,
        bytes memory _data   // compiled response data
    ) public {
        // TODO: init request and type in memory
        // request = requestRegistry.getRequest(_requestId);

        address callbackAddress;
        string memory callbackMethodName;
        bytes32 internalId;

        (callbackAddress, callbackMethodName, internalId) = requestRegistry().getRequestCallbackLocation(_requestId);


        (bool success, bytes memory returnedData) = callbackAddress.call(
            abi.encodeWithSignature(string(abi.encodePacked(callbackMethodName, "(bytes32,bytes)")), internalId, _data)
        );

        (bool validResponse) = abi.decode(returnedData, (bool));

        responseHandler().processResponse(  // Do payment to responder, etc.
            msg.sender,
            _requestId,
            _data,
            validResponse
        );

        emit ResponseProvided(_requestId, success, validResponse);

        requestRegistry().resolveRequest(_requestId);
    }

    /*
    // Optional failure confirmation function for bounty hunters
    function confirmRequestFailure(
        bytes32 _requestId,
    ) public {
        // TODO: init request in memory
        request = requestRegistry.getRequest(_requestId);

        responseHandler.confirmRequestFailure(request);
    }
    */

    function registerOracle(
        string memory _oracleType
    ) public {
        address oracleAddress = msg.sender;

        require(oracleTypeRegistry().validateForOracleRegistration(_oracleType, oracleAddress));

        oracleRegistry().registerOracle(
            _oracleType,
            oracleAddress
        );
    }

    /*
    function unregisterOracle(
        bytes32 _oracleType,
        address _oracleStakeAddress,
    ) public {
        oracleTypeRegistry.validateForOracleRemoval(_oracleType, _oracleStakeAddress);
        // remove from OracleRegistry
    }
    */
}
