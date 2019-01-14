pragma solidity >0.4.99 <0.6.0;

// import OracleBrokerFront interface

// To become an Oracle provider, one would need to supply and register a contract with the following interface inherited:
contract OracleFront {
    address oracleBrokerFrontAddress;

    event RequestForwarded(bytes32 _oracleType, uint _requestId);

    constructor(address _oracleBrokerFrontAddress) public {
        oracleBrokerFrontAddress = _oracleBrokerFrontAddress;
    }

    modifier onlyOracleBroker {
        require(msg.sender == oracleBrokerFrontAddress)
    }

    function forwardRequest(bytes32 oracleType, uint requestId) public onlyOracleBroker {
        emit RequestForwarded(oracleType, requestId)
    }

    function getRequest(uint requestId) returns(OracleBrokerFront.Request) {
        brokerFront().getRequest(requestId);
    }

    // TODO: Mention: It will be hard to fit on-chain calculations into same behaviour, since request is a parsable string,
    // and response is a bytes array that is best assembled by web3
    function submitOracleBrokerResponse(uint requestId, bytes data) public {
        brokerFront().submitResponse(requestId, data);
    }

    function brokerFront() internal returns(OracleBrokerFront) {
        OracleBrokerFront(oracleBrokerFrontAddress)
    }
}
