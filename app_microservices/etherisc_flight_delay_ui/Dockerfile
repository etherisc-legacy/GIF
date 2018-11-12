FROM node:9.10.0 AS build

WORKDIR /app
COPY . .

ARG NPM_TOKEN
RUN echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
RUN npm update -g npm
RUN npm ci

RUN NODE_ENV=production npm run build

FROM nginx:stable

COPY --from=build /app/build/ /var/www/ui
COPY ./host.nginx /etc/nginx/conf.d/default.conf
