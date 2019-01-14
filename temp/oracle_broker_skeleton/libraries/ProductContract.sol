pragma solidity >0.4.99 <0.6.0;

// import OracleBrokerFront interface

contract ProductContract {
    address oracleBrokerFrontAddress;

    constructor(address _oracleBrokerFrontAddress) public {
        oracleBrokerFrontAddress = _oracleBrokerFrontAddress;
    }

    function modifyOracleBrokerFrontAddress(address _newOracleBrokerFrontAddress) public {
        require(checkAdministrativeAccess(msg.sender));

        oracleBrokerFrontAddress = _newOracleBrokerFrontAddress;
    }

    function makeOracleRequest(
        bytes32 oracleType,
        bytes32 internalId, // some way for the Product to trace all requests made
        bytes32 inputs,
        bytes32 callbackAddress,
        bytes32 callbackFunction,
    ) internal returns(uint) {
        uint memory requestId;
        requestId = OracleBrokerFront(oracleBrokerFrontAddress).makeRequest(oracleType, inputs, callbackAddress, callbackFunction)
        return requestId;
    }

    function getOracleRequest(uint requestId) internal returns(OracleBrokerFront.Request) {
        OracleBrokerFront(oracleBrokerFrontAddress).getRequest(requestId);
    }
}
