FROM node:11.2.0

WORKDIR /app
COPY ./gif-contracts .
COPY ./deploy .

ARG NPM_TOKEN
RUN echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
RUN npm update -g npm
RUN npm set unsafe-perm true
RUN npm ci
RUN rm .npmrc

RUN npm install -g npm-add-script
RUN npmAddScript -k broadcast -v 'node ./broadcast.js' -f

CMD npm run migrate:prod && npm run broadcast
