FROM node:12

RUN npm install -g serverless

WORKDIR /src

ADD package.json /src

RUN npm install --silent

ADD . /src

CMD ["serverless", "offline", "start", "-v", "--stage", "local", "--host", "0.0.0.0"]
