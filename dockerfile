FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN --mount=target=/home/arif/Documents/test_catarine/public,type=bind,source=public/

EXPOSE 8080

CMD npm start