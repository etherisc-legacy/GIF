#!/usr/bin/env bash

set -e

for package in `ls -d core_microservices/*`
do
  (
    cd $package
    [ -f .env.sample ] && cp .env.sample .env && echo "$package: .env file applied" || echo "$package: -"
  )
done
