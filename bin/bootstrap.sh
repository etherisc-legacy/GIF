#!/usr/bin/env bash

set -e

for package in `ls -d app_microservices/* core_microservices/* shared/*`
do
  echo "Install dependencies for $package"
  (
    [ $CI ] && cp .npmrc_config $package/.npmrc

    cd $package
    npm ci
  )
done
