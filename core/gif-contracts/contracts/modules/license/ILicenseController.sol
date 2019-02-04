pragma solidity 0.5.2;

interface ILicenseController {
    function register(bytes32 _name, address _addr, bytes32 _policyFlow)
        external
        returns (uint256 _registrationId);

    function declineRegistration(uint256 _registrationId) external;

    function approveRegistration(uint256 _registrationId)
        external
        returns (uint256 _productId);

    function disapproveProduct(uint256 _productId) external;

    function reapproveProduct(uint256 _productId) external;

    function pauseProduct(uint256 _productId) external;

    function unpauseProduct(uint256 _productId) external;

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
