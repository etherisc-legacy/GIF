pragma solidity 0.5.2;

interface IQuery {
    enum OracleTypeState {Inactive, Active}

    enum OracleState {Inactive, Active}

    struct OracleType {
        string inputFormat; // e.g. '(uint256 longitude,uint256 latitude)'
        string callbackFormat; // e.g. '(uint256 longitude,uint256 latitude)'
        string description;
        OracleTypeState state;
        bool initialized;
    }

    struct Oracle {
        address oracleOwner;
        address oracleContract;
        string description;
        OracleState state;
    }

    struct OracleRequest {
        bytes data;
        string callbackMethodName;
        address callbackContractAddress;
        bytes32 oracleTypeName;
        uint256 responsibleOracleId;
        uint256 createdAt;
    }

    struct OracleResponse {
        uint256 requestId;
        address responder;
        uint256 createdAt;
        bool status;
    }

    /* Logs */
    event LogOracleTypeProposed(
        bytes32 oracleTypeName,
        string inputFormat,
        string callbackFormat,
        string description
    );

    event LogOracleTypeActivated(bytes32 oracleTypeName);

    event LogOracleTypeDeactivated(bytes32 oracleTypeName);

    event LogOracleTypeRemoved(bytes32 oracleTypeName);

    event LogOracleProposed(address oracleContract, string description);

    event LogOracleContractUpdated(
        uint256 oracleId,
        address prevContract,
        address nextContract
    );

    event LogOracleActivated(uint256 oracleId);

    event LogOracleDeactivated(uint256 oracleId);

    event LogOracleRemoved(uint256 oracleId);

    event LogOracleProposedToType(
        bytes32 oracleTypeName,
        uint256 oracleId,
        uint256 proposalId
    );

    event LogOraclePriceUpdatedInType(
        uint256 oracleId,
        uint256 oracleTypeId,
        uint256 price
    );

    event LogOracleToTypeProposalRevoked(
        bytes32 oracleTypeName,
        uint256 oracleId,
        uint256 proposalId
    );

    event LogOracleAssignedToOracleType(
        bytes32 oracleTypeName,
        uint256 oracleId
    );

    event LogOracleRemovedFromOracleType(
        bytes32 oracleTypeName,
        uint256 oracleId
    );

    event LogOracleRequested(uint256 requestId, uint256 responsibleOracleId);

    event LogOracleResponded(
        uint256 requestId,
        uint256 responseId,
        address responder,
        bool status
    );
}
