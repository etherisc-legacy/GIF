#!/usr/bin/env bash

set -e

for package in `ls -d app_microservices/* core_microservices/* core core/gif-contracts shared/* cli`
do
  echo "Install dependencies for $package"
  (
    [ $CI ] && cp .npmrc_config $package/.npmrc

    cd $package
    npm ci

    if [ -f './.env.sample' ] && [ ! -f './.env' ]; then
        echo ".env file not found, making a copy"
        cp './.env.sample' './.env'
    fi
  )
done
