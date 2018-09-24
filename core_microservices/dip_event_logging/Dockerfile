FROM node:latest

WORKDIR /app
COPY . .

RUN npm install --only=production --loglevel notice

CMD npm run migrate up && npm run prod
