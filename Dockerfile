FROM node:10-alpine

WORKDIR /app

ADD package.json /app/package.json

RUN yarn install

ADD . /app

EXPOSE 3001

CMD ["yarn", "run", "start:dev"]