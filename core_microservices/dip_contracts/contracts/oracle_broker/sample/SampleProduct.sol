pragma solidity >0.4.99 <0.6.0;

import '../OracleBrokerFront.sol';

contract SampleProduct {
    address oracleBrokerAddress;

    mapping(bytes32 => uint) requests;
    mapping(bytes32 => uint) results;

    event ProductRequestRegistered(bytes32 id);
    event ProductResultReceived(bytes32 id, uint response);

    constructor(address _oracleBrokerAddress) public {
        oracleBrokerAddress = _oracleBrokerAddress;
    }

    function getRandomNumberUnder(uint _requestInteger) public returns(bytes32 internalId) {
        internalId = keccak256(abi.encodePacked(_requestInteger, msg.sender, now));

        bytes memory input = abi.encode(_requestInteger);

        OracleBrokerFront(oracleBrokerAddress).makeRequest(
            'SampleRandomNumber',
            internalId,
            input,
            address(this),
            'callbackFunction'
        );

        requests[internalId] = _requestInteger;

        emit ProductRequestRegistered(internalId);

        return internalId;
    }

    function callbackFunction(bytes32 internalId, bytes memory _packagedResult) public onlyOracleBroker returns(bool validResponse) {
        (uint result) = abi.decode(_packagedResult, (uint));
        results[internalId] = result;
        emit ProductResultReceived(internalId, result);
        return true;
    }

    function getResponse(bytes32 internalId) public view returns(uint) {
        return results[internalId];
    }

    modifier onlyOracleBroker() {
        require(msg.sender == oracleBrokerAddress);
        _;
    }
}
