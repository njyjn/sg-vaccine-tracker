FROM node:12

ADD . /home/
WORKDIR /home

RUN npm install -g serverless
RUN npm install

CMD ["serverless", "offline", "start", "-v", "--stage", "local", "--host", "0.0.0.0"]
