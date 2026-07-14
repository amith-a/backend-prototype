# Backend Learning Roadmap (Memory File)

> Goal: Build a production-ready backend using Node.js, TypeScript,
> Express, PostgreSQL, and raw SQL while learning real backend
> engineering practices.

---

# Sprint 1 --- Project Foundation ✅

## Topics

- TypeScript
- Express
- Project Structure
- tsx
- Environment Variables
- app.ts
- server.ts
- tsconfig.json

Deliverables

- ✅ Project bootstrapped
- ✅ Folder structure
- ✅ Environment configuration

---

# Sprint 2 --- Core Infrastructure ✅

## Topics

- Zod Environment Validation
- PostgreSQL Connection Pool
- Singleton Pattern
- Configuration Management
- Database Connection Test

Deliverables

- ✅ env.ts
- ✅ postgres.ts
- ✅ Database connectivity

Deferred

- Redis
- Docker Compose
- Pino
- pino-http

---

# Sprint 3 --- Database Design ✅

## Topics

- Schema Design
- UUID vs SERIAL
- Constraints
- Foreign Keys
- Indexes
- Naming Conventions
- Audit Columns
- Raw SQL Migrations
- Seed Scripts

Deliverables

- ✅ users
- ✅ roles
- ✅ refresh_sessions

---

# Sprint 4 --- Application Architecture ✅

## Topics

- Repository Pattern
- Service Layer
- Controllers
- DTOs
- Types
- Validation
- Global Error Handling

Deliverables

- ✅ Clean Architecture
- ✅ Repository Layer
- ✅ Service Layer

---

# Sprint 5 --- Authentication ✅

## Topics

- bcrypt
- JWT
- Authentication Middleware
- Authorization Middleware
- HttpOnly Cookies
- Refresh Tokens
- Session-based Authentication

Completed

- ✅ Register
- ✅ Login
- ✅ Password Hashing
- ✅ JWT Service
- ✅ Access Tokens
- ✅ Refresh Tokens
- ✅ Authentication Middleware
- ✅ Authorization Middleware
- ✅ GET /me
- ✅ Refresh Sessions
- ✅ Refresh Token Rotation
- ✅ Logout
- ✅ Session Revocation
- ✅ Transaction-based Session Rotation

---

# Sprint 6 --- API Quality 🚧

Goal: Make the project production-ready before building business
modules.

## Topics

### Logging

- Pino
- pino-http
- Request IDs

### API Documentation

- Swagger/OpenAPI

### Testing

- Jest
- Supertest
- Authentication Integration Tests

### Cleanup

- Cookie configuration
- Consistent API responses
- Logging strategy

Deliverables

- logger.ts
- request logger middleware
- Swagger documentation
- Auth integration tests

---

# Sprint 7 --- Category Module

## Topics

- CRUD
- Pagination
- Filtering
- Searching
- Validation
- Soft Delete

Endpoints

GET /categories

GET /categories/:id

POST /categories

PUT /categories/:id

DELETE /categories/:id

---

# Sprint 8 --- Product Module

## Topics

- CRUD
- Product Images
- Inventory
- Category Relationship
- Pagination
- Filtering
- Search
- Sorting

Endpoints

GET /products

GET /products/:id

POST /products

PUT /products/:id

DELETE /products/:id

---

# Sprint 9 --- Cart Module

## Topics

- Cart Operations
- Business Rules
- Quantity Validation
- Price Calculation

---

# Sprint 10 --- Orders

## Topics

- Transactions
- BEGIN
- COMMIT
- ROLLBACK
- Stock Validation
- Order Creation
- Order Items

---

# Sprint 11 --- Redis

## Topics

- Cache Aside
- TTL
- Cache Invalidation
- Key Design

---

# Sprint 12 --- BullMQ

## Topics

- Background Jobs
- Workers
- Retry
- Delayed Jobs

Examples

- Email Queue
- Inventory Sync
- Notifications

---

# Sprint 13 --- Docker

## Topics

- Dockerfile
- Docker Compose
- Multi-stage Builds
- Environment Variables

---

# Sprint 14 --- Deployment

Deploy To

- EC2
- Railway
- Render

Topics

- Nginx
- Reverse Proxy
- HTTPS
- PM2
- Production Environment Variables

---

# Sprint 15 --- Production Hardening

## Topics

- Graceful Shutdown
- Structured Logging
- Security Headers
- Rate Limiting
- Compression
- Monitoring
- Performance Tuning

---

# Project Principles

- Repository contains SQL only.
- Service contains business logic only.
- Controller handles HTTP only.
- DTOs represent API contracts.
- Types represent internal application models.
- Use parameterized SQL everywhere.
- Use transactions for multi-step database operations.
- Never store raw refresh tokens.
- Hash refresh tokens with SHA-256.
- Hash passwords with bcrypt.
- Keep authentication stateless for access tokens and stateful for
  refresh sessions.

---

# Current Progress Update (2026-07)

## Sprint 6 --- API Quality 🚧

Completed

- ✅ Pino
- ✅ pino-http
- ✅ Swagger/OpenAPI
- ✅ Jest
- ✅ Supertest
- ✅ Test database setup
- ✅ .env.test configuration
- ✅ Health integration tests
- ✅ Register integration tests
- ✅ Login integration tests
- ✅ Request logging strategy for tests

In Progress

- 🚧 Refresh integration tests
- 🚧 GET /me integration tests
- 🚧 Logout integration tests

Remaining

- Authentication test suite review
- Cookie/session verification cleanup

---

# Timeline

## Monday

- Finish refresh.test.ts
- Finish me.test.ts
- Finish logout.test.ts
- Complete Sprint 6

## Tuesday

- Sprint 7: Category Module + integration tests

## Wednesday

- Sprint 8: Product Module + integration tests

## Thursday

- Sprint 9: Cart Module
- Sprint 10: Orders

## Friday

- Integration tests for Cart & Orders
- Bug fixing
- Final project cleanup
- README update
- End-to-end verification

---

# Remaining Roadmap

- Sprint 11 --- Redis
- Sprint 12 --- BullMQ
- Sprint 13 --- Docker
- Sprint 14 --- Deployment
- Sprint 15 --- Production Hardening

---

# Notes

- Finish implementation before refactoring.
- Continue using Arrange → Act → Assert in integration tests.
