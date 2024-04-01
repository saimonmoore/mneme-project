#!/bin/bash

usage () {
  echo "Usage: $0 {web|job|shell <args>}"
  exit 1
}

if [ $# -lt 1 ]; then
  usage
fi

COMMAND=$1 || 'web'
shift

case "$COMMAND" in
  web)
    exec node ./dist/src/main
    ;;
  job)
    exec $@
    ;;
  shell)
    if [ -z $1 ] ; then
      exec bash
    else
      exec $@
    fi
    ;;
  *)
    usage
    ;;
esac