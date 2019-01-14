pragma solidity >0.4.99 <0.6.0;

// import OracleFront interface
// import Oraclize

contract HttpProvider is OracleFront {
    mapping(bytes32 => uint) requests;

    constructor(address _oracleBrokerFrontAddress) OracleFront(_oracleBrokerFrontAddress) public {
        // Even if this Oracle Provider only implements Oraclize, he still can service both confirmed and unconfirmed requests
        brokerFront().registerOracle('HttpGet', self);
        brokerFront().registerOracle('HttpGetWithConfirmation', self);
    }

    function makeOraclizeCall(uint brokerQueryId, bytes inputsReducedToUrl) public onlyOffChainTransaction {
        bytes32 queryId = oraclize_query("nested", inputsReducedToUrl, ORACLIZE_GAS);
        requests[queryId] = brokerQueryId;
    }

    function _callback(bytes32 _queryId, string _result, bytes _proof) public onlyOraclize {
        uint memory brokerQueryId = requests[_queryId];
        OracleBrokerFront.Request memory request = brokerFront().getRequest(brokerQueryId);

        if (request.oracleType == 'HttpGet') {
            brokerFront().call('submitResponse(uint, bytes)', brokerQueryId, data);
        } else {
            brokerFront().call('submitResponse(uint, bytes)', brokerQueryId, data, proof);
        }
    }
}
