FROM node:16.2-alpine

EXPOSE ${PORT}

WORKDIR /usr/app/src

COPY package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "start:dev"]

