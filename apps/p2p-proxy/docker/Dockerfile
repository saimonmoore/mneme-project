# Use an official Node.js runtime as the base image
FROM node:22-alpine as base

# Install necessary build tools
RUN apk add --no-cache python3 py3-pip make g++ linux-headers nginx supervisor
RUN ln -sf python3 /usr/bin/python

ENV HOME /app
WORKDIR ${HOME}

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

ENV RELAY_PORT=49443
ENV HTTP_PORT=3000

ENV CERT_PATH="/etc/dht-relay/ssl/fullchain.pem"
ENV KEY_PATH="/etc/dht-relay/ssl/privkey.pem"

RUN npm install -g @hyperswarm/dht-relay

RUN mkdir -p /etc/dht-relay/ssl

RUN mkdir -p /app/ai

COPY ./docker/supervisord.conf /etc/supervisord.conf
COPY ./vendor/ai/package.json /app/ai/
COPY ./vendor/ai/dist /app/ai/
RUN cd /app/ai && yarn install --production

COPY ./docker/startServers.sh /app/startServers.sh
RUN chmod +x /app/startServers.sh

COPY ./docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

FROM base AS development
COPY ./docker/nginx.development.conf /etc/nginx/nginx.conf

FROM base AS production
COPY ./nginx.production.conf /etc/nginx/nginx.conf
COPY ./certs/prod/fullchain.pem /etc/dht-relay/ssl/
COPY ./certs/prod/privkey.pem /etc/dht-relay/ssl/
