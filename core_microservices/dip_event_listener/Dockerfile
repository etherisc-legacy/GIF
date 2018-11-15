FROM node:9.10.0

WORKDIR /app
COPY . .

ARG NPM_TOKEN
RUN echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
RUN npm update -g npm
RUN npm ci
RUN rm .npmrc

CMD npm run migrate && npm run prod
