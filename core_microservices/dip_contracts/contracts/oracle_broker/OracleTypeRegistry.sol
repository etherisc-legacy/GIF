pragma solidity >0.4.99 <0.6.0;

import './libraries/OracleBrokerBackend.sol';
import './libraries/CustomOracleTypeLogic.sol';

contract OracleTypeRegistry is OracleBrokerBackend {
    enum TypeState { Unknown, Proposed, Active, Deprecated }

    struct OracleType {
        string callbackSignature;      // ex. '(uint8,uint256, boolean)'
        string inputFormat;            // ex.
        string description;
        TypeState state;
        address customLogicContract;
        bool usesCustomLogic;
    }
    mapping (string => OracleType) types;
    mapping (string => bool) typesInitialized;

    event OracleTypeProposed(string oracleTypeId);
    event OracleTypeActivated(string oracleTypeId, bool usesCustomLogic);
    event OracleTypeDeprecated(string oracleTypeId);

    constructor(
        address _frontAddress
    ) public OracleBrokerBackend(_frontAddress) {
        //
    }

    function proposeOracleType(
        string memory _oracleTypeId,
        string memory _callbackSignature,
        string memory _inputFormat,
        string memory _description,
        address _customTypeLogicAddress
    ) public onlyBrokerFront {
        require(!typesInitialized[_oracleTypeId]);

        bool usesCustomLogic = false;

        if (_customTypeLogicAddress != address(0)) {
            require(CustomOracleTypeLogic(_customTypeLogicAddress).isCustomOracleType());
            usesCustomLogic = true;
        }

        types[_oracleTypeId] = OracleType(
            _callbackSignature,
            _inputFormat,
            _description,
            TypeState.Proposed,
            _customTypeLogicAddress,
            usesCustomLogic
        );
        typesInitialized[_oracleTypeId] = true;

        emit OracleTypeProposed(_oracleTypeId);
}

    function getOracleType(
        string memory _oracleTypeId
    ) public view returns(
        bool typeExists,
        string memory callbackSignature,
        string memory inputFormat,
        string memory description,
        TypeState state,
        address customLogicContract
    ) {
        OracleType memory oracleType = types[_oracleTypeId];

        return (
            typesInitialized[_oracleTypeId],
            oracleType.callbackSignature,
            oracleType.inputFormat,
            oracleType.description,
            oracleType.state,
            oracleType.customLogicContract
        );
    }

    // TODO
    /* Optional method: update while the Type is still in Proposed state
    function updateOracleType(

    ) public {

    }
    */

    function activateOracleType(
        string memory _oracleTypeId
    ) public onlyOwner {  // TODO: control privileges
        require(typesInitialized[_oracleTypeId]);

        OracleType memory oracleType = types[_oracleTypeId];
        require(oracleType.state == TypeState.Proposed);

        oracleType.state = TypeState.Active;
        types[_oracleTypeId] = oracleType;

        emit OracleTypeActivated(_oracleTypeId, oracleType.usesCustomLogic);
    }

    function deprecateOracleType(
        string memory _oracleTypeId
    ) public onlyOwner {
        require(typesInitialized[_oracleTypeId]);

        OracleType memory oracleType = types[_oracleTypeId];
        require(oracleType.state == TypeState.Active);

        oracleType.state = TypeState.Deprecated;
        types[_oracleTypeId] = oracleType;

        emit OracleTypeDeprecated(_oracleTypeId);
    }

    function validateForOracleRegistration(
        string memory _oracleType,
        address _oracleAddress
    ) public view returns(bool) {
        bool validated = (types[_oracleType].state == TypeState.Active);
        if (
            validated &&
            types[_oracleType].usesCustomLogic &&
            customLogic(_oracleType).implementsOracleRegistration()
        ) {
            validated = customLogic(_oracleType).validateOracleRegistration(_oracleAddress);
        }
        return(validated);
    }

    /*
    function validateForOracleRemoval(
        string _oracleType,
        address _oracleStakeAddress
    ) public view retunrs(bool) {

    }
    */

    function customLogic(
        string memory _oracleType
    ) internal view returns(CustomOracleTypeLogic) {
        return CustomOracleTypeLogic(types[_oracleType].customLogicContract);
    }
}
