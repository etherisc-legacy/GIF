pragma solidity 0.5.2;


contract AccessModifiers {

    modifier onlyDAO() {
        require(msg.sender == getService("DAO"), "ERROR::NOT_DAO_SERVICE");
        _;
    }

    modifier onlyPolicyFlow(bytes32 _module) {
        // Allow only from delegator
        require(address(this) == getContract(_module), "ERROR::NOT_ON_STORAGE");

        // Allow only FrontController (it delegates to PolicyFlow)
        require(msg.sender == getContract("ProductController"), "ERROR::NOT_FRONT_CONTROLLER");
        _;
    }

    function getContract(bytes32 _contractName) public view returns (address _addr);

    function getService(bytes32 _contractName) public view returns (address _addr);
}
