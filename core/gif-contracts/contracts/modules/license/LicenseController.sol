pragma solidity 0.5.2;

import "./LicenseStorageModel.sol";
import "../../shared/ModuleController.sol";

contract LicenseController is LicenseStorageModel, ModuleController {
    bytes32 public constant NAME = "LicenseController";

    constructor(address _registry) public WithRegistry(_registry) {}

    /**
     * @dev Register new application
     */
    function register(bytes32 _name, address _addr, bytes32 _policyFlow)
        external
        returns (uint256 _registrationId)
    {
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
    function declineRegistration(uint256 _registrationId) external onlyDAO {
        require(
            registrations.length > _registrationId,
            "ERROR_INVALID_REGISTRATION_ID"
        ); // todo: check overflow

        Registration storage registration = registrations[_registrationId];
        registration.declined = true;

        emit LogRegistrationDeclined(_registrationId);
    }

    /**
     * @dev Approve registration and create new insurance application
     */
    function approveRegistration(uint256 _registrationId)
        external
        onlyDAO
        returns (uint256 _insuranceProductId)
    {
        require(
            registrations.length > _registrationId,
            "ERROR_INVALID_REGISTRATION_ID"
        ); // todo: check overflow

        _insuranceProductId = insuranceProducts.length++;

        InsuranceProduct storage newProduct = insuranceProducts[_insuranceProductId];
        newProduct.name = registrations[_registrationId].name;
        newProduct.addr = registrations[_registrationId].addr;
        newProduct.policyFlow = registrations[_registrationId].policyFlow;
        newProduct.release = registrations[_registrationId].release;
        newProduct.approved = true;

        insuranceProductIdByAddress[newProduct.addr] = _insuranceProductId;

        // create new erc721 token

        emit LogNewInsuranceProductApproved(
            newProduct.name,
            newProduct.addr,
            _insuranceProductId
        );
    }

    /**
     * @dev Disapprove insurance application once it was approved
     */
    function disapproveInsuranceProduct(uint256 _insuranceProductId)
        external
        onlyDAO
    {
        InsuranceProduct storage product = insuranceProducts[_insuranceProductId];

        require(product.approved == true, "ERROR_INVALID_APPROVE_STATUS");

        product.approved = false;

        emit LogInsuranceProductDisapproved(
            product.name,
            product.addr,
            _insuranceProductId
        );
    }

    /**
     * @dev Reapprove product once it was disapproved
     */
    function reapproveInsuranceProduct(uint256 _insuranceProductId)
        external
        onlyDAO
    {
        InsuranceProduct storage product = insuranceProducts[_insuranceProductId];

        require(product.approved == false, "ERROR_INVALID_APPROVE_STATUS");

        product.approved = true;

        emit LogInsuranceProductReapproved(
            product.name,
            product.addr,
            _insuranceProductId
        );
    }

    /**
     * @dev Pause insurance product
     */
    function pauseInsuranceProduct(uint256 _insuranceProductId)
        external
        onlyDAO
    {
        InsuranceProduct storage product = insuranceProducts[_insuranceProductId];

        require(product.paused == false, "ERROR_INVALID_PAUSED_STATUS");

        product.paused = true;

        emit LogInsuranceProductPaused(
            product.name,
            product.addr,
            _insuranceProductId
        );
    }

    /**
     * @dev Unpause insurance product
     */
    function unpauseInsuranceProduct(uint256 _insuranceProductId)
        external
        onlyDAO
    {
        InsuranceProduct storage product = insuranceProducts[_insuranceProductId];

        require(product.paused == true, "ERROR_INVALID_PAUSED_STATUS");

        product.paused = false;

        emit LogInsuranceProductUnpaused(
            product.name,
            product.addr,
            _insuranceProductId
        );
    }

    /**
     * @dev Check if contract is approved insurance product
     */
    function isApprovedInsuranceProduct(address _addr)
        public
        view
        returns (bool _approved)
    {
        _approved = insuranceProducts[insuranceProductIdByAddress[_addr]].approved == true;
    }

    /**
     * @dev Check if contract is paused insurance application
     */
    function isPausedInsuranceProduct(address _addr)
        public
        view
        returns (bool _paused)
    {
        _paused = insuranceProducts[insuranceProductIdByAddress[_addr]].paused == true;
    }

    function isValidCall(address _addr) public view returns (bool _valid) {
        _valid = isApprovedInsuranceProduct(_addr) && !isPausedInsuranceProduct(
            _addr
        );
    }

    function authorize(address _sender)
        public
        view
        returns (bool _authorized, address _policyFlow)
    {
        _authorized = isValidCall(_sender);
        _policyFlow = getContractInRelease(
            insuranceProducts[insuranceProductIdByAddress[_sender]].release,
            insuranceProducts[insuranceProductIdByAddress[_sender]].policyFlow
        );
    }

    function getInsuranceProductId(address _addr)
        public
        view
        returns (uint256 _insuranceProductId)
    {
        _insuranceProductId = insuranceProductIdByAddress[_addr];
    }
}
