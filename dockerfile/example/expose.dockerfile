FROM nginx:run

EXPOSE 80/tcp

CMD ["nginx", "-g", "daemon off;"]