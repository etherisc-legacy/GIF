pragma solidity >0.4.99 <0.6.0;

import './../libraries/OracleBridgeInterface.sol';
import "./../vendors/usingOraclize.sol";

contract OraclizeBridge is OracleBridgeInterface, usingOraclize {

    constructor(address _oraclizeResolverAddress) public payable {
        OAR = OraclizeAddrResolverI(_oraclizeResolverAddress);
    }

    mapping(bytes32 => bytes32) requests;
    mapping(bytes32 => bool) responsesReceived;

    event OraclizeRequestMade(string fullUrl);
    event OraclizeResponseReceived(bytes32 requestId, string result);

    function handleRequest(bytes32 _requestId, bytes memory _input) internal {
        (string memory url, string memory lookup) = abi.decode(_input, (string, string));

        string memory fullUrl = string(abi.encodePacked("json(", url, ").", lookup));

        bytes32 queryId = oraclize_query(
            'URL',
            fullUrl
        );

        requests[queryId] = _requestId;

        emit OraclizeRequestMade(fullUrl);
    }

    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public onlyOraclize {
        require(!responsesReceived[_queryId]);

        _proof;

        bytes32 requestId = requests[_queryId];

        emit OraclizeResponseReceived(requestId, _result);

        forwardResponse(
            requestId,
            abi.encode(_result)
        );

        responsesReceived[_queryId] = true;
    }

    modifier onlyOraclize {
        // --> prod-mode
        require(msg.sender == oraclize_cbAddress());
        // <-- prod-mode
        _;
    }
}
