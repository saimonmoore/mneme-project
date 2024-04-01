FROM node:21-slim AS base
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}
ENV HOME /app

WORKDIR ${HOME}
COPY package.json ${HOME}/
COPY yarn.lock ${HOME}/

RUN apt-get clean
RUN apt-get update
RUN apt-get install -y openssl

FROM base AS dependencies
COPY yarn.lock tsconfig.json nest-cli.json tsconfig.build.json .npmrc ${HOME}/
COPY src/ ${HOME}/src
RUN yarn install --production=false
RUN apt-get install -y procps

FROM dependencies AS development
COPY .eslintrc.js ${HOME}

FROM dependencies AS builder
RUN yarn build
RUN yarn install --production
RUN cp -R node_modules prod_node_modules

FROM base AS production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prod_node_modules ./node_modules

EXPOSE 80

COPY ./docker/entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
