#!/bin/bash

rm -fr ./vendor/ai
cp -fr ../../packages/ai ./vendor/ai

docker build --target development -f docker/Dockerfile -t org.saimonmoore/mneme/p2p-proxy:dev .