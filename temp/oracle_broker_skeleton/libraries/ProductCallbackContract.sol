pragma solidity >0.4.99 <0.6.0;

contract ProductCallbackContract is ProductContract {

    constructor(address _oracleBrokerFrontAddress) ProductContract(_oracleBrokerFrontAddress) public {}

    modifier onlyOracleBroker {
        require(msg.sender == oracleBrokerFrontAddress)
    }

    function confirmRequestDeadline(bytes32 _internalId) public onlyOracleBroker {
        // TODO - handle deadline passing / make the same request with new InternalId
    }

    // TODO - implement your callback method with onlyOracleBroker modifier
}
