FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.ts .
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json .

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
