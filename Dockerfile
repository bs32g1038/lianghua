FROM node:8

COPY package.json .
RUN npm install

WORKDIR /app

# Bundle app source
COPY . /app

EXPOSE 9000