pragma solidity 0.5.2;

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
        uint256 release; // core release
        // uint256 product release
        address policyToken;
        bool approved;
        bool paused;
    }
}
