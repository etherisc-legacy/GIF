#!/usr/bin/env bash

echo NODE_ENV=$2 pm2 $1 ecosystem.config.js
NODE_ENV=$2 pm2 $1 ecosystem.config.js
