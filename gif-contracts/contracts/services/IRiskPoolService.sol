pragma solidity 0.8.0;

// SPDX-License-Identifier: Apache-2.0

interface IRiskPoolService {
    function getRiskPoolAddress()
        external
        view
        returns (address payable _riskPoolAdress);

    function setRiskPoolAddress(address payable _riskPoolAddress) external;

    function requestPayout(uint256 _payoutId) external;
}
