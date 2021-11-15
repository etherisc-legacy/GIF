pragma solidity 0.8.0;

// SPDX-License-Identifier: Apache-2.0

interface ILicenseController {
    function proposeProduct(
        bytes32 _name,
        address _productContract,
        bytes32 _policyFlow
    ) external returns (uint256 _id);

    function approveProduct(uint256 _id) external;

    function pauseProduct(uint256 _id) external;

    function disapproveProduct(uint256 _id) external;

    function isApprovedProduct(uint256 _id)
        external
        view
        returns (bool _approved);

    function isPausedProduct(uint256 _id) external view returns (bool _paused);

    function isValidCall(uint256 _id) external view returns (bool _valid);

    function authorize(address _sender)
        external
        view
        returns (bool _authorized, address _policyFlow);

    function getProductId(address _addr)
        external
        view
        returns (uint256 _productId);
}
