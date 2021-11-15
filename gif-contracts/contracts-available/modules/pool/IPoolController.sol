// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.6.11;

contract IPoolController {
    function proposePool(
        bytes32 _name,
        address _poolContract,
        bytes32 _poolFlow
    ) external returns (uint256 _id);

    function approvePool(uint256 _id) external;

    function pausePool(uint256 _id) external;

    function disapprovePool(uint256 _id) external;

    function isApprovedPool(uint256 _id)
    external
    view
    returns (bool _approved);

    function isPausedPool(uint256 _id) external view returns (bool _paused);

    function isValidCall(uint256 _id) external view returns (bool _valid);

    function authorize(address _sender)
    external
    view
    returns (bool _authorized, address _poolFlow);

    function getPoolId(address _addr)
    external
    view
    returns (uint256 _poolId);}
