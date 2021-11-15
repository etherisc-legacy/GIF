// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.6.11;

contract IPool {
    enum PoolState {Proposed, Approved, Paused}

    event LogPoolProposed(
        uint256 poolId,
        bytes32 name,
        address poolContract,
        bytes32 poolFlow
    );

    event LogPoolSetState(uint256 poolId, PoolState state);

    struct Pool {
        bytes32 name;
        address poolContract;
        bytes32 poolFlow;
        bytes32 release;
        PoolState state;
    }

}
