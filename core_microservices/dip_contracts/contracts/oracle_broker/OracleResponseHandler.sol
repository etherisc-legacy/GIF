pragma solidity >0.4.99 <0.6.0;

import './libraries/OracleBrokerBackend.sol';
// import OraclePaymentProcessor

contract OracleResponseHandler is OracleBrokerBackend {
    //address paymentProcessorAddress;

    struct ResponseRecord {
        address responder;
        uint timestamp;
        bool validResponse;
    }

    mapping(bytes32 => ResponseRecord) public responses;

    constructor(
        // address _paymentProcessor,
        address _frontAddress
    ) public OracleBrokerBackend(_frontAddress) {
        //
    }


    function processResponse(
        address responder,
        bytes32 _requestId,
        bytes memory /* _data */,
        bool validResponse
    ) public onlyBrokerFront {
        responses[_requestId] = ResponseRecord(responder, now, validResponse);

        // requestType = oracleTypeRegistry.getOracleType(request.oracleType);

        // require( deadline is not here yet );

        // require(
        //     responder == request.responsibleOracleAddress
        // );

        // require(paymentProcessor.getOracleStake(msg.sender) >= CONFIG_MINIMAL_STAKE); // TODO: read minimal config stake from somewhere

        /*
        if (msg.sender != request.responsibleOracleAddress) {
            paymentProcessor.cutOracleStake(request.responsibleOracleAddress)
        }
        */

        // paymentProcessor.commitRequestPayment(_requestId, responder);
    }

/*
    function confirmRequestFailure(
    request
    ) public onlyBroker {
    requestType = oracleTypeRegistry.getOracleType(request.oracleType);

    // require( request deadline has passed );
    // optional: Cut stake for all oracles registered for OracleType ?

    paymentProcessor.refundRequestPayment(_requestId);
    // TODO: reward msg.sender as bounty

    ProductCallbackContract.confirmRequestFailure(request.internalId);
    // ProductCallbackContract needs to implement a 'confirmRequestFailure' method
    // to support this optional capability
    }
*/

}
