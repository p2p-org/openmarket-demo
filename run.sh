#!/usr/bin/env bash

if [ $# -ne 1 ]; then

    echo "please run: $0 help"
    exit 0
fi

while test $# -gt 0; do
  case "$1" in
    help)
      echo "openmarket demo"
      echo " "
      echo "run.sh [options]"
      echo " "
      echo "options:"
      echo "help                        show brief help"
      echo "build                       build app"
      echo "up                          start app"
      echo "down                        stop app"
      echo "upgrade                     rebuild contaner and restarts"
      echo "purge                       stop containers, except proxy, remove volumes"
      echo "up-proxy                    start web proxy with ssl"
      echo "down-proxy                  stop proxy"
      exit 0
      ;;
    up)
      docker-compose up -d
      exit 0
      ;;
    down)
      docker-compose down
      exit 0
      ;;
    log)
      docker-compose logs -f --tail=500
      exit 0
      ;;
    build)
      docker-compose build
      exit 0
      ;;
    upgrade)
      docker-compose build
      docker-compose down
      docker-compose up -d
      exit 0
      ;;
    up-proxy)
      docker network create dwh-network
      docker-compose -f docker-compose-proxy.yml up -d
      exit 0
      ;;
    down-proxy)
      docker-compose -f docker-compose-proxy.yml down
      exit 0
      ;;
    purge)
      docker-compose down -v
      exit 0
      ;;
    *)
      echo "wrong argument:"
      echo "$1"
      exit 0
      ;;
  esac
done
