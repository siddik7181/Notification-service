
FROM node:23

WORKDIR /app

COPY package.json ./

RUN yarn

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# COPY . .

# EXPOSE 8080

# CMD [ "yarn", "start" ]