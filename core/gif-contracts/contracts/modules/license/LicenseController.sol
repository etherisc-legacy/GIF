pragma solidity 0.5.2;

import "./LicenseStorageModel.sol";
import "../../shared/ModuleController.sol";


contract LicenseController is LicenceStorageModel, ModuleController {

    bytes32 public constant NAME = "LicenseController";

    constructor(address _registry) public WithRegistry(_registry) {}

    /**
     * @dev Register new application
     */
    function register(bytes32 _name, address _addr, bytes32 _policyFlow) external returns (uint256 _registrationId) {
        _registrationId = registrations.length++;

        Registration storage newRegistration = registrations[_registrationId];
        newRegistration.name = _name;
        newRegistration.addr = _addr;
        newRegistration.policyFlow = _policyFlow;
        newRegistration.release = getRelease();
        newRegistration.declined = true;

        emit LogNewRegistration(_registrationId, _name, _addr);
    }

    /**
     * @dev Decline new application registration
     */
    function declineRegistration(uint256 _registrationId)
    external onlyDAO {
        require(registrations.length > _registrationId, "ERROR_INVALID_REGISTRATION_ID"); // todo: check overflow

        Registration storage registration = registrations[_registrationId];
        registration.declined = true;

        emit LogRegistrationDeclined(_registrationId);
    }

    /**
     * @dev Approve registration and create new insurance application
     */
    function approveRegistration(uint256 _registrationId)
    external onlyDAO returns (uint256 _applicationId) {
        require(registrations.length > _registrationId, "ERROR_INVALID_REGISTRATION_ID"); // todo: check overflow

        _applicationId = insuranceApplications.length++;

        InsuranceApplication storage newApplication = insuranceApplications[_applicationId];
        newApplication.name = registrations[_registrationId].name;
        newApplication.addr = registrations[_registrationId].addr;
        newApplication.policyFlow = registrations[_registrationId].policyFlow;
        newApplication.release = registrations[_registrationId].release;
        newApplication.approved = true;

        insuranceApplicationIdByAddress[newApplication.addr] = _applicationId;

        // create new erc721 token

        emit LogNewApplicationApproved(newApplication.name, newApplication.addr, _applicationId);
    }

    /**
     * @dev Disapprove insurance application once it was approved
     */
    function disapproveInsuranceApplication(uint256 _applicationId)
    external onlyDAO {
        InsuranceApplication storage application = insuranceApplications[_applicationId];

        require(application.approved == true, "ERROR_INVALID_APPROVE_STATUS");

        application.approved = false;

        emit LogApplicationDisapproved(application.name, application.addr, _applicationId);
    }

    /**
     * @dev Reapprove application once it was disapproved
     */
    function reapproveInsuranceApplication(uint256 _applicationId)
    external onlyDAO {
        InsuranceApplication storage application = insuranceApplications[_applicationId];

        require(application.approved == false, "ERROR_INVALID_APPROVE_STATUS");

        application.approved = true;

        emit LogApplicationReapproved(application.name, application.addr, _applicationId);
    }

    /**
     * @dev Pause application
     */
    function pauseInsuranceApplication(uint256 _applicationId)
    external onlyDAO {
        InsuranceApplication storage application = insuranceApplications[_applicationId];

        require(application.paused == false, "ERROR_INVALID_PAUSED_STATUS");

        application.paused = true;

        emit LogApplicationPaused(application.name, application.addr, _applicationId);
    }

    /**
     * @dev Unpause application
     */
    function unpauseInsuranceApplication(uint256 _applicationId)
    external onlyDAO {
        InsuranceApplication storage application = insuranceApplications[_applicationId];

        require(application.paused == true, "ERROR_INVALID_PAUSED_STATUS");

        application.paused = false;

        emit LogApplicationUnpaused(application.name, application.addr, _applicationId);
    }

    /**
     * @dev Check if contract is approved insurance application
     */
    function isApprovedInsuranceApplication(address _addr) public view returns (bool _approved) {
        _approved = insuranceApplications[insuranceApplicationIdByAddress[_addr]].approved == true;
    }

    /**
     * @dev Check if contract is paused insurance application
     */
    function isPausedInsuranceApplication(address _addr) public view returns (bool _paused) {
        _paused = insuranceApplications[insuranceApplicationIdByAddress[_addr]].paused == true;
    }

    function isValidCall(address _addr) public view returns (bool _valid) {
        _valid = isApprovedInsuranceApplication(_addr) && !isPausedInsuranceApplication(_addr);
    }

    function authorize(address _sender) public view returns (bool _authorized, address _policyFlow) {
        _authorized = isValidCall(_sender);
        _policyFlow = getContractInRelease(
            insuranceApplications[insuranceApplicationIdByAddress[_sender]].release,
            insuranceApplications[insuranceApplicationIdByAddress[_sender]].policyFlow
        );
    }

    function getInsuranceApplicationId(address _addr) public view returns (uint256 _insuranceApplicationId) {
        _insuranceApplicationId = insuranceApplicationIdByAddress[_addr];
    }
}
