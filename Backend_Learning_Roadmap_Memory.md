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
- Express 5 Validation (`req.validated`)
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
- Request validation pipeline
- Express 5 request lifecycle

---

# Sprint 8 — Cart Module ✅

## Completed

- Cart CRUD
- Lazy Cart Creation
- Add Item
- Update Item Quantity
- Remove Item
- Clear Cart
- Quantity Validation
- Price Calculation
- Cart Totals
- Authentication
- Comprehensive Integration Tests

### Concepts Learned

- Cart lifecycle
- Aggregate calculations
- Business rule validation
- Service orchestration
- Integration testing

---

# Sprint 9 — Orders

## Planned

- Order Checkout
- Orders Table
- Order Items Table
- PostgreSQL Transactions
- Stock Validation
- Stock Deduction
- Cart Clearing
- Order History
- Order Details
- Integration Tests

### Concepts to Learn

- ACID Transactions
- Transaction boundaries
- Rollback strategies
- Inventory consistency

---

# Sprint 10 — Redis

## Planned

- Cache Aside Pattern
- TTL
- Cache Invalidation
- Product Cache
- Category Cache

---

# Sprint 11 — BullMQ

## Planned

- Background Jobs
- Workers
- Retry Strategy
- Delayed Jobs

---

# Sprint 12 — Docker

## Planned

- Dockerfile
- Docker Compose
- Multi-stage Builds
- Development Containers

---

# Sprint 13 — Deployment

## Planned

- EC2 / Railway / Render
- Nginx Reverse Proxy
- HTTPS
- PM2
- Environment Configuration

---

# Sprint 14 — Production Hardening

## Planned

- Swagger / OpenAPI Documentation
- Structured Logging (Pino)
- Graceful Shutdown
- Rate Limiting
- Compression
- Security Headers
- Monitoring
- Performance Tuning

---

# Sprint 15 — Optional Enhancements

## Planned

- Product Images
- Inventory Management
- Reviews
- Wishlist
- Coupons
- Search Suggestions

---

# Current Status

## Completed

- Authentication Module
- Category Module
- Product Module
- Cart Module
- Express 5 Validation Pipeline
- Repository → Service → Controller Architecture
- PostgreSQL Integration
- JWT Authentication
- Refresh Token Rotation
- RBAC
- Integration Test Infrastructure
- Test Helpers
- 95%+ Test Coverage

## Next Milestone

1. Orders Module
2. Redis
3. BullMQ
4. Docker
5. Deployment
6. Production Hardening

---

# Definition of Done

- Feature implemented
- Validation added
- Integration tests written
- Manual API testing completed
- Code reviewed
- Commit created
- Documentation updated

---

# Project Principles

- Repository contains SQL only.
- Service contains business logic only.
- Controller handles HTTP only.
- DTOs define API contracts.
- Types define internal models.
- Validate input at the API boundary.
- Store validated request data in `req.validated` (Express 5).
- Keep controllers thin.
- Use parameterized SQL everywhere.
- Use transactions for multi-step operations.
- Hash passwords with bcrypt.
- Hash refresh tokens with SHA-256.
- Stateless access tokens.
- Stateful refresh sessions.
- Prefer composition over duplication.
- Write integration tests for every endpoint.
- Finish implementation before refactoring.
- Use Arrange → Act → Assert.
- Complete one module before starting another.
- Prefer learning new backend concepts before extending existing CRUD modules.

---

# Overall Progress

| Sprint                   | Status |
| ------------------------ | ------ |
| 1. Foundation            | ✅     |
| 2. Infrastructure        | ✅     |
| 3. Database Design       | ✅     |
| 4. Architecture          | ✅     |
| 5. Authentication        | ✅     |
| 6. Categories            | ✅     |
| 7. Products              | ✅     |
| 8. Cart                  | ✅     |
| 9. Orders                | ⏳     |
| 10. Redis                | ⏳     |
| 11. BullMQ               | ⏳     |
| 12. Docker               | ⏳     |
| 13. Deployment           | ⏳     |
| 14. Production Hardening | ⏳     |
| 15. Enhancements         | ⏳     |
