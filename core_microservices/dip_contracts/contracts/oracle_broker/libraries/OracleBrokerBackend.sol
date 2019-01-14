pragma solidity >0.4.99 <0.6.0;

contract OracleBrokerBackend {
    address ownerAddress;
    address frontAddress;

    constructor(address _frontAddress) public {
        ownerAddress = msg.sender;
        frontAddress = _frontAddress;
    }

    function setFrontAddress(
        address _frontAddress
    ) public onlyOwner {
        frontAddress = _frontAddress;
    }

    function getFrontAddress() public view returns(address) {
        return frontAddress;
    }

    modifier onlyBrokerFront {
        require(
            msg.sender == frontAddress
        );
        _;
    }

    modifier onlyOwner() {
        require(
            msg.sender == ownerAddress
        );
        _;
    }
}
