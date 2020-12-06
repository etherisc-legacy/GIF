#!/usr/bin/env bash

purge=false

if [ $1 == "run" ]
then
  dc_command="up"
  dc_options="-d --remove-orphans"

elif [ $1 == "kill" ]
then
  dc_command="kill"
  dc_options=""

elif [ $1 == "purge" ]
then
  dc_command="down"
  dc_options="-v"
  purge=true

fi

if [ $2 == "production" ]
then
  dc_file="docker-compose-base.yml"
  env_file=".env.production"

elif [ $2 == "staging" ]
then
  dc_file="docker-compose-base.yml"
  env_file=".env.staging"

elif [ $2 == "test" ]
then
  dc_file="docker-compose-test.yml"
  env_file=".env.test"

fi

# sudo rm -rf ./services/compose/minio; sudo rm -rf ./services/compose/postgresqldev; sudo rm -rf ./services/compose/postgresqltest; sudo rm -rf ./services/compose/dev_ganache",

docker-compose -f ./services/compose/$dc_file --env-file ./services/compose/$env_file $dc_command $dc_options

if [ "$purge" = true ]
then
  sudo rm -rf ./services/compose/$2_minio
  sudo rm -rf ./services/compose/$2_postgresql
fi
