#!/usr/bin/env bash

mkdir -p ./verification

function flatten {
  ./node_modules/.bin/truffle-flattener $1 | sed "s|$PWD|.|g" > $2
   echo "Source code prepared for" $1
}

# Services
flatten ./contracts/services/InstanceOperatorService.sol ./verification/InstanceOperatorService.txt
flatten ./contracts/services/ProductService.sol ./verification/ProductService.txt
flatten ./contracts/services/ProductOwnerService.sol ./verification/ProductOwnerService.txt
flatten ./contracts/services/OracleService.sol ./verification/OracleService.txt
flatten ./contracts/services/OracleOwnerService.sol ./verification/OracleOwnerService.txt
# Policy flows
flatten ./contracts/policyFlows/PolicyFlowDefault.sol ./verification/PolicyFlowDefault.txt
# Registry module
flatten ./contracts/modules/registry/Registry.sol ./verification/Registry.txt
flatten ./contracts/modules/registry/RegistryController.sol ./verification/RegistryController.txt
# License module
flatten ./contracts/modules/license/License.sol ./verification/License.txt
flatten ./contracts/modules/license/LicenseController.sol ./verification/LicenseController.txt
# Policy module
flatten ./contracts/modules/policy/Policy.sol ./verification/Policy.txt
flatten ./contracts/modules/policy/PolicyController.sol ./verification/PolicyController.txt
# Query module
flatten ./contracts/modules/query/Query.sol ./verification/Query.txt
flatten ./contracts/modules/query/QueryController.sol ./verification/QueryController.txt
