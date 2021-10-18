// SPDX-Pooense-Identifier: Apache-2.0
pragma solidity 0.8.0;

import "./PoolStorageModel.sol";
import "../../shared/ModuleController.sol";
import "../../shared/AccessModifiers.sol";

contract StakingController is
    PoolStorageModel,
    ModuleController
{
    bytes32 public constant NAME = "PoolController";

    constructor(address _registry) WithRegistry(_registry) {}

    /**
     * @dev Register new pool
     * _poolContract the address of the calling contract, i.e. the pool contract to register.
     */
    function proposePool(
        bytes32 _name,
        address _poolContract,
        bytes32 _poolFlow
    ) external returns (uint256 _poolId) {
        // todo: add restriction, allow only PoolOwners
        require(
            poolIdByAddress[_poolContract] == 0,
            "ERROR:POO-001:POOL_IS_ACTIVE"
        );

        poolCount += 1;
        _poolId = poolCount;
        poolIdByAddress[_poolContract] = _poolId;

        // todo: check required poolFlow existence

        pools[_poolId] = Pool(
            _name,
            _poolContract,
            _poolFlow,
            getRelease(),
            PoolState.Proposed
        );

        emit LogPoolProposed(
            _poolId,
            _name,
            _poolContract,
            _poolFlow
        );
    }

    function setPoolState(uint256 _id, PoolState _state) internal {
        require(
            pools[_id].poolContract != address(0),
            "ERROR:POO-001:POOL_DOES_NOT_EXIST"
        );
        pools[_id].state = _state;
        if (_state == PoolState.Approved) {
            poolIdByAddress[pools[_id].poolContract] = _id;
        }

        emit LogPoolSetState(_id, _state);
    }

    function approvePool(uint256 _id) external onlyInstanceOperator {
        setPoolState(_id, PoolState.Approved);
    }

    function pausePool(uint256 _id) external onlyInstanceOperator {
        setPoolState(_id, PoolState.Paused);
    }

    function disapprovePool(uint256 _id) external onlyInstanceOperator {
        setPoolState(_id, PoolState.Proposed);
    }

    /**
     * @dev Check if contract is approved pool
     */
    function isApprovedPool(uint256 _id)
    public
    view
    returns (bool _approved)
    {
        Pool storage pool = pools[_id];
        _approved =
        pool.state == PoolState.Approved ||
        pool.state == PoolState.Paused;
    }

    /**
     * @dev Check if contract is paused pool
     */
    function isPausedPool(uint256 _id) public view returns (bool _paused) {
        _paused = pools[_id].state == PoolState.Paused;
    }

    function isValidCall(uint256 _id) public view returns (bool _valid) {
        _valid = pools[_id].state != PoolState.Proposed;
    }

    function authorize(address _sender)
    public
    view
    returns (bool _authorized, address _poolFlow)
    {
        uint256 poolId = poolIdByAddress[_sender];
        _authorized = isValidCall(poolId);
        _poolFlow = getContractInRelease(
            pools[poolId].release,
            pools[poolId].poolFlow
        );
    }

    function getPoolId(address _poolContract)
    public
    view
    returns (uint256 _poolId)
    {
        require(
            poolIdByAddress[_poolContract] > 0,
            "ERROR:POO-002:POOL_NOT_APPROVED_OR_DOES_NOT_EXIST"
        );

        _poolId = poolIdByAddress[_poolContract];
    }



}
