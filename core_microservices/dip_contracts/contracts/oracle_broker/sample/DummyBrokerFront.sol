pragma solidity >0.4.99 <0.6.0;

contract DummyBrokerFront {
    address oracleAddress;
    address productAddress;


    function registerOracle(
        string memory
    ) public {
        oracleAddress = msg.sender;
    }

    function makeRequest(
        string memory _type,
        bytes32 _id,
        bytes memory _input,
        address,
        string memory
    ) public {
        productAddress = msg.sender;
        (bool success, bytes memory data) = oracleAddress.call(
            abi.encodeWithSignature('forwardRequest(string memory,bytes32,bytes memory);', _type, _id, _input)
        );
        success; data;
    }

    function submitResponse(
        bytes32 _id,
        bytes memory _data
    ) public {
        (bool success, bytes memory data) = productAddress.call(
            abi.encodeWithSignature("callbackFunction(bytes32,bytes)", _id, _data)
        );
        success; data;
    }
}
