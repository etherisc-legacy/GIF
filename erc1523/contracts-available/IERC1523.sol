// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/IERC721Enumerable.sol";


/// @title ERC-1523 Insurance Policy Standard
///  Note: the ERC-165 identifier for this interface is 0x5a04be32
interface ERC1523 is ERC721, IERC721Metadata, IERC721Enumerable {

}
