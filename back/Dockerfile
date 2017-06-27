FROM mhart/alpine-node

RUN npm i -g forever

ADD . .
RUN npm install

EXPOSE 5000

CMD forever app.js