#!/bin/bash

function node {
  ln -nfs package-node.json package.json
}

function bare {
  ln -nfs package-bare.json package.json
}

$1

yarn install