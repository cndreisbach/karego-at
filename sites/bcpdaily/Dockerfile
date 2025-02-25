FROM oven/bun:latest

ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ENV CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./bundle.js /usr/src/app
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

CMD [ "bun", "bundle.js" ]
