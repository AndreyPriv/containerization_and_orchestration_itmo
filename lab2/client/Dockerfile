FROM node:18-alpine

COPY . ./app

WORKDIR /app

RUN rm -f package-lock.json

RUN npm install

RUN npm run build