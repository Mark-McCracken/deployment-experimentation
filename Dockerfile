FROM node:13 AS builder

WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src
RUN npm run compile

FROM node:13
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/dist/ ./dist/
COPY --from=builder /usr/src/app/package*.json ./

USER node

CMD ["npm", "start"]

ARG latency
ENV latency=$latency
ARG randomColorFloat
ENV randomColorFloat=$randomColorFloat
ARG errorrate
ENV errorrate=$errorrate
