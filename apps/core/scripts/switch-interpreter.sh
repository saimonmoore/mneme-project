#!/bin/bash

function node {
  cp package-node.json package.json
}

function bare {
  cp package-bare.json package.json
}

$1

yarn install