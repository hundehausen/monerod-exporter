FROM  mhart/alpine-node:latest as build-env

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
ADD index.js /app/index.js
WORKDIR /app

RUN npm ci --only=production

FROM gcr.io/distroless/nodejs:latest
COPY --from=build-env /app /app
WORKDIR /app

EXPOSE 18083/tcp
ENV PORT=18083
ENV DAEMON_HOST=http://your-monerod:18081

CMD [ "index.js" ]