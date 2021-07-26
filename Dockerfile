FROM  mhart/alpine-node:latest as builder

RUN apk --no-cache add \
    git

RUN git clone https://github.com/hundehausen/monerod-exporter.git /etc/monerod-exporter

WORKDIR /etc/monerod-exporter

RUN npm install

ENTRYPOINT [ "node" ]
CMD [ "index.js" ]
EXPOSE 18083/tcp