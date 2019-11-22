FROM node:9.3.0

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package.json package-lock.json /usr/src/api/

RUN npm install

COPY . /usr/src/api

CMD ["npm", "run", "prod"]

EXPOSE 3001