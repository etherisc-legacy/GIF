pragma solidity 0.8.0;

// SPDX-License-Identifier: Apache-2.0

abstract contract AccessModifiers {
    modifier onlyInstanceOperator() {
        require(
            msg.sender == getContract("InstanceOperator"),
            "ERROR::NOT_INSTANCE_OPERATOR"
        );
        _;
    }

    modifier onlyPolicyFlow(bytes32 _module) {
        // Allow only from delegator
        require(address(this) == getContract(_module), "ERROR::NOT_ON_STORAGE");

        // Allow only ProductService (it delegates to PolicyFlow)
        require(
            msg.sender == getContract("ProductService"),
            "ERROR::NOT_PRODUCT_SERVICE"
        );
        _;
    }

    modifier onlyOracleService() {
        require(
            msg.sender == getContract("OracleService"),
            "ERROR::NOT_ORACLE_SERVICE"
        );
        _;
    }

    modifier onlyOracleOwner() {
        require(
            msg.sender == getContract("OracleOwnerService"),
            "ERROR::NOT_ORACLE_OWNER"
        );
        _;
    }

    modifier onlyProductOwner() {
        require(
            msg.sender == getContract("ProductOwnerService"),
            "ERROR::NOT_PRODUCT_OWNER"
        );
        _;
    }

    function getContract(bytes32 _contractName)
        public
        view
        virtual
        returns (address _addr);

}
