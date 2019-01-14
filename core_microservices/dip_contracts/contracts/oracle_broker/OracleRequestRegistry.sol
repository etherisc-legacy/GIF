pragma solidity >0.4.99 <0.6.0;

import './libraries/OracleBrokerBackend.sol';
// import OraclePaymentProcessor

contract OracleRequestRegistry is OracleBrokerBackend {
    // address paymentProcessorAddress;

    enum RequestState { Unknown, Active, Resolved }  // Contested ??

    event RequestRegistered(string oracleType, bytes32 id, uint timestamp);

    struct Request {
        string oracleType;
        bytes32 internalId; // An ID assigned to request in product contract
        bytes input;
        address callbackContractAddress;
        address responsibleOracleAddress;
        string callbackMethodName;
        uint256 timestamp;
        RequestState state;
    }

    mapping (bytes32 => Request) public requests;

    constructor(
        // address _paymentProcessor,
        address _frontAddress
    ) public OracleBrokerBackend(_frontAddress) {
        // registerPaymentProcessor(_paymentProcessor);
    }

    function makeRequest(
        string memory _oracleType,
        bytes32 _internalId,
        bytes memory _input,
        address _callabckContractAddress,
        string memory _callbackMethodName,
        address _responsibleOracleAddress
    ) public onlyBrokerFront returns(bytes32) {
        uint256 timestamp = now;
        bytes32 id = keccak256(
            abi.encodePacked(_oracleType, _internalId, timestamp)
        );

        require(requests[id].state == RequestState.Unknown);

/*
        paymentProcessor.storeRequestPayment(
            msg.sender,
            requestId,        //
            oracleType.requestPrice  // TODO: fuzzy: define pricing in Types Registry, or have an additional ledger ?
        )
*/
        requests[id] = Request(
            _oracleType,
            _internalId,
            _input,
            _callabckContractAddress,
            _responsibleOracleAddress,
            _callbackMethodName,
            timestamp,
            RequestState.Active
        );

        emit RequestRegistered(_oracleType, id, timestamp);

        return id;
    }

    function resolveRequest(
        bytes32 _requestId
    ) public onlyBrokerFront {
        require(requests[_requestId].state == RequestState.Active);
        requests[_requestId].state = RequestState.Resolved;
    }

    function getRequestPayload(
        bytes32 _requestId
    ) public view returns (
        RequestState state,
        string memory oracleType,
        bytes memory input,
        bytes32 internalId,
        uint256 timestamp
    ) {
        Request memory request = requests[_requestId];
        return(
            request.state,
            request.oracleType,
            request.input,
            request.internalId,
            request.timestamp
        );
    }

    function getRequestCallbackLocation(
        bytes32 _requestId
    ) public view returns (
        address callabckContractAddress,
        string memory callbackMethodName,
        bytes32 internalId
    ) {
        Request memory request = requests[_requestId];
        return(
            request.callbackContractAddress,
            request.callbackMethodName,
            request.internalId
        );
    }

}
