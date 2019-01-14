pragma solidity >0.4.99 <0.6.0;

contract OracleTypeRegistry {
    enum TypeState { Proposed, Active, Deprecated }

    address owner; // TODO: control privileges

    struct OracleType {
        bytes32 callbackSignature,      // ex. '(uint8,uint256, boolean)'
        bytes32 inputFormat,            // ex.
        bytes32 description,
        unit16 responsePreparationPeriod,
        uint16 responseDeadlinePeriod,
        TypeState state,
    };
    mapping (bytes32 => OracleType) public types;

    constructor(
        //
    ) public {
        // TODO
    }

    // TODO
    function proposeOracleType(
        // oracle type data
    ) public {
        // save oracle type as Proposed
    }

    /* Optional method: update while the Type is still in Proposed state
    function updateOracleType(

    ) public {

    }
    */

    // TODO
    function activateOracleType(
        // oracle type id
    ) public onlyOwner {  // TODO: control privileges
        // transition oracle state to Active
    }

    // TODO
    function deprecateOracleType(
        // oracle type id
    ) public onlyOwner {  // TODO: control privileges
        // transition oracle state to Deprecated
    }

    function getOracleType(
        string _oracleTypeId,
    ) public returns(
        // TODO list public oracle type data
    ) {
        // return oracle type data
    }

    function validateForOracleRegistration(
        bytes32 _oracleType;
    ) public {
        require(!types[_oracleType].deprecated); // TODO: deprecation logic
    }

    function validateForOracleRemoval(
        bytes _oracleType,
        address _oracleStakeAddress
    ) public {
        /* ... */
    }

    modifier onlyOwner() {
        // authorization
        _;
    }
}
