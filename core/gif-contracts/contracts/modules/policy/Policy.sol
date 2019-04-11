pragma solidity 0.5.2;

import "./PolicyStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Policy is PolicyStorageModel, ModuleStorage {
    bytes32 public constant NAME = "Policy";

    constructor(
        address _registry,
        uint256 _metadataIdIncrement,
        uint256 _applicationIdIncrement,
        uint256 _policyIdIncrement,
        uint256 _claimIdIncrement,
        uint256 _payoutIdIncrement
    ) public WithRegistry(_registry) {
        // increments should be equal to the value from the last deployed storage or zero
        metadataIdIncrement = _metadataIdIncrement;
        applicationIdIncrement = _applicationIdIncrement;
        policyIdIncrement = _policyIdIncrement;
        claimIdIncrement = _claimIdIncrement;
        payoutIdIncrement = _payoutIdIncrement;
    }
}
