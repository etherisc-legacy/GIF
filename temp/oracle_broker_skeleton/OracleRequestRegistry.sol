pragma solidity >0.4.99 <0.6.0;

// import OracleBrokerBackend
// import OraclePaymentProcessor

contract OracleRequestRegistry is OracleBrokerBackend {
    address paymentProcessorAddress;

    enum RequestState { Active, Resolved }  // Contested ??

    struct Request {
        // request data
        uint timestamp,
        RequestState state,
    };
    mapping (bytes32 => Request) public requests;

    constructor(
        address _paymentProcessor,
    ) public {
        // TODO: make register<interface> functions:
        // 1) save address,
        // 2) send self as brokerAddress to them / give it permissive role
        registerPaymentProcessor(_paymentProcessor);
    }

    function makeRequest(
        //
    ) public onlyBrokerFront returns(bytes32) {
        paymentProcessor.storeRequestPayment(
            msg.sender,
            requestId,        //
            oracleType.requestPrice  // TODO: fuzzy: define pricing in Types Registry, or have an additional ledger ?
        )

        // store request to registry
        // return id
    }

    function getRequest(
        bytes32 _requestId
    ) public onlyBrokerFront returns (
        // request data
    ) {

    }

}
