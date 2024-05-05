#!/bin/bash

set -x

function buildLocalNodeModules {
  yarn install --production=true
}

function disableMonorepo {
  mv ../../package.json ../../package.json.bak
}

function enableMonorepo {
  mv ../../package.json.bak ../../package.json
}

function activateLocalNodeModules {
  mv node_modules ../../core_node_modules_bak
  mv ../../core_yarn_lock_bak yarn.lock
  mkdir -p ../../core_node_modules_local
  mv ../../core_node_modules_local node_modules
}

function deactivateLocalNodeModules {
  mv node_modules ../../core_node_modules_local
  mv ../../core_node_modules_bak node_modules
  mv yarn.lock ../../core_yarn_lock_bak
}

function stage {
  yarn run build

  disableMonorepo
  activateLocalNodeModules
  buildLocalNodeModules

  yarn run stage:$1

  enableMonorepo
  deactivateLocalNodeModules
}

stage $1