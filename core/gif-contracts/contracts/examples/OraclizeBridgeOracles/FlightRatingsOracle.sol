pragma solidity 0.5.2;

import "./oraclizeAPI.sol";
import "./strings.sol";
import "../../Oracle.sol";

contract FlightRatingsOracle is Oracle, usingOraclize {
    using strings for *;

    modifier onlyOraclize {
        require(msg.sender == oraclize_cbAddress());
        _;
    }

    event OraclizeRequested(uint256 requestId, bytes32 queryId, string url);

    event OraclizeResponded(
        uint256 requestId,
        bytes32 queryId,
        string result,
        bytes proof
    );

    bool public testMode = false;

    string private encryptedQuery;

    // Ratings api: https://developer.flightstats.com/api-docs/ratings/v1
    string constant ORACLIZE_RATINGS_BASE_URL_TEST = "[URL] json(https://flight-delay-testing-api-zxxtusurtb.now.sh/flex/ratings/rest/v1/json/flight/";
    string constant ORACLIZE_RATINGS_BASE_URL = "[URL] json(https://api.flightstats.com/flex/ratings/rest/v1/json/flight/";
    string constant ORACLIZE_RATINGS_QUERY = ").ratings[0]['observations','late15','late30','late45','cancelled','diverted']";

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
        bytes32 carrierFlightNumber = abi.decode(_input, (bytes32));

        string memory oraclizeUrl = getOraclizeUrl(carrierFlightNumber);

        bytes32 queryId = oraclize_query("nested", oraclizeUrl, oraclizeGas);

        requests[queryId] = _requestId;

        emit OraclizeRequested(_requestId, queryId, oraclizeUrl);
    }

    function __callback(
        bytes32 _queryId,
        string memory _result,
        bytes memory _proof
    ) public onlyOraclize {
        uint256 requestId = requests[_queryId];

        strings.slice memory slResult = _result.toSlice();

        if (bytes(_result).length == 0) {
            revert("Declined (empty result)");
        } else {
            if (slResult.count(", ".toSlice()) != 5) {
                revert("Declined (invalid result)");
            } else {
                slResult.beyond("[".toSlice()).until("]".toSlice());

                uint[6] memory statistics;

                for (uint i = 0; i <= 5; i++) {
                    statistics[i] = parseInt(
                        slResult.split(", ".toSlice()).toString()
                    );
                }

                _respond(requestId, abi.encode(statistics));
            }
        }

        emit OraclizeResponded(requestId, _queryId, _result, _proof);
    }

    function getOraclizeUrl(bytes32 _carrierFlightNumber)
        public
        view
        returns (string memory _oraclizeUrl)
    {
        string memory url;

        if (testMode == true) {
            url = strConcat(
                ORACLIZE_RATINGS_BASE_URL_TEST,
                b32toString(_carrierFlightNumber),
                ORACLIZE_RATINGS_QUERY
            );
        } else {
            url = strConcat(
                ORACLIZE_RATINGS_BASE_URL,
                b32toString(_carrierFlightNumber),
                strConcat("?${[decrypt] ", encryptedQuery, "}"),
                ORACLIZE_RATINGS_QUERY
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
