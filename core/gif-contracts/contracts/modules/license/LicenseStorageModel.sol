pragma solidity 0.5.2;

import "./ILicense.sol";

contract LicenseStorageModel is ILicense {
    mapping(uint256 => Product) public products;
    mapping(address => uint256) public productIdByAddress;
    uint256 public productIdIncrement;

    // todo: Add list of approved products
    // todo: Add list of products for approval

}
