pragma solidity >0.4.99 <0.6.0;

// import OracleBrokerBackend

contract OracleRegistry is OracleBrokerBackend {

    address paymentProcessorAddress;

    event OracleRegistered(bytes32 oracleType, address oracleAddress, uint oracleNumber);
    event OracleRemoved(bytes32 oracleType, address oracleAddress, uint oracleNumber)

    struct OracleEntry {
        address oracleAddress,
        uint stakeAmount,
        boolean active,
    }

    mapping(bytes32 => OracleEntry[]) registeredOracles;
    mapping(bytes32 => uint) responsibleOracleIndexes;

    constructor(
        address _paymentProcessor,
    ) public {
        // TODO: make register<interface> functions:
        // 1) save address,
        // 2) send self as brokerAddress to them / give it permissive role
        registerPaymentProcessor(_paymentProcessor);
    }

    function registerOracle(
        bytes32 _oracleType,
        address _oracleAddress
    ) public onlyBrokerFront {
        // Save

        // TODO: make a stake
        paymentProcessor.acceptOracleStake(
            _oracleStakeAddress,    //
            // STAKE_AMOUNT - configurable, predefined, voluntary on Oracle's behalf ?
        )

        emit OracleRegistered(/*...*/);
    }

    function removeOracle(
        bytes32 _oracleType,
        address _oracleAddress
    ) public onlyBrokerFront {
        // change 'active' param in the OracleEntry

        paymentProcessor.refundOracleStake(_oracleAddress); // transfer stake back

        emit OracleRemoved(/*...*/);
    }

    function nextResponsibleOracle(,
        address _oracleAddress
    ) public onlyBrokerFront returns(address) {
        // Increment the index in responsibleOracleIndexes and return the next oracleAddress
    }

}
