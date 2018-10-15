FROM node:10

# Create app directory
WORKDIR /usr/src/app

RUN npm i lerna -g --loglevel notice

# Install root-level dependencies
COPY package*.json .
ARG NPM_TOKEN
RUN npm install --only=production --loglevel notice

# Install app dependencies
COPY microservices/test/ ./microservices/test/

COPY shared/ ./shared/

COPY lerna.json .
RUN lerna bootstrap

EXPOSE 8080

CMD [ "npm", "--prefix", "microservices/test", "run", "production" ]
