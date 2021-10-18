pragma solidity 0.8.0;
// SPDX-Pool-Identifier: Apache-2.0

import "../shared/WithRegistry.sol";
import "../modules/stake/IStake.sol";
import "../modules/stake/IStakeController.sol";
import "../modules/pool/IPoolController.sol";

/*
 * StakeFlowDefault is a delegate of PoolService.sol.
 * Access Control is maintained:
 * 1) by checking condition in PoolService.sol
 * 2) by modifiers "onlyStakeFlow" in StakeController.sol
 * For all functions here, msg.sender is = address of PoolService.sol which is registered in the Registry.
 * (if not, it reverts in StakeController.sol)
 */

contract StakeFlowDefault is WithRegistry {
    bytes32 public constant NAME = "StakeFlowDefault";

    // solhint-disable-next-line no-empty-blocks
    constructor(address _registry) WithRegistry(_registry) {}

    function deposit(
        bytes32 _bpKey,
        bytes calldata _data
    ) external {
        IStakeController stake = getStakeContract();
        // the calling contract is the Pool contract, which needs to have a poolId in the pool contract.
        uint256 poolId = getPoolContract().getPoolId(msg.sender);

        stake.createStakeFlow(poolId, _bpKey);
        stake.createDeposit(_bpKey, _data);
    }

    function underwrite(bytes32 _bpKey) external {
        IStakeController stake = getStakeContract();
        require(
            stake.getApplication(_bpKey).state ==
                IStake.ApplicationState.Applied,
            "ERROR:SFD-001:INVALID_APPLICATION_STATE"
        );
        stake.setApplicationState(
            _bpKey,
            IStake.ApplicationState.Underwritten
        );
        stake.createStake(_bpKey);
    }

    function decline(bytes32 _bpKey) external {
        IStakeController stake = getStakeContract();
        require(
            stake.getApplication(_bpKey).state ==
                IStake.ApplicationState.Applied,
            "ERROR:SFD-002:INVALID_APPLICATION_STATE"
        );

        stake.setApplicationState(_bpKey, IStake.ApplicationState.Declined);
    }

    function newClaim(bytes32 _bpKey, bytes calldata _data)
        external
        returns (uint256 _claimId)
    {
        _claimId = getStakeContract().createClaim(_bpKey, _data);
    }

    function confirmClaim(
        bytes32 _bpKey,
        uint256 _claimId,
        bytes calldata _data
    ) external returns (uint256 _payoutId) {
        IStakeController stake = getStakeContract();
        require(
            stake.getClaim(_bpKey, _claimId).state ==
            IStake.ClaimState.Applied,
            "ERROR:SFD-003:INVALID_CLAIM_STATE"
        );

        stake.setClaimState(_bpKey, _claimId, IStake.ClaimState.Confirmed);

        _payoutId = stake.createPayout(_bpKey, _claimId, _data);
    }

    function declineClaim(bytes32 _bpKey, uint256 _claimId) external {
        IStakeController stake = getStakeContract();
        require(
            stake.getClaim(_bpKey, _claimId).state ==
            IStake.ClaimState.Applied,
            "ERROR:SFD-004:INVALID_CLAIM_STATE"
        );

        stake.setClaimState(_bpKey, _claimId, IStake.ClaimState.Declined);
    }

    function expire(bytes32 _bpKey) external {
        IStakeController stake = getStakeContract();
        require(
            stake.getStake(_bpKey).state == IStake.StakeState.Active,
            "ERROR:SFD-005:INVALID_STAKE_STATE"
        );

        stake.setStakeState(_bpKey, IStake.StakeState.Expired);
    }

    function payout(
        bytes32 _bpKey,
        uint256 _payoutId,
        bool _complete,
        bytes calldata _data
    ) external {
        getStakeContract().payOut(_bpKey, _payoutId, _complete, _data);
    }

    function proposePool(bytes32 _poolName, bytes32 _stakeFlow)
    external
    returns (uint256 _poolId)
    {
        _poolId = getPoolContract().proposePool(
            _poolName,
            msg.sender,
            _stakeFlow
        );
    }

    function request(
        bytes32 _bpKey,
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callbackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId) {
        _requestId = getQueryContract().request(
            _bpKey,
            _input,
            _callbackMethodName,
            _callbackContractAddress,
            _oracleTypeName,
            _responsibleOracleId
        );
    }

    function getApplicationData(bytes32 _bpKey)
        external
        view
        returns (bytes memory _data)
    {
        IStakeController stake = getStakeContract();
        return stake.getApplication(_bpKey).data;
    }

    function getClaimData(bytes32 _bpKey, uint256 _claimId)
        external
        view
        returns (bytes memory _data)
    {
        IStakeController stake = getStakeContract();
        return stake.getClaim(_bpKey, _claimId).data;
    }

    function getPayoutData(bytes32 _bpKey, uint256 _payoutId)
        external
        view
        returns (bytes memory _data)
    {
        IStakeController stake = getStakeContract();
        return stake.getPayout(_bpKey, _payoutId).data;
    }

    function getPoolContract() internal view returns (IPoolController) {
        return IPoolController(getContract("Pool"));
    }

    function getStakeContract() internal view returns (IStakeController) {
        return IStakeController(getContract("Stake"));
    }

}
