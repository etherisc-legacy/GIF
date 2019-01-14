pragma solidity >0.4.99 <0.6.0;

import '../OracleBrokerFront.sol';

contract OracleBridgeInterface {
    address ownerAddress;
    address brokerFrontAddress;

    event RequestForwarded(string oracleType, bytes32 id);

    constructor() public {
        ownerAddress = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == ownerAddress);
        _;
    }

    modifier onlyBroker() {
        require(msg.sender == brokerFrontAddress);
        _;
    }

    function connectToBrokerFront(address _brokerFrontAddress, string memory _oracleType)  public onlyOwner {
        brokerFrontAddress = _brokerFrontAddress;
        OracleBrokerFront(brokerFrontAddress).registerOracle(_oracleType);
    }

    function forwardRequest(string memory _oracleType, bytes32 _requestId, bytes memory _input) public onlyBroker {
        emit RequestForwarded(_oracleType, _requestId);
        handleRequest(_requestId, _input);
    }

    function handleRequest(bytes32 /* _requestId */, bytes memory /* _input */ ) internal {
        //
    }

    function forwardResponse(bytes32 _requestId, bytes memory _response) internal {
        OracleBrokerFront(brokerFrontAddress).submitResponse(_requestId, _response);
    }
}
