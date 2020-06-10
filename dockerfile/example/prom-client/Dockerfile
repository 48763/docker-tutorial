FROM node:8.11.1-alpine

WORKDIR /usr/app/prom-client

COPY package.json ./
COPY src/ ./src/

RUN npm config set registry http://registry.npmjs.org/ && npm install 

CMD [ "npm", "run", "server" ]