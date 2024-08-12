#!/bin/sh

RELAY_PORT=${RELAY_PORT:-49443}
HTTP_PORT=${HTTP_PORT:-443}
HOST=${HOST:-'0.0.0.0'}

usage() {
  echo "Usage: $0 {supervisor|job|shell <args>}"
  echo
  echo "supervisor: Start supervisord"
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
supervisor)
  echo "Starting supervisord..."
  exec /usr/bin/supervisord -c /etc/supervisord.conf
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
