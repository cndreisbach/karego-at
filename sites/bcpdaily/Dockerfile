FROM node:16-alpine

ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ENV CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}

RUN apk update && apk upgrade && apk add --no-cache git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/
RUN npm install --omit=dev && npm cache clean --force
COPY ./ /usr/src/app
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

CMD [ "npm", "start" ]
