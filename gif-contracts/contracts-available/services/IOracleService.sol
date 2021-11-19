// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

interface IOracleService {

    function respond(uint256 _requestId, bytes calldata _data) external;

}
