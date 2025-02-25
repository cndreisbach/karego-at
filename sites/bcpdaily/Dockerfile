FROM oven/bun:1.2.3-alpine

ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ENV CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./ /usr/src/app
RUN bun install --omit=dev --frozen-lockfile --no-cache 
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

WORKDIR /usr/src/app/sites/bcpdaily

CMD [ "bun", "./server.ts" ]
