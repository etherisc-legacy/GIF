#!/usr/bin/env bash
#
# Start / Stop / Delete with pm2 process manager
#
set -x
NODE_ENV="$2" pm2 "$1" pm2.config.js
if [ $1 == "delete" ]
then
  echo "Removing logs for $2"
  rm -rf ~/.pm2/logs/"$2"*
fi
