FROM node:latest

WORKDIR /app
COPY . .

ARG NPM_TOKEN
RUN npm install --only=production --loglevel notice

CMD npm run prod
