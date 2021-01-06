#!/usr/bin/env bash

purge=false

if [ $1 == "run" ]
then
  dc_command="up"
  dc_options="-d --remove-orphans"
  dc_project="--project-name $2"

elif [ $1 == "kill" ]
then
  dc_command="kill"
  dc_options=""
  dc_project="--project-name $2"

elif [ $1 == "purge" ]
then
  dc_command="down"
  dc_options="-v"
  dc_project="--project-name $2"
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

elif [ $2 == "ganache" ]
then
  dc_file="docker-compose-ganache.yml"
  env_file=".env.ganache"

else
  echo "Unsupported environment: " $2
  exit 1
fi

# sudo rm -rf ./gif-services/compose/minio; sudo rm -rf ./gif-services/compose/postgresqldev; sudo rm -rf ./gif-services/compose/postgresqltest; sudo rm -rf ./gif-services/compose/dev_ganache",

echo docker-compose -f ./services/compose/$dc_file --env-file ./services/compose/$env_file $dc_project $dc_command $dc_options
docker-compose -f ./services/compose/$dc_file --env-file ./services/compose/$env_file $dc_project $dc_command $dc_options

if [ "$purge" = true ]
then
  sudo rm -rf ./services/compose/volumes/$2_minio
  sudo rm -rf ./services/compose/volumes/$2_postgresql
  sudo rm -rf ./services/compose/volumes/$2_ganache
fi
