pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./LicenseStorageModel.sol";
import "../../shared/ModuleController.sol";

contract LicenseController is LicenseStorageModel, ModuleController {
    bytes32 public constant NAME = "LicenseController";

    constructor(address _registry) WithRegistry(_registry) {}

    /**
     * @dev Register new product
     * _productContract the address of the calling contract, i.e. the product contract to register.
     */
    function proposeProduct(
        bytes32 _name,
        address _productContract,
        bytes32 _policyFlow
    ) external returns (uint256 _productId) {
        // todo: add restriction, allow only ProductOwners
        require(productIdByAddress[_productContract] == 0, "ERROR:LIC-001:PRODUCT_IS_ACTIVE");

        productCount += 1;
        _productId = productCount;
        productIdByAddress[_productContract] = _productId;

        // todo: check required policyFlow existence

        products[_productId] = Product(
            _name,
            _productContract,
            _policyFlow,
            getRelease(),
            ProductState.Proposed
        );

        emit LogProductProposed(_productId, _name, _productContract, _policyFlow);
    }

    function setProductState(uint256 _id, ProductState _state) internal {
        require(
            products[_id].productContract != address(0),
            "ERROR:LIC-001:PRODUCT_DOES_NOT_EXIST"
        );
        products[_id].state = _state;
        if (_state == ProductState.Approved) {
            productIdByAddress[products[_id].productContract] = _id;
        }

        emit LogProductSetState(
            _id,
            _state
        );
    }

    function approveProduct(uint256 _id) external onlyInstanceOperator {
        setProductState(_id, ProductState.Approved);
    }

    function pauseProduct(uint256 _id) external onlyInstanceOperator {
        setProductState(_id, ProductState.Paused);
    }

    function disapproveProduct(uint256 _id) external onlyInstanceOperator {
        setProductState(_id, ProductState.Proposed);
    }

    /**
     * @dev Check if contract is approved product
     */
    function isApprovedProduct(uint256 _id)
        public
        view
        returns (bool _approved)
    {
        Product storage product = products[_id];
        _approved =
            product.state == ProductState.Approved ||
            product.state == ProductState.Paused;
    }

    /**
     * @dev Check if contract is paused product
     */
    function isPausedProduct(uint256 _id) public view returns (bool _paused) {
        _paused = products[_id].state == ProductState.Paused;
    }

    function isValidCall(uint256 _id) public view returns (bool _valid) {
        _valid = products[_id].state != ProductState.Proposed;
    }

    function authorize(address _sender)
        public
        view
        returns (bool _authorized, address _policyFlow)
    {
        uint256 productId = productIdByAddress[_sender];
        _authorized = isValidCall(productId);
        _policyFlow = getContractInRelease(
            products[productId].release,
            products[productId].policyFlow
        );
    }

    function getProductId(address _productContract)
        public
        view
        returns (uint256 _productId)
    {
        require(
            productIdByAddress[_productContract] > 0,
            "ERROR:LIC-002:PRODUCT_NOT_APPROVED_OR_DOES_NOT_EXIST"
        );

        _productId = productIdByAddress[_productContract];
    }
}
