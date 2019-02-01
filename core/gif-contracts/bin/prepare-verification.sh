#!/bin/sh

# Services
./node_modules/.bin/truffle-flattener ./contracts/services/DAOService.sol > ./verification/DAOService.txt
./node_modules/.bin/truffle-flattener ./contracts/services/ProductService.sol > ./verification/ProductService.txt
# Policy flows
./node_modules/.bin/truffle-flattener ./contracts/policyFlows/PolicyFlowDefault.v1.sol > ./verification/PolicyFlowDefault.v1.txt
# Registry module
./node_modules/.bin/truffle-flattener ./contracts/modules/Registry/Registry.sol > ./verification/Registry.txt
./node_modules/.bin/truffle-flattener ./contracts/modules/Registry/RegistryController.v1.sol > ./verification/RegistryController.v1.txt
# License module
./node_modules/.bin/truffle-flattener ./contracts/modules/License/License.sol > ./verification/License.txt
./node_modules/.bin/truffle-flattener ./contracts/modules/License/LicenseController.sol > ./verification/LicenseController.txt
# Policy module
./node_modules/.bin/truffle-flattener ./contracts/modules/Policy/Policy.sol > ./verification/Policy.txt
./node_modules/.bin/truffle-flattener ./contracts/modules/Policy/PolicyController.v1.sol > ./verification/PolicyController.v1.txt
# Query module
./node_modules/.bin/truffle-flattener ./contracts/modules/Query/Query.sol > ./verification/Query.txt
./node_modules/.bin/truffle-flattener ./contracts/modules/Query/QueryController.sol > ./verification/QueryController.txt
# Example apps
./node_modules/.bin/truffle-flattener ./contracts/examples/FlightDelayOraclize/FlightDelayOraclize.sol > ./verification/FlightDelayOraclize.txt
./node_modules/.bin/truffle-flattener ./contracts/examples/OraclizeBridgeOracles/FlightRatingsOracle.sol > ./verification/FlightRatingsOracle.txt
./node_modules/.bin/truffle-flattener ./contracts/examples/OraclizeBridgeOracles/FlightStatusesOracle.sol > ./verification/FlightStatusesOracle.txt
