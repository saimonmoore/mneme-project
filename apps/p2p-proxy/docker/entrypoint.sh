#!/bin/sh

PORT=${PORT:-49443}
HOST=${HOST:-'0.0.0.0'}

usage() {
  echo "Usage: $0 {web|job|shell <args>}"
  echo
  echo "web: Start dht-relay server"
  echo "job: run any command"
  echo "shell: exec into container...run with -it"
  
  exit 1
}

if [ $# -lt 1 ]; then
  usage
fi

COMMAND=$1 || 'web'
shift

case "$COMMAND" in
web)
  echo "Starting dht-relay on $HOST:$PORT ..."
  exec dht-relay --port $PORT --host $HOST --cert "$CERT_PATH" --key "$KEY_PATH"
  ;;
job)
  exec $@
  ;;
shell)
  if [ -z $1 ]; then
    exec sh
  else
    exec $@
  fi
  ;;
*)
  usage
  ;;
esac
