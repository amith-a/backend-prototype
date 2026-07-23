# Backend Prototype

A production-oriented backend built with **Node.js**, **TypeScript**, **Express**, **PostgreSQL**, **Redis**, **BullMQ**, and **Docker**.

---

# Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Redis
- BullMQ
- JWT Authentication
- Docker & Docker Compose
- Pino Logger
- Jest

---

# Features

- JWT Authentication
- Access & Refresh Tokens
- Role-Based Authorization (RBAC)
- PostgreSQL
- Custom SQL Migration Runner
- Custom SQL Seed Runner
- Redis
- BullMQ (Upcoming)
- Swagger API Documentation
- Docker Development & Production Environments

---

# Project Structure

```text
src/
├── config/
├── controllers/
├── db/
│   ├── migrate.ts
│   ├── migrationRunner.ts
│   ├── migrations/
│   ├── seed.ts
│   ├── seedRunner.ts
│   └── seeds/
├── middleware/
├── repositories/
├── routes/
├── services/
├── workers/
└── server.ts
```

---

# Getting Started

## Install dependencies

```bash
npm install
```

---

# Development

## Build and start

```bash
docker compose \
-f docker-compose.yml \
-f compose.dev.yml \
up --build --watch
```

## Stop

```bash
docker compose \
-f docker-compose.yml \
-f compose.dev.yml \
down
```

## Rebuild without cache

```bash
docker compose \
-f docker-compose.yml \
-f compose.dev.yml \
build --no-cache api
```

## Run migrations

```bash
docker compose \
-f docker-compose.yml \
-f compose.dev.yml \
exec api npm run db:migrate
```

## Run seeds

```bash
docker compose \
-f docker-compose.yml \
-f compose.dev.yml \
exec api npm run db:seed
```

## Create admin user

```bash
docker compose \
-f docker-compose.yml \
-f compose.dev.yml \
exec api npm run create-admin
```

---

# Production

## Build and start

```bash
docker compose \
-f docker-compose.yml \
-f compose.prod.yml \
up --build -d
```

## Restart

```bash
docker compose \
-f docker-compose.yml \
-f compose.prod.yml \
up -d
```

## Stop

```bash
docker compose \
-f docker-compose.yml \
-f compose.prod.yml \
down
```

## Run migrations

```bash
docker compose \
-f docker-compose.yml \
-f compose.prod.yml \
exec api npm run db:migrate:prod
```

## Run seeds (Optional)

```bash
docker compose \
-f docker-compose.yml \
-f compose.prod.yml \
exec api npm run db:seed:prod
```

## Create admin user

```bash
docker compose \
-f docker-compose.yml \
-f compose.prod.yml \
exec api npm run create-admin:prod
```

---

# Database

## Migration Files

```text
src/db/migrations/

001_enable_extensions.sql
002_create_roles.sql
003_create_users.sql
...
```

Apply migrations

```bash
npm run db:migrate
```

---

## Seed Files

```text
src/db/seeds/

001_seed_roles.sql
```

Run seeds

```bash
npm run db:seed
```

---

# Useful Commands

## Open API container

```bash
docker compose \
-f docker-compose.yml \
-f compose.dev.yml \
exec api sh
```

## Open PostgreSQL

```bash
docker compose \
-f docker-compose.yml \
-f compose.dev.yml \
exec postgres psql -U postgres -d <database_name>
```

## List tables

```sql
\dt
```

## View migrations

```sql
SELECT * FROM schema_migrations;
```

---

# Development Workflow

```text
Write SQL Migration
        │
        ▼
Run db:migrate
        │
        ▼
Database Updated
        │
        ▼
Develop Feature
        │
        ▼
Commit
```

---

# Docker Features

- Multi-stage Dockerfile
- Docker Compose Overrides
- Compose Watch
- Development & Production Configurations
- PostgreSQL
- Redis
- Health Checks
- Environment Separation

---

# Roadmap

## Completed

- [x] Express API
- [x] PostgreSQL
- [x] Redis
- [x] JWT Authentication
- [x] Role-Based Authorization
- [x] Custom SQL Migration Runner
- [x] Custom SQL Seed Runner
- [x] Multi-stage Dockerfile
- [x] Docker Compose
- [x] Docker Compose Watch
- [x] Swagger Documentation

## Next

- [ ] BullMQ Worker
- [ ] Background Email Queue
- [ ] Docker Secrets
- [ ] Docker Profiles
- [ ] CI/CD Pipeline
- [ ] Image Tagging Strategy
- [ ] Image Scanning
- [ ] Kubernetes Deployment

---

# Future Improvements

- Distroless Runtime Image
- Non-root Containers
- Multi-Architecture Images
- Docker Hub / GHCR Publishing
- AWS ECR Deployment
- Kubernetes
- Horizontal Scaling
- Monitoring & Observability