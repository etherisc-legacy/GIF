pragma solidity 0.5.2;

interface IPolicy {
    // Events
    event LogNewMetadata(
        uint256 productId,
        bytes32 bpExternalKey,
        uint256 metadataId,
        PolicyFlowState state
    );

    event LogMetadataStateChanged(
        uint256 productId,
        uint256 metadataId,
        PolicyFlowState state
    );

    event LogNewApplication(
        uint256 productId,
        uint256 metadataId,
        uint256 applicationId
    );

    event LogApplicationStateChanged(
        uint256 productId,
        uint256 metadataId,
        uint256 applicationId,
        ApplicationState state
    );

    event LogNewPolicy(
        uint256 productId,
        uint256 metadataId,
        uint256 policyId,
        uint256 applicationId
    );

    event LogPolicyStateChanged(
        uint256 productId,
        uint256 metadataId,
        uint256 policyId,
        PolicyState state
    );

    event LogNewClaim(
        uint256 productId,
        uint256 metadataId,
        uint256 policyId,
        uint256 claimId,
        ClaimState state
    );

    event LogClaimStateChanged(
        uint256 productId,
        uint256 metadataId,
        uint256 policyId,
        uint256 claimId,
        ClaimState state
    );

    event LogNewPayout(
        uint256 productId,
        uint256 payoutId,
        uint256 metadataId,
        uint256 policyId,
        uint256 claimId,
        uint256 amount,
        PayoutState state
    );

    event LogPayoutStateChanged(
        uint256 productId,
        uint256 payoutId,
        uint256 metadataId,
        uint256 policyId,
        uint256 claimId,
        PayoutState state
    );

    event LogPayoutCompleted(
        uint256 productId,
        uint256 policyId,
        uint256 payoutId,
        uint256 metadataId,
        uint256 amount,
        PayoutState state
    );

    event LogPartialPayout(
        uint256 productId,
        uint256 policyId,
        uint256 payoutId,
        uint256 metadataId,
        uint256 amount,
        uint256 remainder,
        PayoutState state
    );

    // Statuses
    enum PolicyFlowState {Started, Paused, Finished}

    enum ApplicationState {Applied, Revoked, Underwritten, Declined}

    enum PolicyState {Active, Expired}

    enum ClaimState {Applied, Confirmed, Declined}

    enum PayoutState {Expected, PaidOut}

    // Objects
    struct Metadata {
        // Lookup
        uint256 applicationId;
        uint256 policyId;
        uint256[] claimIds;
        uint256[] payoutIds;
        bool hasPolicy;
        bool hasApplication;
        // ERC721 token
        address tokenContract;
        // Core
        address registryContract;
        uint256 release;
        // State
        PolicyFlowState state;
        bytes32 stateMessage;
        // BPMN
        // PolicyState[] next;

        // BP
        bytes32 bpExternalKey;
        // Datetime
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Application {
        uint256 metadataId;
        // Premium
        uint256 premium;
        bytes32 currency;
        // Proof

        // Payout
        uint256[] payoutOptions;
        // State
        ApplicationState state;
        bytes32 stateMessage;
        // Datetime
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Policy {
        uint256 metadataId;
        // State
        PolicyState state;
        bytes32 stateMessage;
        // Datetime
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Claim {
        uint256 metadataId;
        // Data
        bytes32 data;
        // State
        ClaimState state;
        bytes32 stateMessage;
        // Proof

        // Datetime
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Payout {
        uint256 metadataId;
        uint256 claimId;
        // Amounts
        uint256 expectedAmount;
        uint256 actualAmount;
        // State
        PayoutState state;
        bytes32 stateMessage;
        // Proof

        // Datetime
        uint256 createdAt;
        uint256 updatedAt;
    }
}
