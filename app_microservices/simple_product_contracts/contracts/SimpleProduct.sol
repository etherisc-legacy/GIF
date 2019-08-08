pragma solidity 0.5.2;

import "../../../core/gif-contracts/contracts/Product.sol";


contract SimpleProduct is Product {

    event NewApplication(uint256 applicationId);
    event NewPolicy(uint256 policyId);
    event ApplicationDeclined(uint256 applicationId);
    event NewClaim(uint256 policyId, uint256 claimId);
    event NewPayout(uint256 claimId, uint256 payoutId, uint256 payoutAmount);
    event PolicyExpired(uint256 policyId);
    event PayoutConfirmation(uint256 payoutId, uint256 amount);

    bytes32 public constant POLICY_FLOW = "PolicyFlowDefault";

    constructor(address _productController, bytes32 _name)
        public
        Product(_productController, _name, POLICY_FLOW)
    {}

    function applyForPolicy(
        bytes32 _bpExternalKey,
        uint256 _premium,
        bytes32 _currency,
        uint256[] calldata _payoutOptions
    ) external onlySandbox {
        uint256 applicationId = _newApplication(
            _bpExternalKey,
            _premium,
            _currency,
            _payoutOptions
        );
        emit NewApplication(applicationId);
    }

    function underwriteApplication(uint256 _applicationId) external onlySandbox {
        uint256 policyId = _underwrite(_applicationId);
        emit NewPolicy(policyId);
    }

    function declineApplication(uint256 _applicationId) external onlySandbox {
        _decline(_applicationId);
        emit ApplicationDeclined(_applicationId);
    }

    function newClaim(uint256 _policyId) external onlySandbox {
        uint256 claimId = _newClaim(_policyId);
        emit NewClaim(_policyId, claimId);
    }

    function confirmClaim(uint256 _claimId, uint256 _payoutAmount) external onlySandbox {
        uint256 payoutId = _confirmClaim(_claimId, _payoutAmount);
        emit NewPayout(_claimId, payoutId, _payoutAmount);
    }

    function expire(uint256 _policyId) external onlySandbox {
        _expire(_policyId);
        emit PolicyExpired(_policyId);
    }

    function confirmPayout(uint256 _payoutId, uint256 _amount) external onlySandbox {
        _payout(_payoutId, _amount);
        emit PayoutConfirmation(_payoutId, _amount);
    }

    function getQuote(uint256 _sum) external view returns (uint256 _premium) {
        require(_sum > 0);
        _premium = _sum.div(20);
    }
}
