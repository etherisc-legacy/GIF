pragma solidity 0.8.0;

// SPDX-License-Identifier: Apache-2.0

interface IStake {

    event LogStakeDeposit(bytes32 bpKey);
    event LogStakeWithdraw(bytes32 bpKey);

    event LogStakeStateChanged(bytes32 bpKey, StakeState state);

    // Statuses
    enum StakeFlowState {Started, Paused, Finished}
    enum StakeState {deposited, active, withdrawn}

    struct Stake {
        StakeState state;
        uint256 createdAt;
        uint256 updatedAt;
    }

}
