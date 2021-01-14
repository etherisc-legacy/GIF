pragma solidity 0.6.11;

interface IRiskPoolService {

    function getRiskPoolAddress() external view returns (address payable _riskPoolAdress);
    function setRiskPoolAddress(address payable _riskPoolAddress) external onlyOwner;
    function requestPayout(uint256 _payoutId) public;
}
