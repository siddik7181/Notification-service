
FROM node:23-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package.json ./

RUN yarn

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# COPY . .

# EXPOSE 8080

# CMD [ "yarn", "start" ]