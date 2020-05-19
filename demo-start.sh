#!/bin/bash

docker build -t om .
docker network create dwh-network
docker-compose -f demo.yml up -d
