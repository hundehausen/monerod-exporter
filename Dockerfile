FROM  mhart/alpine-node:latest as builder

RUN apk --no-cache add git

RUN git clone https://github.com/hundehausen/monerod-exporter.git /app/monerod-exporter

WORKDIR /app/monerod-exporter

RUN npm install

EXPOSE 18083/tcp
ENV PORT=18083
ENV DAEMON_HOST=http://your-monerod:18081

ENTRYPOINT [ "node" ]
CMD [ "index.js" ]
