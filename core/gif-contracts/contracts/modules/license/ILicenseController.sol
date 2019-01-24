pragma solidity 0.5.2;


interface ILicenseController {

    function register(bytes32 _name, address _addr, bytes32 _policyFlow) external returns (uint256 _registrationId);

    function declineRegistration(uint256 _registrationId) external;

    function approveRegistration(uint256 _registrationId) external returns (uint256 _applicationId);

    function disapproveInsuranceApplication(uint256 _applicationId)
    external;

    function reapproveInsuranceApplication(uint256 _applicationId) external;

    function pauseInsuranceApplication(uint256 _applicationId) external;

    function unpauseInsuranceApplication(uint256 _applicationId) external;

    function isApproved(address _addr) external view returns (bool _approved);

    function isPaused(address _addr) external view returns (bool _paused);

    function isValidCall(address _addr) external view returns (bool _valid);

    function authorize(address _sender) external view returns (bool _authorized, address _policyFlow);

    function getInsuranceApplicationId(address _addr) external view returns (uint256 _insuranceApplicationId);
}
