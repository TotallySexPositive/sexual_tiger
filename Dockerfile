# ---------------------
# Dependencies
# ---------------------
FROM node:lts-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
COPY npm-shrinkwrap.json* ./

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    autoconf \
    automake \
    libtool

# BuildKit cache
RUN --mount=type=cache,target=/root/.npm npm ci

# Patch dependency once
RUN sed -i '1 s/./\/\/&/' node_modules/google-tts-api/dist/getAudioUrl.d.ts


# ---------------------
# Build
# ---------------------
FROM deps AS builder

WORKDIR /usr/src/app

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Remove dev dependencies from existing install
RUN npm prune --omit=dev


# ---------------------
# Runtime
# ---------------------
FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir ffmpeg-normalize

ENV PATH="/opt/venv/bin:$PATH"

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/built ./built

COPY --chown=node:node package*.json ./
COPY --chown=node:node build.sql ./

RUN chown -R node:node /usr/src/app

USER node

CMD ["npm", "run", "start"]