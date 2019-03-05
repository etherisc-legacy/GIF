#!/usr/bin/env bash

set -e

for package in `ls -d core_microservices/* core/* shared/*`
do
  echo "Install dependencies for $package"
  (
    cd $package
    npm ci
  )
done
