pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

interface ILicense {
    event LogNewProduct(
        uint256 productId,
        bytes32 name,
        address addr,
        bytes32 policyFlow
    );

    event LogProductApproved(uint256 productId, bytes32 name, address addr);

    event LogProductDisapproved(uint256 productId, bytes32 name, address addr);

    event LogProductPaused(uint256 productId, bytes32 name, address addr);

    event LogProductUnpaused(uint256 productId, bytes32 name, address addr);

    struct Product {
        address productOwner;
        bytes32 name;
        address addr;
        bytes32 policyFlow;
        bytes32 version;
        bytes32 release;
        address policyToken;
        bool approved;
        bool paused;
    }
}
