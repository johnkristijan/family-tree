# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Build tools needed if sqlite3 has to compile from source
RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine AS prod-deps
WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production \
    && yarn cache clean

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package.json ./
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
