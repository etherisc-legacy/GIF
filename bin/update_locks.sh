#!/usr/bin/env bash

set -e

for package in `ls -d core_microservices/* core core/gif-contracts cli`
do
  echo "Install dependencies for $package and update locks for deploy"
  (
    cd $package
    rm -rf node_modules
    rm -f package-lock.json
    npm install
    git add package-lock.json
  )
done
