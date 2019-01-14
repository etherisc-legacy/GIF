pragma solidity >0.4.99 <0.6.0;

// import OracleFront interface

contract FlightRatingsProvider is OracleFront {

    constructor(address _oracleBrokerFrontAddress) OracleFront(_oracleBrokerFrontAddress) public {

        brokerFront().registerOracle('HttpGet', self);
    }

    function submitResponse(uint requestId, bytes data) public onlyOffChainTransaction {
        brokerFront().submitResponse(requestId, data);
    }
}
