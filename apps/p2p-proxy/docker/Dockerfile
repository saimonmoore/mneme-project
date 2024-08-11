# Use an official Node.js runtime as the base image
FROM node:22-alpine as base

# Install necessary build tools
RUN apk add --no-cache python3 make g++

ENV HOME /app
WORKDIR ${HOME}

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

ENV PORT=49443

ENV CERT_PATH="/etc/dht-relay/ssl/fullchain.pem"
ENV KEY_PATH="/etc/dht-relay/ssl/privkey.pem"

RUN npm install -g @hyperswarm/dht-relay

RUN mkdir -p /etc/dht-relay/ssl

COPY ./docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE $PORT
ENTRYPOINT ["/app/entrypoint.sh"]

FROM base AS development
COPY ./certs/dev/fullchain.pem /etc/dht-relay/ssl/
COPY ./certs/dev/privkey.pem /etc/dht-relay/ssl/

FROM base AS production
COPY ./certs/prod/fullchain.pem /etc/dht-relay/ssl/
COPY ./certs/prod/privkey.pem /etc/dht-relay/ssl/
