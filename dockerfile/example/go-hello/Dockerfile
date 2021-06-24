FROM golang:1.11.9-alpine3.8 AS build-env
COPY src/ /opt/src
RUN set -x \
	&& cd /opt/src/ \ 
	&& go build -o main

FROM alpine
COPY --from=build-env /opt/src/main /opt/app/
CMD /opt/app/main