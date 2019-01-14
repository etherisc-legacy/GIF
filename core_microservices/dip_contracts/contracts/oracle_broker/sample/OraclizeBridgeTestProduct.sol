pragma solidity >0.4.99 <0.6.0;

import '../OracleBrokerFront.sol';

contract OraclizeBridgeTestProduct {
    address oracleBrokerAddress;

    event TestProductResponseReceived(
        bytes32 internalId,
        string response
    );

    string result;
    bool resultReceived;

    constructor(address _oracleBrokerAddress) public {
        oracleBrokerAddress = _oracleBrokerAddress;
    }

    function makeRequest(string memory _url, string memory _lookup) public {
        bytes memory input = abi.encode(_url, _lookup);

        OracleBrokerFront(oracleBrokerAddress).makeRequest(
            'OraclizeGet',
            'internalId',
            input,
            address(this),
            'callbackFunction'
        );
    }

    function callbackFunction(bytes32 _internalId, bytes memory _packagedResult) public onlyOracleBroker returns(bool validResponse) {
        (string memory _result) = abi.decode(_packagedResult, (string));

        result = _result;
        resultReceived = true;

        emit TestProductResponseReceived(_internalId, _result);

        return(true);
    }

    function getResult() public returns(bool success, string memory value) {
        return(resultReceived, result);
    }

    modifier onlyOracleBroker() {
        require(msg.sender == oracleBrokerAddress);
        _;
    }
}
