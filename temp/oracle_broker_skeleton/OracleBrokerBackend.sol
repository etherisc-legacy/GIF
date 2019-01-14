pragma solidity >0.4.99 <0.6.0;

contract OracleBrokerBackend {
    constructor() public {}
    address front;

    modifier onlyBrokerFront {
        require(
            msg.sender == front,
            "Only Broker Front call this function."
        );
        _;
    }
}
