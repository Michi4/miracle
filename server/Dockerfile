FROM node:22-alpine

WORKDIR /srv

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./
COPY src/gigs.js ./seed-gigs.js
RUN rm -rf test

ENV NODE_ENV=production PORT=3000 DB_PATH=/data/miracle.json
EXPOSE 3000
CMD ["node", "index.js"]
