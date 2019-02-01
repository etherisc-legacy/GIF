pragma solidity 0.5.2;

interface IQuery {
    enum OracleTypeRelation {OneToOne, OneToMany}

    enum OracleTypeRegistration {Public, Private}

    enum OracleTypeState {Inactive, Active}

    enum OracleState {Inactive, Active}

    enum OracleRequestType {Direct, MinPrice, MaxRating, MinDeadline, MinPriceMinDeadline, MinPriceMaxRating, MaxRatingMinDeadline, FixedPrice}

    enum OracleGasPriceMode {Safe, Standard, Fast, Fixed} // gasPrice should be provided

    struct OracleType {
        string inputFormat; // e.g. '(uint256 longitude,uint256 latitude)'
        string callbackFormat; // e.g. '(uint256 longitude,uint256 latitude)'
        string description;

        bytes32 currency;
        // OracleTypeRelation relation;
        OracleTypeState state;
        bool initialized;
    }

    struct OracleTypeMetadata {
        uint256 minPrice;
        uint256 minPriceOracleId;
        /* Ex. rating */
        // In time +1
        // Not in time -1
        uint256 maxRating;
        uint256 maxRatingOracleId;
        uint256 minDeadline;
        uint256 minDeadlineOracleId;
    }

    struct Oracle {
        address oracleContract;
        string description;
        uint256 responseDeadline; // in seconds
        OracleState state;
    }

    struct OracleRequest {
        bytes data;
        string callbackMethodName;
        address callbackContractAddress;
        bytes32 oracleTypeName;
        OracleRequestType requestType;
        OracleGasPriceMode gasPriceMode;
        uint256 responsibleOracleId;
        uint256 createdAt;
        bool roundRobin;
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
        string description,
        bytes32 currency
    );

    event LogOracleTypeActivated(
        bytes32 oracleTypeName
    );

    event LogOracleTypeDeactivated(
        bytes32 oracleTypeName
    );

    event LogOracleTypeRemoved(
        bytes32 oracleTypeName
    );

    event LogOracleProposed(
        address oracleContract,
        string description,
        uint256 responseDeadline
    );

    event LogOracleContractUpdated(
        uint256 oracleId,
        address prevContract,
        address nextContract
    );

    event LogOracleActivated(
        uint256 oracleId
    );

    event LogOracleDeactivated(
        uint256 oracleId
    );

    event LogOracleRemoved(
        uint256 oracleId
    );

    event LogOracleProposedToType(
        uint256 oracleId,
        uint256 oracleTypeId,
        uint256 price
    );

    event LogOraclePriceUpdatedInType(
        uint256 oracleId,
        uint256 oracleTypeId,
        uint256 price
    );

    event LogOracleAssignedToOracleType(
        uint256 oracleId,
        uint256 oracleTypeId
    );

    event LogOracleRemovedFromOracleType(
        uint256 oracleId,
        uint256 oracleTypeId
    );

    event LogOracleRequested(
        uint256 requestId,
        uint256 responsibleOracleId
    );

    event LogOracleResponded(
        uint256 requestId,
        uint256 responseId,
        address responder,
        bool status
    );
}
