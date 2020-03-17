FROM nginx:run

RUN apk add --no-cache curl

HEALTHCHECK --interval=10s --timeout=10s --retries=2 \
	CMD curl localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]