pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "../shared/WithRegistry.sol";
import "./IRiskPoolService.sol";

contract RiskPoolService is IRiskPoolService, WithRegistry, Ownable {
    bytes32 public constant NAME = "RiskPoolService";

    address payable public riskPoolAddress;

    // solhint-disable-next-line no-empty-blocks
    constructor(address _registry) WithRegistry(_registry) {}

    function setRiskPoolAddress(address payable _riskPoolAddress)
        external override
        onlyOwner
    {
        riskPoolAddress = _riskPoolAddress;
    }

    function getRiskPoolAddress()
        external override
        view
        returns (address payable _riskPoolAdress)
    {
        return riskPoolAddress;
    }

    function requestPayout(uint256 _payoutId) external override {

    }

}
