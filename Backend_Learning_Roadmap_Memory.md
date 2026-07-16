# Backend Learning Roadmap (Memory File)

> Goal: Build a production-ready backend using Node.js, TypeScript, Express, PostgreSQL, and raw SQL while learning real backend engineering practices.

---

# Sprint 1 — Project Foundation ✅

## Completed

- TypeScript
- Express
- Project Structure
- tsx
- Environment Variables
- app.ts / server.ts
- tsconfig.json

---

# Sprint 2 — Core Infrastructure ✅

## Completed

- Zod environment validation
- PostgreSQL connection pool
- Singleton configuration
- Database connectivity

## Deferred

- Redis
- Docker Compose

---

# Sprint 3 — Database Design ✅

## Completed

- Users
- Roles
- Refresh Sessions
- UUIDs
- Constraints
- Foreign Keys
- Indexes
- Raw SQL migrations

---

# Sprint 4 — Architecture ✅

## Completed

- Repository Pattern
- Service Layer
- Controllers
- DTOs
- Types
- Validation
- Global Error Handling

---

# Sprint 5 — Authentication ✅

## Completed

- Register
- Login
- JWT Access Tokens
- Refresh Tokens
- Refresh Token Rotation
- Session Revocation
- GET /auth/me
- Logout
- Authentication Middleware
- Authorization Middleware
- HttpOnly Cookies
- Transaction-based Refresh Rotation

### Testing

- Register
- Login
- Refresh
- Logout
- GET /me
- Middleware coverage

---

# Sprint 6 — Category Module ✅

## Completed

### Database

- Categories migration
- Category indexes

### API

- Create Category
- List Categories
- Get Category
- Update Category
- Delete Category

### Architecture

- Repository
- Service
- Controller
- Routes
- Validators

### Security

- Authentication
- Role-based Authorization (Admin)

### Testing

- Comprehensive integration tests
- Auth helper for tests
- CRUD endpoint coverage

---

# Sprint 7 — Product Module 🚧

## Planned

- Product CRUD
- Category relationship
- Product Images
- Inventory
- Pagination
- Filtering
- Searching
- Sorting

---

# Sprint 8 — Cart Module

- Cart Operations
- Quantity Validation
- Price Calculation

---

# Sprint 9 — Orders

- Transactions
- Stock Validation
- Order Creation
- Order Items

---

# Sprint 10 — Redis

- Cache Aside
- TTL
- Cache Invalidation

---

# Sprint 11 — BullMQ

- Background Jobs
- Workers
- Retry
- Notifications

---

# Sprint 12 — Docker

- Dockerfile
- Docker Compose

---

# Sprint 13 — Deployment

- EC2
- Railway / Render
- Nginx
- HTTPS
- PM2

---

# Sprint 14 — Production Hardening

- Swagger / OpenAPI
- Structured Logging
- Rate Limiting
- Compression
- Monitoring
- Graceful Shutdown
- Performance Tuning

---

# Current Status

## Completed

- Authentication Module
- Category Module
- Integration Test Infrastructure
- Test Helpers
- 95%+ Test Coverage

## Next

- Product Module
- Swagger Documentation (entire API)
- Docker
- Deployment

---

# Project Principles

- Repository contains SQL only.
- Service contains business logic only.
- Controller handles HTTP only.
- DTOs define API contracts.
- Types define internal models.
- Parameterized SQL everywhere.
- Transactions for multi-step operations.
- Hash passwords with bcrypt.
- Hash refresh tokens with SHA-256.
- Stateless access tokens.
- Stateful refresh sessions.
- Write integration tests for every endpoint.
- Finish implementation before refactoring.
- Use Arrange → Act → Assert for tests.
