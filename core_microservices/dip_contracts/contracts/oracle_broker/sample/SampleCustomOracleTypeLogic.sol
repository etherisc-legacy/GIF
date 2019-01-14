pragma solidity >0.4.99 <0.6.0;

import '../libraries/CustomOracleTypeLogic.sol';

contract SampleCustomOracleTypeLogic is CustomOracleTypeLogic {
    address ownerAddress;
    mapping(address => bool) whitelist;

    constructor() public {
        ownerAddress = msg.sender;
    }

    function implementsOracleRegistration() pure public returns(bool) { return(true); }
    function validateOracleRegistration(
        address _oracleAddress
    ) view public returns(bool) {
        return(whitelist[_oracleAddress]);
    }

    function addToWhitelist(address _addressToWhitelist) public onlyOwner {
        whitelist[_addressToWhitelist] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == ownerAddress);
        _;
    }

}
