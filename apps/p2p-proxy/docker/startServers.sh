#!/bin/sh

RELAY_PORT=${RELAY_PORT:-49443}
HTTP_PORT=${HTTP_PORT:-443}
HOST=${HOST:-'0.0.0.0'}

usage() {
  echo "Usage: $0 {web|relay|job|shell <args>}"
  echo
  echo "relay: Start dht-relay server"
  echo "web: Start http server"
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
relay)
  if [ "$NODE_ENV" = "development" ]; then
    echo "info: In development mode, dht-relay server will be insecure"
    echo "Starting dht-relay on $HOST:$RELAY_PORT ..."
    exec dht-relay --port $RELAY_PORT --host $HOST
  else
    echo "Starting dht-relay on $HOST:$RELAY_PORT ..."
    # If we use nginx for ssl termination, we can use http
    # exec dht-relay --port $RELAY_PORT --host $HOST --cert "$CERT_PATH" --key "$KEY_PATH"
    exec dht-relay --port $RELAY_PORT --host $HOST --cert "$CERT_PATH" --key "$KEY_PATH"
  fi
  ;;
web)
  echo "Starting http server on $HOST:$HTTP_PORT ..."
  cd /app/ai
  exec node ./server.js $HTTP_PORT $HOST
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
