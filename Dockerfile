
# This is a github searcher backend docker build
# This will serve all API endpoints
# Using node:10 alpine as base image

FROM node:10-alpine

WORKDIR /app

ADD package.json /app/package.json

RUN yarn install

ADD . /app

RUN yarn run build

EXPOSE 3001

#serves the content from dist folder
CMD ["yarn", "run", "start:prod"]