FROM node:11.2.0

WORKDIR /app
COPY . .

ARG NPM_TOKEN
RUN echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
RUN npm update -g npm
RUN npm ci
RUN rm .npmrc

CMD [ "npm", "run", "prod" ]
