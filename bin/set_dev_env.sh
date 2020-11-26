#!/usr/bin/env bash

#
# We use a single .env file which is referenced by all modules
# in the bootstrap.js file via
# require('dotenv').config({ path: '../.env' });
#

set -e
cd core_microservices
[ ! -f .env ] && cp .env.sample .env && echo "INFO: .env created from .env.sample"
