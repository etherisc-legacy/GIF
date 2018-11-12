pragma solidity ^0.4.24;


import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract EStoreInsurance is Ownable {

    // Policy livecycle states
    enum PolicyState { Applied, Accepted, ForPayout, PaidOut, Expired, Declined }

    // Claim livecycle states
    enum ClaimState { Applied, Rejected, Confirmed }

    // List of available currencies for payments and payouts
    enum Currency { EUR, USD, GBP, CZK }

    struct Policy {
        // 0 - customer id in the external database
        bytes32 customerExternalId;
        // 1 - pointer to the risk in the risks mapping
        bytes32 riskId;
        // 2 - premium
        uint256 premium;
        // 3 - expected Payout
        uint256 expectedPayout;
        // 4 - actual Payout
        uint256 actualPayout;
        // 5 - currency
        Currency currency;
        // 6 - state of the policy
        PolicyState state;
        // 7 - time of the last state change
        uint256 stateTime;
        // 8 - state change message/reason
        bytes32 stateMessage;
    }

    struct Risk {
        bytes32 vendorCode;
        bytes32 product;
        uint256 expiration;
        uint256 sumInsured;
    }

    struct Claim {
        uint256 policyId;
        ClaimState state;
        uint256 stateTime;
        string stateMessage;
    }

    Policy[] public policies;

    Claim[] public claims;

    mapping(bytes32 => Risk) public risks;

    event LogPolicySetState(
        uint256 _policyId,
        PolicyState _state,
        uint256 _stateTime,
        bytes32 _stateMessage
    );

    event LogClaimSetState(
        uint256 _claimId,
        uint256 _policyId,
        ClaimState _state,
        uint256 _stateTime,
        string _stateMessage
    );

    function newPolicy(
        bytes32 _vendorCode,
        bytes32 _product,
        uint256 _premium,
        uint256 _sumInsured,
        Currency _currency,
        uint256 _expiration,
        bytes32 _customerExternalId
    ) external onlyOwner {
        require(_premium > 0);
        require(_sumInsured > 0);
        require(_expiration > block.timestamp);

        bytes32 _riskId = keccak256(abi.encodePacked(_customerExternalId, _vendorCode, block.timestamp));
        uint256 _policyId = policies.length++;

        Risk storage risk = risks[_riskId];
        Policy storage policy = policies[_policyId];

        risk.vendorCode = _vendorCode;
        risk.product = _product;
        risk.sumInsured = _sumInsured;
        risk.expiration = _expiration;

        policy.customerExternalId = _customerExternalId;
        policy.premium = _premium;
        policy.riskId = _riskId;
        policy.currency = _currency;

        _setPolicyState(_policyId, PolicyState.Applied, "Applied by customer");
    }

    function underwrite(uint256 _policyId) external onlyOwner {
        Policy storage policy = policies[_policyId];
        require(policy.state == PolicyState.Applied);

        _setPolicyState(_policyId, PolicyState.Accepted, "Underwritten");
    }

    function decline(uint256 _policyId, bytes32 _reason) external onlyOwner {
        Policy storage policy = policies[_policyId];
        require(policy.state == PolicyState.Applied);

        _setPolicyState(_policyId, PolicyState.Declined, _reason);
    }

    function newClaim(uint256 _policyId, string _reason) external onlyOwner {
        uint256 _claimId = claims.length++;

        Claim storage claim = claims[_claimId];

        claim.policyId = _policyId;

        _setClaimState(_claimId, ClaimState.Applied, _reason);
    }

    function expire(uint256 _policyId) external onlyOwner {
        Policy storage policy = policies[_policyId];
        Risk storage risk = risks[policy.riskId];

        require(block.timestamp >= risk.expiration);

        _setPolicyState(_policyId, PolicyState.Expired, "Expired");
    }

    function rejectClaim(uint256 _claimId, string _reason) external onlyOwner {
        Claim storage claim = claims[_claimId];
        Policy storage policy = policies[claim.policyId];

        require(policy.state == PolicyState.Accepted);
        require(claim.state == ClaimState.Applied);

        _setClaimState(_claimId, ClaimState.Rejected, _reason);
    }

    function confirmClaim(uint256 _claimId, string _reason) external onlyOwner {
        Claim storage claim = claims[_claimId];
        Policy storage policy = policies[claim.policyId];
        Risk storage risk = risks[policy.riskId];

        require(policy.state == PolicyState.Accepted);
        require(claim.state == ClaimState.Applied);

        _setClaimState(_claimId, ClaimState.Confirmed, _reason);

        policy.expectedPayout = risk.sumInsured;

        _setPolicyState(claim.policyId, PolicyState.ForPayout, "Claim confirmed");
    }

    function confirmPayout(uint256 _policyId, bytes32 _proof) external onlyOwner {
        Policy storage policy = policies[_policyId];
        require(policy.state == PolicyState.ForPayout);

        _setPolicyState(_policyId, PolicyState.PaidOut, _proof);

        policy.actualPayout = policy.expectedPayout;
    }

    function getPoliciesCount() public constant returns (uint256 _count) {
        _count = policies.length;
    }

    function getClaimsCount() public constant returns (uint256 _count) {
        _count = claims.length;
    }

    function _setPolicyState(uint256 _policyId, PolicyState _newState, bytes32 _stateMessage) internal {
        Policy storage policy = policies[_policyId];

        policy.state = _newState;
        policy.stateTime = block.timestamp;
        policy.stateMessage = _stateMessage;

        emit LogPolicySetState(_policyId, _newState, block.timestamp, _stateMessage);
    }

    function _setClaimState(uint256 _claimId, ClaimState _claimState, string _reason) internal {
        Claim storage claim = claims[_claimId];

        claim.state = _claimState;
        claim.stateTime = block.timestamp;
        claim.stateMessage = _reason;

        emit LogClaimSetState(_claimId, claim.policyId, _claimState, block.timestamp, _reason);
    }
}
