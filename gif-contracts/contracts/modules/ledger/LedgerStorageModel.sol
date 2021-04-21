pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./ILedger.sol";

contract LedgerStorageModel is ILedger {
    mapping(bytes32 => Currency) public currencies;
    bytes32[] public currencyIndexes;

    mapping(uint256 => mapping(bytes32 => Ledger)) public ledgers;
    mapping(uint256 => bytes32[]) public ledgerIndexes;
}
