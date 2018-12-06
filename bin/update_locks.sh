#!/usr/bin/env bash

set -e

for package in `ls -d app_microservices/* core_microservices/*`
do
  echo "Install dependencies for $package and update locks for deploy"
  (
    cd $package
    rm -f package-lock.json
    npm install
    git add package-lock.json
  )
done
