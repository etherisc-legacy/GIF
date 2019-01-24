pragma solidity 0.5.2;


contract LicenceStorageModel {
    event LogNewRegistration(
        uint256 registrationId,
        bytes32 name,
        address addr
    );

    event LogRegistrationDeclined(
        uint256 registrationId
    );

    event LogNewApplicationApproved(
        bytes32 name,
        address addr,
        uint256 id
    );

    event LogApplicationDisapproved(
        bytes32 name,
        address addr,
        uint256 id
    );

    event LogApplicationReapproved(
        bytes32 name,
        address addr,
        uint256 id
    );

    event LogApplicationPaused(
        bytes32 name,
        address addr,
        uint256 id
    );

    event LogApplicationUnpaused(
        bytes32 name,
        address addr,
        uint256 id
    );

    struct Registration {
        bytes32 name;
        address addr;
        bytes32 policyFlow;
        uint256 release;
        bool declined;
    }

    struct InsuranceApplication {
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
     * @dev Applications array
     */
    InsuranceApplication[] public insuranceApplications;

    /**
     * @dev Get application id by contract's address
     */
    mapping (address => uint256) public insuranceApplicationIdByAddress;
}
