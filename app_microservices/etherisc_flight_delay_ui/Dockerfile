FROM node:latest AS build

WORKDIR /app
COPY . .

RUN npm install --only=production --loglevel notice
RUN NODE_ENV=production npm run build

FROM nginx:stable

COPY --from=build /app/build/ /var/www/ui
COPY ./host.nginx /etc/nginx/conf.d/default.conf
