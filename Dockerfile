FROM node:20.11-alpine3.18

ARG ENVIRONMENT
ENV NODE_ENV=${ENVIRONMENT}
ENV ENVIRONMENT=${ENVIRONMENT}

WORKDIR /home/node/app

COPY package*.json ./
RUN npm --production=false install

# Leave Sentry ENV and ARG here to use docker cache
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_VERSION

ENV SENTRY_VERSION=${SENTRY_VERSION}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

COPY . .
RUN npm run build

CMD [ "npm", "start" ]
