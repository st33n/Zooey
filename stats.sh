#!/bin/bash

HERE=$(pwd)

cd ~/Code/zendesk/knowledge_client
webpack --profile --json > $HERE/data/stats.json

