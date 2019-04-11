pragma solidity 0.5.2;

import "../../Oracle.sol";
import "./oraclizeAPI.sol";
import "./strings.sol";

contract FlightStatusesOracle is Oracle, usingOraclize {
    using strings for *;

    modifier onlyOraclize {
        require(msg.sender == oraclize_cbAddress());
        _;
    }

    event OraclizeRequested(
        uint256 requestId,
        bytes32 queryId,
        uint256 time,
        string url
    );

    event OraclizeResponded(
        uint256 requestId,
        bytes32 queryId,
        string result,
        bytes proof
    );

    bool public testMode = false;

    string private encryptedQuery;

    // flight status api is v2, see https://developer.flightstats.com/api-docs/flightstatus/v2/flight
    string constant ORACLIZE_STATUS_BASE_URL_TEST = "[URL] json(https://flight-delay-testing-api-zxxtusurtb.now.sh/flex/flightstatus/rest/v2/json/flight/status/";
    string constant ORACLIZE_STATUS_BASE_URL = "[URL] json(https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/";
    string constant ORACLIZE_STATUS_QUERY = "utc=true).flightStatuses[0]['status','delays','operationalTimes']";

    uint256 public oraclizeGas = 1500000;

    mapping(bytes32 => uint256) public requests;

    constructor(address _oracleController, string memory _encryptedQuery)
        public
        payable
        Oracle(_oracleController)
    {
        encryptedQuery = _encryptedQuery;
    }

    function() external payable {}

    function setTestMode(bool _testMode) external {
        // todo: set permissions
        testMode = _testMode;
    }

    function setOraclizeGas(uint256 _oraclizeGas) external {
        // todo: set permissions
        oraclizeGas = _oraclizeGas;
    }

    function request(uint256 _requestId, bytes calldata _input) external {
        // todo: set permissions

        (uint256 oraclizeTime, bytes32 carrierFlightNumber, bytes32 departureYearMonthDay) = abi.decode(
            _input,
            (uint256, bytes32, bytes32)
        );

        string memory oraclizeUrl = getOraclizeUrl(
            carrierFlightNumber,
            departureYearMonthDay
        );

        bytes32 queryId = oraclize_query(
            testMode == true ? 0 : oraclizeTime,
            "nested",
            oraclizeUrl,
            oraclizeGas
        );

        requests[queryId] = _requestId;

        emit OraclizeRequested(_requestId, queryId, oraclizeTime, oraclizeUrl);
    }

    function __callback(
        bytes32 _queryId,
        string memory _result,
        bytes memory _proof
    ) public onlyOraclize {
        uint256 requestId = requests[_queryId];

        strings.slice memory slResult = _result.toSlice();

        // todo: add implementation
        slResult.find("\"".toSlice()).beyond("\"".toSlice());
        slResult.until(slResult.copy().find("\"".toSlice()));
        bytes1 status = bytes(slResult.toString())[0]; // s = L

        if (status == "C") {
            // flight cancelled
            _respond(requestId, abi.encode(status, -1));
        } else if (status == "D") {
            // flight diverted
            _respond(requestId, abi.encode(status, -1));
        } else if (status != "L" && status != "A" && status != "C" && status != "D") {
            // Unprocessable status;
            _respond(requestId, abi.encode(status, -1));
        } else {
            slResult = _result.toSlice();
            bool arrived = slResult.contains("actualGateArrival".toSlice());

            if (status == "A" || (status == "L" && !arrived)) {
                // flight still active or not at gate
                _respond(requestId, abi.encode(bytes1("A"), -1));
            } else if (status == "L" && arrived) {
                strings.slice memory aG = "\"arrivalGateDelayMinutes\": ".toSlice(

                );

                uint256 delayInMinutes;

                if (slResult.contains(aG)) {
                    slResult.find(aG).beyond(aG);
                    slResult.until(
                        slResult.copy().find("\"".toSlice()).beyond(
                            "\"".toSlice()
                        )
                    );
                    // truffle bug, replace by "}" as soon as it is fixed.
                    slResult.until(slResult.copy().find("\x7D".toSlice()));
                    slResult.until(slResult.copy().find(",".toSlice()));
                    delayInMinutes = parseInt(slResult.toString());
                } else {
                    delayInMinutes = 0;
                }

                _respond(requestId, abi.encode(status, delayInMinutes));
            } else {
                // no delay info
                _respond(requestId, abi.encode(status, -1));
            }

        }

        emit OraclizeResponded(requestId, _queryId, _result, _proof);
    }

    function getOraclizeUrl(
        bytes32 _carrierFlightNumber,
        bytes32 _departureYearMonthDay
    ) public view returns (string memory _oraclizeUrl) {
        string memory url;

        if (testMode == true) {
            url = strConcat(
                ORACLIZE_STATUS_BASE_URL_TEST,
                b32toString(_carrierFlightNumber),
                strConcat("/dep/", b32toString(_departureYearMonthDay)),
                "?",
                ORACLIZE_STATUS_QUERY
            );
        } else {
            url = strConcat(
                ORACLIZE_STATUS_BASE_URL,
                b32toString(_carrierFlightNumber),
                strConcat("/dep/", b32toString(_departureYearMonthDay)),
                strConcat("?${[decrypt] ", encryptedQuery, "}&"),
                ORACLIZE_STATUS_QUERY
            );
        }

        _oraclizeUrl = url;
    }

    function b32toString(bytes32 x) internal pure returns (string memory) {
        // gas usage: about 1K gas per char.
        bytes memory bytesString = new bytes(32);
        uint256 charCount = 0;

        for (uint256 j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }

        bytes memory bytesStringTrimmed = new bytes(charCount);

        for (uint256 j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }

        return string(bytesStringTrimmed);
    }
}
