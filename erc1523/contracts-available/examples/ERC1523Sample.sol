// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.0;

import "../IERC1523.sol";
import "../IERC1523PolicyMetadata.sol";

contract ERC1523Sample is ERC1523, ERC1523PolicyMetadata {
    constructor () {}

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
        interfaceId == type(ERC1523).interfaceId ||
        interfaceId == type(ERC1523PolicyMetadata).interfaceId ||
        super.supportsInterface(interfaceId);
    }

}
