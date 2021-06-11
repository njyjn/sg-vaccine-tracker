FROM node:12

WORKDIR /src

ADD package.json /src

RUN npm install --silent

ADD . /src

CMD ["npm", "start"]