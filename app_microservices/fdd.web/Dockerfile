FROM node:11.2.0 AS build

WORKDIR /app
COPY . .

RUN npm update -g npm
RUN npm ci

RUN NODE_ENV=production npm run build

FROM nginx:stable

COPY --from=build /app/build/ /var/www/ui
COPY ./host.nginx /etc/nginx/conf.d/default.conf
