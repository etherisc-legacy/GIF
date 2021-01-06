#!/usr/bin/env bash

set -e

for package in `ls -d gif-microservices/*`
do
  echo "Update @etherisc/microservice for $package from local package"
  (
    cd $package
    npm r @etherisc/microservice
    npm i @etherisc/microservice@latest
  )
done
