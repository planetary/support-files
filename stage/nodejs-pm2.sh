#!/usr/bin/env bash

project="PROJECT NAME GOES HERE"

# kill server to perform migrations
pm2 show $project
exists=$?
if [ $exists -eq 0 ]; then
    pm2 stop $project
fi

cd www
git fetch
git pull
npm install
gulp build
migrate up
cd ..

# restart server if previously running, else register it for the first time
if [ $exists -eq 0 ]; then
    pm2 restart $project
else
    pm2 start $project.json
fi
