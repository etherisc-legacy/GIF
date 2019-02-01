pragma solidity 0.5.2;

interface ILicenseController {
    function register(bytes32 _name, address _addr, bytes32 _policyFlow)
        external
        returns (uint256 _registrationId);

    function declineRegistration(uint256 _registrationId) external;

    function approveRegistration(uint256 _registrationId)
        external
        returns (uint256 _insuranceProductId);

    function disapproveInsuranceProduct(uint256 _insuranceProductId) external;

    function reapproveInsuranceProduct(uint256 _insuranceProductId) external;

    function pauseInsuranceProduct(uint256 _insuranceProductId) external;

    function unpauseInsuranceProduct(uint256 _insuranceProductId) external;

    function isApprovedInsuranceProduct(address _addr)
        external
        view
        returns (bool _approved);

    function isPausedInsuranceProduct(address _addr)
        external
        view
        returns (bool _paused);

    function isValidCall(address _addr) external view returns (bool _valid);

    function authorize(address _sender)
        external
        view
        returns (bool _authorized, address _policyFlow);

    function getInsuranceProductId(address _addr)
        external
        view
        returns (uint256 _insuranceProductId);
}
