// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.0;

/// @title ERC-1523 Insurance Policy Standard, optional policy metadata extension
/// @dev See ...
///  Note: the ERC-165 identifier for this interface is 0x5a04be32
interface ERC1523PolicyMetadata /* is ERC1523 */ {

    /// @notice Metadata string for a given property.
    /// Properties are identified via hash of their property path.
    /// e.g. the property "name" in the ERC721 Metadata JSON Schema has the path /properties/name
    /// and the property path hash is the keccak256() of this property path.
    /// this allows for efficient addressing of arbitrary properties, as the set of properties is potentially unlimited.
    /// @dev Throws if `_propertyPathHash` is not a valid property path hash.
    function policyMetadata(uint256 _tokenId, bytes32 _propertyPathHash) external view returns (string _property);

}
