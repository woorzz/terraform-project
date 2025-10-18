FROM nginx:1.27-alpine
COPY public/ /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/
RUN sed -i 's/try_files .*;/try_files $uri $uri\/ =404;/' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
