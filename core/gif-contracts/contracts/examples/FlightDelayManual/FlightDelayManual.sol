pragma solidity 0.5.2;

import "../../InsuranceProduct.sol";


contract FlightDelayManual is InsuranceProduct {

    bytes32 public constant NAME = "FlightDelayManual";
    bytes32 public constant POLICY_FLOW = "PolicyFlowDefault";

    uint256 public constant MIN_OBSERVATIONS = 10;

    uint8[6] public WEIGHT_PATTERN = [
        0,
        10, // late15
        20, // late30
        30, // late45
        50, // cancelled
        50  // diverted
    ];

    // maximum cumulated weighted premium per risk
    uint256 constant MAX_CUMULATED_WEIGHTED_PREMIUM = 60000;

    event LogRequestFlightStatistics(
        uint256 requestId,
        bytes32 carrierFlightNumber,
        uint256 departureTime,
        uint256 arrivalTime
    );

    event LogRequestFlightStatus(
        uint256 requestId,
        bytes32 carrierFlightNumber,
        uint256 arrivalTime
    );

    event LogRequestPayout(
        uint256 claimId,
        uint256 payoutId,
        uint256 amount
    );

    struct Risk {
        bytes32 carrierFlightNumber;
        uint256 departureTime;
        uint256 arrivalTime;
        uint delayInMinutes;
        uint8 delay;
        uint256 cumulatedWeightedPremium;
        uint256 premiumMultiplier;
        uint256 weight;
    }

    struct RequestMetadata {
        uint256 applicationId;
        uint256 policyId;
        bytes32 riskId;
    }

    mapping (bytes32 => Risk) public risks;

    RequestMetadata[] public requests;

    constructor(address _productController) public InsuranceProduct(_productController, NAME, POLICY_FLOW) {
        createRole("applicationManager");
        createRole("underwriteManager");
        createRole("payoutManager");

        addRoleToAccount(msg.sender, "applicationManager");
        addRoleToAccount(msg.sender, "underwriteManager");
        addRoleToAccount(msg.sender, "payoutManager");
    }

    function applyForPolicy(
        // domain specific struct
        bytes32 _carrierFlightNumber,
        uint256 _departureTime,
        uint256 _arrivalTime,
        // premium struct
        uint256 _premium,
        uint256 _currency,
        uint256[] calldata _payoutOptions,
        // customer struct
        bytes32 _customerExternalId
    ) external onlyWithRole("applicationManager") {
        // Validate input parameters
        require(_departureTime > block.timestamp, "ERROR::INVALID_DEPARTURE_TIME");
        require(_arrivalTime > block.timestamp, "ERROR::INVALID_ARRIVAL_TIME");

        // Create risk if not exists
        bytes32 riskId = keccak256(abi.encodePacked(_carrierFlightNumber, _departureTime, _arrivalTime));
        Risk storage risk = risks[riskId];

        if (risk.carrierFlightNumber == "") {
            risk.carrierFlightNumber = _carrierFlightNumber;
            risk.departureTime = _departureTime;
            risk.arrivalTime = _arrivalTime;
        }

        require(
            _premium * risk.premiumMultiplier + risk.cumulatedWeightedPremium < MAX_CUMULATED_WEIGHTED_PREMIUM,
            "ERROR::CLUSTER_RISK"
        );

        if (risk.cumulatedWeightedPremium == 0) {
            risk.cumulatedWeightedPremium = MAX_CUMULATED_WEIGHTED_PREMIUM;
        }

        // Create new application
        uint256 applicationId = newApplication(_customerExternalId, _premium, _currency, _payoutOptions);

        // New request
        uint256 requestId = requests.length++;
        RequestMetadata storage requestMetadata = requests[requestId];
        requestMetadata.applicationId = applicationId;
        requestMetadata.riskId = riskId;

        emit LogRequestFlightStatistics(requestId, _carrierFlightNumber, _departureTime, _arrivalTime);
    }

    function flightStatisticsCallback(uint256 requestId, uint256[6] calldata _statistics) external onlyWithRole("underwriteManager") {
        // Statistics: ['observations','late15','late30','late45','cancelled','diverted']

        uint256 applicationId = requests[requestId].applicationId;

        if (_statistics[0] <= MIN_OBSERVATIONS) {
            decline(applicationId);
            return;
        }

        uint256 weight;
        for (uint256 i = 1; i <= 5; i++) {
            weight += WEIGHT_PATTERN[i] * _statistics[i] * 10000 / _statistics[0];
            // 1% = 100 / 100% = 10,000
        }

        // to avoid div0 in the payout section,
        // we have to make a minimal assumption on weight.
        if (weight == 0) {
            weight = 100000 / _statistics[0];
        }

        uint256 premium = getPremium(applicationId);
         uint256[] memory payoutOptions = getPayoutOptions(applicationId);
         for (uint256 i = 0; i <= 4; i++) {
            // todo: Use real values in newApplication
            require(payoutOptions[i] == premium * WEIGHT_PATTERN[i + 1] * 10000 / weight, "ERROR::INVALID_PAYOUT_OPTION");
         }

        bytes32 riskId = requests[requestId].riskId;

        if (risks[riskId].premiumMultiplier == 0) {
            // it's the first policy for this risk, we accept any premium
            risks[riskId].cumulatedWeightedPremium = premium * 10000;
            risks[riskId].premiumMultiplier = 100000 / weight;
        }

        risks[riskId].weight = weight;

        uint256 policyId = underwrite(applicationId);

        // New request
        uint256 newRequestId = requests.length++;
        RequestMetadata storage requestMetadata = requests[newRequestId];
        requestMetadata.policyId = policyId;

        emit LogRequestFlightStatus(newRequestId, risks[riskId].carrierFlightNumber, risks[riskId].arrivalTime);
    }

    function flightStatusCallback(uint256 requestId, uint256 _delay, bool _cancelled, bool _diverted) external onlyWithRole("underwriteManager") {
        uint256 policyId = requests[requestId].policyId;
        uint256 applicationId = requests[requestId].policyId;
        uint256[] memory payoutOptions = getPayoutOptions(applicationId);

        uint256 payoutAmount;

        if (_cancelled == true) {
            payoutAmount = payoutOptions[3];
        } else if (_diverted == true) {
            payoutAmount = payoutOptions[4];
        } else if (_delay > 30) {
            if (_delay > 45) {
                payoutAmount = payoutOptions[1];
            } else if (_delay > 60) {
                payoutAmount = payoutOptions[2];
            } else {
                payoutAmount = payoutOptions[0];
            }

            uint256 claimId = newClaim(policyId);
            uint256 payoutId = confirmClaim(claimId, payoutAmount);

            emit LogRequestPayout(claimId, payoutId, payoutAmount);
        } else {
            expire(policyId);
        }
    }

    function confirmPayout(uint256 _payoutId, uint256 _sum) external onlyWithRole("payoutManager") {
        payout(_payoutId, _sum);
    }
}
