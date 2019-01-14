pragma solidity >0.4.99 <0.6.0;

// import OracleBrokerFront interface

contract OracleTypeCreator {

    constructor(address _brokerFrontAddress) {
        OracleBrokerFront brokerFront = OracleBrokerFront(_brokerFrontAddress);

        brokerFront.proposeOracleType(
            'HttpGet',  // ID
            '(bytes)',             // callbackSignature,
            'uri:<string>',        // bytes32 inputFormat,
            'Simple oracle that makes a request to provided URL and returns a response',
                    // bytes32 description,
             180,   // uint16 responsePreparationPeriod in seconds,
             3000   // uint16 responseDeadlinePeriod in seconds,
        );
        brokerFront.activateOracleType('HttpGet');



        brokerFront.proposeOracleType(
            'HttpGetWithConfirmation',  // ID
            '(bytes, bytes)',      // callbackSignature, first is for response, second is for confirmation
            'uri:<string>',        // bytes32 inputFormat,
            'Simple oracle that makes a request to provided URL and returns a response, but provides a confirmation as well',
                // bytes32 description,
            360,   // uint16 responsePreparationPeriod in seconds,
            3000   // uint16 responseDeadlinePeriod in seconds,
        );
        brokerFront.activateOracleType('HttpGetWithConfirmation');



        brokerFront.proposeOracleType(
            'FlightStats.Rating.v1',
            '(uint,uint,uint,uint,uint,uint,bytes)',      // callbackSignature, ['observations','late15','late30','late45','cancelled','diverted','arrivalAirportFsCode']
            'carrierFlightNumber:<string>',               // bytes32 inputFormat
            'Specialized Oracle for FlightStats ratings',
            360,
            3000
        );
        brokerFront.activateOracleType('FlightStats.Rating.v1');
    }
}
