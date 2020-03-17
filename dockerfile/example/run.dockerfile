FROM alpine:3.10

RUN apk update
RUN apk add nginx
RUN mkdir /run/nginx