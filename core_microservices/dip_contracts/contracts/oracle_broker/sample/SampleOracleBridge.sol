pragma solidity >0.4.99 <0.6.0;

import '../libraries/OracleBridgeInterface.sol';

contract SampleOracleBridge is OracleBridgeInterface {
    struct Request{
        uint input;
        uint timestamp;
        uint index;
    }

    bytes32[] requestIds;
    mapping(bytes32 => Request) requests;

    event OracleStoredRequest(bytes32 brokerId, uint index);

    function handleRequest(bytes32 _requestId, bytes memory _input) internal {
        // TODO: require request is still active?
        // bytes32 requestId = keccak256(abi.encodePacked(_requestId, _input));

        uint index = requestIds.length;
        uint decodedInput = abi.decode(_input, (uint));

        requestIds.push(_requestId);
        requests[_requestId] = Request(decodedInput, now, index);

        emit OracleStoredRequest(_requestId, index);
    }

    function getRequest(bytes32 _requestId) public view returns(uint input, uint timestamp) {
        return(requests[_requestId].input, requests[_requestId].timestamp);
    }

    function getRequestByIndex(uint _index) public view returns(bytes32 id, uint input, uint timestamp) {
        id = requestIds[_index];
        (input, timestamp) = getRequest(id);
    }

    function submitResponse(bytes32 id, uint randomNumber) public {
        bytes memory data = abi.encode(randomNumber);
        forwardResponse(id, data);
    }
}
