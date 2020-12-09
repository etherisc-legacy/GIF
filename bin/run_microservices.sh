#!/usr/bin/env bash
#
# Start / Stop / Delete with pm2 process manager
#

echo NODE_ENV="$2" pm2 "$1" pm2.config.js
NODE_ENV="$2" pm2 "$1" pm2.config.js
