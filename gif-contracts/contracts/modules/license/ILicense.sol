pragma solidity 0.8.0;

// SPDX-License-Identifier: Apache-2.0

interface ILicense {
    enum ProductState {Proposed, Approved, Paused}

    event LogProductProposed(
        uint256 productId,
        bytes32 name,
        address productContract,
        bytes32 policyFlow
    );

    event LogProductSetState(uint256 productId, ProductState state);

    struct Product {
        bytes32 name;
        address productContract;
        bytes32 policyFlow;
        bytes32 release;
        ProductState state;
    }
}
