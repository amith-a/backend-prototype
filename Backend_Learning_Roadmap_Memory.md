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

### Concepts Learned

- Project bootstrapping
- TypeScript configuration
- Environment management

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

### Concepts Learned

- Configuration management
- Database connection lifecycle

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
- Raw SQL Migrations
- Seed scripts

### Concepts Learned

- Relational modelling
- Constraints
- Indexes
- Migration strategy

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

### Concepts Learned

- Layered architecture
- Separation of concerns

---

# Sprint 5 — Authentication ✅

## Completed

- Register / Login
- JWT Access Tokens
- Refresh Tokens
- Refresh Token Rotation
- Refresh Sessions
- Logout
- GET /auth/me
- Authentication Middleware
- Authorization Middleware
- HttpOnly Cookies
- Transaction-based Refresh Rotation
- Comprehensive Integration Tests

### Concepts Learned

- JWT
- RBAC
- Session management
- Transactions

---

# Sprint 6 — Category Module ✅

## Completed

- Category CRUD
- Repository / Service / Controller
- Routes
- Validators
- Authentication & Authorization
- Comprehensive Integration Tests

### Concepts Learned

- CRUD architecture
- Validation
- Integration testing

---

# Sprint 7 — Product Module ✅

## Completed

- Product CRUD
- Category Relationship
- Pagination
- Searching
- Filtering
- Sorting
- Comprehensive Integration Tests

## Deferred

- Product Images
- Inventory

### Concepts Learned

- Dynamic SQL
- Pagination
- Filtering
- Searching
- Sorting

---

# Sprint 8 — Cart Module

- Cart CRUD
- Quantity Validation
- Price Calculation
- Cart Totals
- Integration Tests

# Sprint 9 — Orders

- Transactions
- Order Creation
- Order Items
- Stock Validation
- Integration Tests

# Sprint 10 — Redis

- Cache Aside
- TTL
- Cache Invalidation

# Sprint 11 — BullMQ

- Background Jobs
- Workers
- Retry

# Sprint 12 — Docker

- Dockerfile
- Docker Compose
- Multi-stage Builds

# Sprint 13 — Deployment

- EC2 / Railway / Render
- Nginx
- HTTPS
- PM2

# Sprint 14 — Production Hardening

- Complete Swagger / OpenAPI Documentation
- Structured Logging
- Graceful Shutdown
- Rate Limiting
- Compression
- Monitoring
- Performance Tuning

# Sprint 15 — Optional Enhancements

- Product Images
- Inventory
- Reviews
- Wishlist
- Coupons

---

# Current Status

## Completed

- Authentication Module
- Category Module
- Product Module
- Integration Test Infrastructure
- Test Helpers
- 95%+ Test Coverage

## Next

1. Cart Module
2. Orders
3. Redis
4. BullMQ
5. Docker
6. Deployment
7. Production Hardening

---

# Definition of Done

- Feature implemented
- Integration tests written
- Manual API testing completed
- Coverage checked
- Code reviewed
- Commit created

---

# Project Principles

- Repository contains SQL only.
- Service contains business logic only.
- Controller handles HTTP only.
- DTOs define API contracts.
- Types define internal models.
- Use parameterized SQL everywhere.
- Use transactions for multi-step operations.
- Hash passwords with bcrypt.
- Hash refresh tokens with SHA-256.
- Stateless access tokens.
- Stateful refresh sessions.
- Validate input at the API boundary.
- Keep controllers thin.
- Prefer composition over duplication.
- Write integration tests for every endpoint.
- Finish implementation before refactoring.
- Use Arrange → Act → Assert.
- Complete one module before starting another.
- Prefer learning new backend concepts before extending existing CRUD modules.
