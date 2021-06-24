pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

interface ILicense {

    enum ProductState {Proposed, Approved, Paused}

    event LogNewProduct(
        uint256 productId,
        bytes32 name,
        address addr,
        bytes32 policyFlow
    );

    event LogProductSetState(uint256 productId, bytes32 name, address addr, ProductState state);

    struct Product {
        address productOwner;
        bytes32 name;
        address addr;
        bytes32 policyFlow;
        bytes32 version;
        bytes32 release;
        address policyToken;
        ProductState state;
    }
}
