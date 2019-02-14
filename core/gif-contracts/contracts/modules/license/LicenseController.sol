pragma solidity 0.5.2;

import "./LicenseStorageModel.sol";
import "../../shared/ModuleController.sol";

contract LicenseController is LicenseStorageModel, ModuleController {
    bytes32 public constant NAME = "LicenseController";

    constructor(address _registry) public WithRegistry(_registry) {}

    /**
     * @dev Register new product
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
     * @dev Decline new product registration
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
     * @dev Approve registration and create new product
     */
    function approveRegistration(uint256 _registrationId)
        external
        onlyDAO
        returns (uint256 _productId)
    {
        require(
            registrations.length > _registrationId,
            "ERROR_INVALID_REGISTRATION_ID"
        ); // todo: check overflow

        _productId = products.length++;

        Product storage newProduct = products[_productId];
        newProduct.name = registrations[_registrationId].name;
        newProduct.addr = registrations[_registrationId].addr;
        newProduct.policyFlow = registrations[_registrationId].policyFlow;
        newProduct.release = registrations[_registrationId].release;
        newProduct.approved = true;

        productIdByAddress[newProduct.addr] = _productId;

        // create new erc721 token

        emit LogNewProductApproved(
            newProduct.name,
            newProduct.addr,
            _productId
        );
    }

    /**
     * @dev Disapprove product once it was approved
     */
    function disapproveProduct(uint256 _productId) external onlyDAO {
        Product storage product = products[_productId];

        require(product.approved == true, "ERROR_INVALID_APPROVE_STATUS");

        product.approved = false;

        emit LogProductDisapproved(product.name, product.addr, _productId);
    }

    /**
     * @dev Reapprove product once it was disapproved
     */
    function reapproveProduct(uint256 _productId) external onlyDAO {
        Product storage product = products[_productId];

        require(product.approved == false, "ERROR_INVALID_APPROVE_STATUS");

        product.approved = true;

        emit LogProductReapproved(product.name, product.addr, _productId);
    }

    /**
     * @dev Pause product
     */
    function pauseProduct(uint256 _productId) external onlyDAO {
        Product storage product = products[_productId];

        require(product.paused == false, "ERROR_INVALID_PAUSED_STATUS");

        product.paused = true;

        emit LogProductPaused(product.name, product.addr, _productId);
    }

    /**
     * @dev Unpause product
     */
    function unpauseProduct(uint256 _productId) external onlyDAO {
        Product storage product = products[_productId];

        require(product.paused == true, "ERROR_INVALID_PAUSED_STATUS");

        product.paused = false;

        emit LogProductUnpaused(product.name, product.addr, _productId);
    }

    /**
     * @dev Check if contract is approved product
     */
    function isApprovedProduct(address _addr)
        public
        view
        returns (bool _approved)
    {
        _approved = products[productIdByAddress[_addr]].approved == true;
    }

    /**
     * @dev Check if contract is paused product
     */
    function isPausedProduct(address _addr) public view returns (bool _paused) {
        _paused = products[productIdByAddress[_addr]].paused == true;
    }

    function isValidCall(address _addr) public view returns (bool _valid) {
        _valid = isApprovedProduct(_addr) && !isPausedProduct(_addr);
    }

    function authorize(address _sender)
        public
        view
        returns (bool _authorized, address _policyFlow)
    {
        _authorized = isValidCall(_sender);
        _policyFlow = getContractInRelease(
            products[productIdByAddress[_sender]].release,
            products[productIdByAddress[_sender]].policyFlow
        );
    }

    function getProductId(address _addr)
        public
        view
        returns (uint256 _productId)
    {
        _productId = productIdByAddress[_addr];
    }
}
