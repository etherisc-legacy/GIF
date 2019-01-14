pragma solidity >0.4.99 <0.6.0;

import './libraries/OracleBrokerBackend.sol';
// import OraclePaymentProcessor

contract OracleRegistry is OracleBrokerBackend {
    enum OracleState { Unknown, Active, Inactive }

    //address paymentProcessorAddress;

    event OracleRegistered(string oracleType, address oracleAddress, uint oracleNumber);
    event OracleRemoved(string oracleType, address oracleAddress, uint oracleNumber);

    struct OracleEntry {
        uint index;
        //uint stakeAmount;
        OracleState state;
    }

    // OracleType => list of addresses
    mapping(string => address[]) registeredOraclesIndex;
    // OracleType => (oracle address => oracle entry)
    mapping(string => mapping(address => OracleEntry)) registeredOracles;
    // OracleType => numberOfActiveOracles
    mapping(string => uint) activeOraclesCount;

    // mapping(string => uint) responsibleOracleIndexes;

    constructor(
        //address _paymentProcessor,
        address _frontAddress
    ) public OracleBrokerBackend(_frontAddress) {
        // TODO: make register<interface> functions:
        // 1) save address,
        // 2) send self as brokerAddress to them / give it permissive role
        // registerPaymentProcessor(_paymentProcessor);
    }

    function registerOracle(
        string memory _oracleType,
        address _oracleAddress
    ) public onlyBrokerFront {
        // TODO: Require _oracleAddress implements Oracle Interface?

        require(registeredOracles[_oracleType][_oracleAddress].state == OracleState.Unknown);

        uint newIndex = registeredOraclesIndex[_oracleType].length;

        registeredOraclesIndex[_oracleType].push(_oracleAddress);
        registeredOracles[_oracleType][_oracleAddress] = OracleEntry(newIndex, OracleState.Active);
        activeOraclesCount[_oracleType]++;

        // TODO: make a stake
        /*
        paymentProcessor.acceptOracleStake(
            _oracleStakeAddress,    //
            // STAKE_AMOUNT - configurable, predefined, voluntary on Oracle's behalf ?
        )
        */

       emit OracleRegistered(_oracleType, _oracleAddress, activeOraclesCount[_oracleType]);
    }

    function removeOracle(
        string memory _oracleType,
        address _oracleAddress
    ) public onlyBrokerFront {
        require(registeredOracles[_oracleType][_oracleAddress].state == OracleState.Active);

        // paymentProcessor.refundOracleStake(_oracleAddress); // transfer stake back

        registeredOracles[_oracleType][_oracleAddress].state = OracleState.Inactive;
        activeOraclesCount[_oracleType]--;

        emit OracleRemoved(_oracleType, _oracleAddress, activeOraclesCount[_oracleType]);
    }

    function getOraclesCount(
        string memory _oracleType
    ) public view returns(uint active, uint total) {
        return (activeOraclesCount[_oracleType], registeredOraclesIndex[_oracleType].length);
    }

    function getOracles(
        string memory _oracleType
    ) public view returns(address[] memory) {
        return registeredOraclesIndex[_oracleType];
    }

    function getOracleInfo(
        string memory _oracleType,
        address _oracleAddress
    ) public view returns(OracleState state, address oracleAddress) {
        OracleEntry memory oracle = registeredOracles[_oracleType][_oracleAddress];
        return(oracle.state, _oracleAddress);
    }

    function getOracleInfoByIndex(
        string memory _oracleType,
        uint _index
    ) public view returns(OracleState state, address oracleAddress) {
        oracleAddress = registeredOraclesIndex[_oracleType][_index];
        OracleEntry memory oracle = registeredOracles[_oracleType][oracleAddress];
        return(oracle.state, oracleAddress);
    }

    /*
    function nextResponsibleOracle(,
        string _oracleType
    ) public onlyBrokerFront returns(address) {
        // Increment the index in responsibleOracleIndexes and return the next oracleAddress
    }
    */

}
