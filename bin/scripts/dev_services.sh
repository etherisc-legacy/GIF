#!/usr/bin/env bash

purge=false
set -x

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

if [ $2 == "ganache" ]
then
  dc_file="docker-compose-ganache.yml"

else
  dc_file="docker-compose-base.yml"

fi

# sudo rm -rf ./gif-services/compose/minio; sudo rm -rf ./gif-services/compose/postgresqldev; sudo rm -rf ./gif-services/compose/postgresqltest; sudo rm -rf ./gif-services/compose/dev_ganache",

echo docker-compose --env-file ./gif-services/compose/.env -f ./gif-services/compose/$dc_file $dc_project $dc_command $dc_options
docker-compose --env-file ./gif-services/compose/.env -f ./gif-services/compose/$dc_file $dc_project $dc_command $dc_options

if [ "$purge" = true ]
then
  sudo rm -rf ./gif-services/compose/volumes/$2_minio
  sudo rm -rf ./gif-services/compose/volumes/$2_postgresql
  sudo rm -rf ./gif-services/compose/volumes/$2_ganache
fi
