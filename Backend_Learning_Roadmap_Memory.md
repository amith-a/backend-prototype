# Backend Learning Roadmap (Memory File)

## Sprint 1 --- Project Foundation ✅

-   TypeScript
-   Express
-   Project structure
-   tsx
-   Environment variables
-   app.ts, server.ts, tsconfig.json

## Sprint 2 --- Core Infrastructure ✅

-   Zod environment validation
-   PostgreSQL pool
-   Singleton pattern
-   Database connection test

Deferred: - Pino - Redis - Docker Compose - pino-http

## Sprint 3 --- Database Design ✅

-   Schema design
-   Foreign keys
-   Constraints
-   Indexes
-   Raw SQL migrations
-   Seed scripts

## Sprint 4 --- Application Architecture ✅

-   Repository Pattern
-   Service Layer
-   Controllers
-   DTOs
-   Validation
-   Global Error Handling

## Sprint 5 --- Authentication 🚧

Completed: - Register - Login - bcrypt - JWT Service - Validation
Middleware - Authentication Middleware - Authorization Middleware -
Protected Routes

Remaining: - Role enum - GET /me - Authentication cleanup

## Sprint 6 --- Token Management

-   Refresh Tokens
-   Token Rotation
-   Logout
-   Revocation
-   Cookie vs Local Storage

## Sprint 7 --- Category Module

-   CRUD
-   Pagination
-   Filtering
-   Search

## Sprint 8 --- Product Module

-   CRUD
-   Image Upload
-   Inventory

## Sprint 9 --- Cart Module

-   Cart operations
-   Business rules

## Sprint 10 --- Orders

-   Transactions
-   BEGIN / COMMIT / ROLLBACK
-   Stock validation

## Sprint 11 --- Redis

-   Cache Aside
-   TTL
-   Cache Invalidation

## Sprint 12 --- BullMQ

-   Workers
-   Retry
-   Delayed Jobs

## Sprint 13 --- API Quality

-   Swagger / OpenAPI

## Sprint 14 --- Observability

-   Pino
-   pino-http
-   Request IDs
-   Rate Limiting
-   Security Headers

## Sprint 15 --- Docker

-   Dockerfile
-   Docker Compose
-   Multi-stage builds

## Sprint 16 --- Deployment

-   EC2
-   Railway
-   Render
-   Nginx
-   HTTPS

## Sprint 17 --- Production Hardening

-   Graceful shutdown
-   Monitoring
-   Performance tuning

## Sprint 18 --- Testing

-   Jest
-   Supertest
-   Unit tests
-   Integration tests
