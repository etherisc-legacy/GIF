pragma solidity 0.5.2;

import "./ILedger.sol";

contract LedgerStorageModel is ILedger {
    mapping(bytes32 => Currency) public currencies;
    bytes32[] public currencyIndexes;

    mapping(uint256 => mapping(bytes32 => Ledger)) public ledgers;
    mapping(uint256 => bytes32[]) public ledgerIndexes;
}
