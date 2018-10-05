FROM node:latest

WORKDIR /app
COPY . .

RUN npm install --only=production --loglevel notice

CMD npm run migrate && npm run prod
