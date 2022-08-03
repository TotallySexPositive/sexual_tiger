FROM node:lts-alpine as builder
WORKDIR /usr/src/app
ENV NODE_ENV=dev
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tsconfig.json", "./"]
COPY src ./src
RUN apk add --no-cache --virtual .build-deps python3 alpine-sdk autoconf libtool automake
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN npm install 
RUN sed -i '1 s/./\/\/&/' node_modules/google-tts-api/dist/getAudioUrl.d.ts
RUN npm run build
RUN apk del .build-deps

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --chown=node:node ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "build.sql", "./"]
COPY --chown=node:node --from=builder /usr/src/app/built ./built
RUN apk add --no-cache --virtual .build-deps alpine-sdk autoconf libtool automake && \
   apk add --no-cache python3 ffmpeg &&\
   ln -s /usr/bin/python3 /usr/bin/python && \
   npm install --production && \
   apk del .build-deps && \
   chown node:node /usr/src/app
USER node
CMD ["npm", "run", "start"]
