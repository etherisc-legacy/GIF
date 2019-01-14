pragma solidity >0.4.99 <0.6.0;

// import OracleBrokerBackend
// import OraclePaymentProcessor

contract OracleResponseHandler is OracleBrokerBackend {
    address paymentProcessorAddress;

    struct Response {
        // request data
        uint timestamp,
    };
    mapping (bytes32 => Response) public responses;

    constructor(
        address _paymentProcessor,
    ) public {
        // TODO: make register<interface> functions:
        // 1) save address,
        // 2) send self as brokerAddress to them / give it permissive role
        registerPaymentProcessor(_paymentProcessor);
    }

    function processResponse(
        request
    ) public onlyBroker {
        requestType = oracleTypeRegistry.getOracleType(request.oracleType);

        require(/* deadline is not here yet */);
        require(
            msg.sender == request.responsibleOracleAddress
            || /* preparation Period ended and sender is a registered Oracle */
        );

        require(paymentProcessor.getOracleStake(msg.sender) >= CONFIG_MINIMAL_STAKE); // TODO: read minimal config stake from somewhere

        if (msg.sender != request.responsibleOracleAddress) {
            paymentProcessor.cutOracleStake(request.responsibleOracleAddress)
        }

        paymentProcessor.commitRequestPayment(_requestId, msg.sender);

        // TODO: define ProductCallbackContract
        ProductCallbackContract.at(request.callbackAddress).call(
            callbackMethod(request), // TODO: callback method is assembled from OracleType signature and Request callback function
            data
        );
    }

    function confirmRequestFailure(
        request
    ) public onlyBroker {
        requestType = oracleTypeRegistry.getOracleType(request.oracleType);

        require(/* request deadline has passed */);
                // optional: Cut stake for all oracles registered for OracleType ?

        paymentProcessor.refundRequestPayment(_requestId);
        // TODO: reward msg.sender as bounty

        ProductCallbackContract.confirmRequestFailure(request.internalId);
        // ProductCallbackContract needs to implement a 'confirmRequestFailure' method
        // to support this optional capability
    }
}
