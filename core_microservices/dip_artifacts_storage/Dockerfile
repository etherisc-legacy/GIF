FROM node:latest

WORKDIR /app
COPY . .

ARG NPM_TOKEN
RUN npm install --only=production --loglevel notice
RUN rm .npmrc

CMD [ "npm", "run", "prod" ]
