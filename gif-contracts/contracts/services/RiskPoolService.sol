pragma solidity 0.6.11;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "../shared/WithRegistry.sol";

contract RiskPoolService is WithRegistry, Ownable {
    bytes32 public constant NAME = "RiskPoolService";

    address payable public riskPoolAddress;

    constructor(address _registry) public WithRegistry(_registry) {}

    function getRiskPoolAddress()
        external
        view
        returns (address payable _riskPoolAdress)
    {
        return riskPoolAddress;
    }

    function setRiskPoolAddress(address payable _riskPoolAddress)
        external
        onlyOwner
    {
        riskPoolAddress = _riskPoolAddress;
    }
}
