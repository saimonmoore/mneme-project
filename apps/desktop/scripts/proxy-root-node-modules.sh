#!/bin/bash

function setup {
    mv node_modules node_modules_old
    ln -nfs ../../node_modules node_modules
}

function teardown {
    if [ ! -L node_modules ]; then
        return
    fi

    unlink node_modules
    mv node_modules_old node_modules
}

function catchSignals {
    echo "Caught signal, cleaning up..."
    teardown
    exit 0
}

trap catchSignals SIGINT
trap catchSignals SIGTERM

setup

$@

teardown


