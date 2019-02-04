pragma solidity 0.5.2;

contract LicenseStorageModel {
    event LogNewRegistration(
        uint256 registrationId,
        bytes32 name,
        address addr
    );

    event LogRegistrationDeclined(uint256 registrationId);

    event LogNewProductApproved(
        bytes32 name,
        address addr,
        uint256 id
    );

    event LogProductDisapproved(
        bytes32 name,
        address addr,
        uint256 id
    );

    event LogProductReapproved(bytes32 name, address addr, uint256 id);

    event LogProductPaused(bytes32 name, address addr, uint256 id);

    event LogProductUnpaused(bytes32 name, address addr, uint256 id);

    struct Registration {
        bytes32 name;
        address addr;
        bytes32 policyFlow;
        uint256 release;
        bool declined;
    }

    struct Product {
        bytes32 name;
        address addr;
        bytes32 policyFlow;
        uint256 release; // core
        // uint256 applicationRelease
        address policyToken;
        bool approved;
        bool paused;
    }

    /**
     * @dev Registration array
     */
    Registration[] public registrations;

    /**
     * @dev Products
     */
    Product[] public products;

    /**
     * @dev Get product id by contract's address
     */
    mapping(address => uint256) public productIdByAddress;
}
