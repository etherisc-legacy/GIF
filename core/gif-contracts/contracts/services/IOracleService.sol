pragma solidity 0.5.2;

interface IOracleService {
    function respond(uint256 _requestId, bytes calldata _data)
        external
        returns (uint256 _responseId);
}
