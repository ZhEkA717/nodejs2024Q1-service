FROM node:18-alpine

EXPOSE ${PORT}

WORKDIR /usr/app/src

COPY package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "start:dev"]

