
FROM node:23-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8071 8072 8073 8091 8092 8093

CMD [ "npx", "tsx", "server.ts" ]