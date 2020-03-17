FROM alpine:3.10

LABEL maintainer="Yuki git@48763 <future.starshine@gmail.com>"

WORKDIR /etc
RUN pwd \
	&& cd /var \
	&& pwd

RUN pwd

WORKDIR test-dir
RUN pwd