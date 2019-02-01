pragma solidity 0.5.2;

interface ILedger {
    struct Ledger {
        int256 premium; // 0
        int256 riskFund; // 1
        int256 payout; // 2
        int256 reward; // 3
        int256 oracleCosts; // 4
        int256 balance; // 5
        bool enabled;
    }

    struct Currency {
        bytes32 code;
        address token;
        bool erc20;
        bool erc721;
        bool enabled;
    }
}
