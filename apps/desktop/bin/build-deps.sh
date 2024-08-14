#!/bin/bash

cd ../../;
pushd apps/core/; yarn build && popd;
pushd packages/domain/; yarn build && popd;
pushd packages/ai/; yarn build && popd;
pushd packages/core-web; yarn build && popd;
pushd packages/components/; yarn build && popd;

# In root
yarn install --force;

pushd apps/desktop;
rm -fr node_modules/.vite;

yarn dev