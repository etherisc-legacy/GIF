pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

interface ILicenseController {
    function register(bytes32 _name, address _addr, bytes32 _policyFlow)
        external
        returns (uint256 _id);

    function setProductApproved(uint256 _id, bool _approved) external;
    function setProductPaused(uint256 _id, bool _paused) external;

    function isApprovedProduct(address _addr)
        external
        view
        returns (bool _approved);

    function isPausedProduct(address _addr)
        external
        view
        returns (bool _paused);

    function isValidCall(address _addr) external view returns (bool _valid);

    function authorize(address _sender)
        external
        view
        returns (bool _authorized, address _policyFlow);

    function getProductId(address _addr)
        external
        view
        returns (uint256 _productId);
}
