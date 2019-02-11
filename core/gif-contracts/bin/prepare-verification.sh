#!/bin/sh

mkdir -p ./verification

function flatten {
  ./node_modules/.bin/truffle-flattener $1 | sed "s|$PWD|.|g" > $2
   echo "Source code prepared for" $1
}

# Services
flatten ./contracts/services/DAOService.sol ./verification/DAOService.txt
flatten ./contracts/services/ProductService.sol ./verification/ProductService.txt
flatten ./contracts/services/ProductOwnerService.sol ./verification/ProductOwnerService.txt
flatten ./contracts/services/OracleService.sol ./verification/OracleService.txt
flatten ./contracts/services/OracleOwnerService.sol ./verification/OracleOwnerService.txt
# Policy flows
flatten ./contracts/policyFlows/PolicyFlowDefault.sol ./verification/PolicyFlowDefault.txt
# Registry module
flatten ./contracts/modules/Registry/Registry.sol ./verification/Registry.txt
flatten ./contracts/modules/Registry/RegistryController.sol ./verification/RegistryController.txt
# License modulecl
flatten ./contracts/modules/License/License.sol ./verification/License.txt
flatten ./contracts/modules/License/LicenseController.sol ./verification/LicenseController.txt
# Policy module
flatten ./contracts/modules/Policy/Policy.sol ./verification/Policy.txt
flatten ./contracts/modules/Policy/PolicyController.sol ./verification/PolicyController.txt
# Query module
flatten ./contracts/modules/Query/Query.sol ./verification/Query.txt
flatten ./contracts/modules/Query/QueryController.sol ./verification/QueryController.txt
# Example apps
flatten ./contracts/examples/FlightDelayManual/FlightDelayManual.sol ./verification/FlightDelayManual.txt
flatten ./contracts/examples/FlightDelayOraclize/FlightDelayOraclize.sol ./verification/FlightDelayOraclize.txt
flatten ./contracts/examples/OraclizeBridgeOracles/FlightRatingsOracle.sol ./verification/FlightRatingsOracle.txt
flatten ./contracts/examples/OraclizeBridgeOracles/FlightStatusesOracle.sol ./verification/FlightStatusesOracle.txt
# Truffle
flatten ./contracts/Migrations.sol ./verification/Migration.txt
