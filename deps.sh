#!/bin/bash

HERE=$(pwd)

cd ~/Code/zendesk/knowledge_client
npm ls --json --production > $HERE/data/all.json
npm outdated --json > $HERE/data/outdated.json

