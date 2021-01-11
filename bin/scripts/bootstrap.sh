#!/usr/bin/env bash

set -e

for package in `ls -d gif-microservices/* gif-contracts shared/* gif-cli`
do
  echo "Install dependencies for $package"
  (
    [ $CI ] && cp .npmrc_config $package/.npmrc

    cd $package
    npm ci

  )
done
