pragma solidity 0.5.2;

contract LicenseStorageModel {
    event LogNewProduct(
        uint256 productId,
        bytes32 name,
        address addr,
        bytes32 policyFlow
    );

    event LogProductApproved(uint256 id, bytes32 name, address addr);

    event LogProductDisapproved(uint256 id, bytes32 name, address addr);

    event LogProductPaused(uint256 id, bytes32 name, address addr);

    event LogProductUnpaused(uint256 id, bytes32 name, address addr);

    struct Product {
        bytes32 name;
        address addr;
        bytes32 policyFlow;
        uint256 release; // core release
        // uint256 product release
        address policyToken;
        bool approved;
        bool paused;
    }

    mapping(uint256 => Product) public products;
    mapping(address => uint256) public productIdByAddress;
    uint256 public productIdIncrement;

    // todo: Add list of approved products
    // todo: Add list of products for approval

}
