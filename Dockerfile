# -----------------------------
# Base
# -----------------------------
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci


# -----------------------------
# Development
# -----------------------------
FROM base AS development

WORKDIR /app

COPY . .

# -----------------------------
# Builder
# -----------------------------
FROM base AS builder

COPY . .

RUN npm run build


# -----------------------------
# Runtime
# -----------------------------
FROM node:22-alpine AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY src/db/migrations ./dist/db/migrations
COPY src/db/seeds ./dist/db/seeds

EXPOSE 5000

CMD ["npm", "run", "start"]