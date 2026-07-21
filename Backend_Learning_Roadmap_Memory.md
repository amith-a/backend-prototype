# Backend Learning Roadmap v2

> This roadmap is an improved version of the original, preserving the
> sprint structure while expanding the learning topics.

## Sprint 1 --- Project Foundation ✅

### Completed

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

## Sprint 2 --- Core Infrastructure ✅

### Completed

- Zod environment validation
- PostgreSQL connection pool
- Singleton configuration
- Database connectivity

### Deferred

- Redis
- Docker Compose

### Concepts Learned

- Configuration management
- Database connection lifecycle

---

## Sprint 3 --- Database Design ✅

### Completed

- Users
- Roles
- Refresh Sessions
- UUIDs
- Constraints
- Foreign Keys
- Indexes
- Raw SQL Migrations
- Seed scripts

### Learn Next

- Composite Indexes
- Partial Indexes
- Covering Indexes
- EXPLAIN ANALYZE
- Query Optimization
- Cursor Pagination
- Isolation Levels
- Locking
- Deadlocks

---

## Sprint 4 --- Architecture ✅

### Completed

- Repository Pattern
- Service Layer
- Controllers
- DTOs
- Validation
- Global Error Handling
- Express 5 Validation Pipeline

### Learn Next

- Dependency Injection
- Factory Pattern
- Strategy Pattern

---

## Sprint 5 --- Authentication ✅

### Completed

- JWT
- Refresh Tokens
- Rotation
- RBAC
- HttpOnly Cookies
- Integration Tests

---

## Sprint 6 --- Categories ✅

- CRUD
- Validation
- Authorization
- Integration Tests

## Sprint 7 --- Products ✅

- CRUD
- Search
- Filtering
- Sorting
- Pagination
- Integration Tests

Deferred: - Product Images - Inventory

## Sprint 8 --- Cart ✅

- Cart Lifecycle
- Totals
- Business Rules
- Integration Tests

## Sprint 9 --- Orders ✅

- Checkout
- Transactions
- Stock Validation
- Order History
- Order Details
- Integration Tests

## Sprint 10 --- Redis ✅

Completed: - Cache Aside Pattern - Generic Cache Service - TTL - Prefix
Invalidation - Cache Consistency

Remaining: - Docker based Integration Tests

## Sprint 11 --- BullMQ ✅

Completed: - Queue Fundamentals - Producer / Consumer - Email Queue -
Email Worker - Email Processor - Order Confirmation Job - Retry
Strategy - Exponential Backoff

Remaining: - - Graceful Shutdown - Queue Cleanup - Delayed Jobs - Repeatable Jobs - Bull Board - Dead Letter
Queue - Idempotency - Integration Tests

## Sprint 12 --- Docker

- Dockerfile
- Multi-stage Builds
- Docker Compose
- API Container
- Worker Container
- PostgreSQL
- Redis
- Volumes
- Networks
- Health Checks

## Sprint 13 --- CI/CD

- GitHub Actions
- Lint
- Test
- Build
- Docker Build
- Deployment Pipeline

## Sprint 14 --- Deployment

- EC2
- Nginx
- HTTPS
- SSL
- Reverse Proxy
- PM2

## Sprint 15 --- Production Hardening

- Swagger
- Pino
- Correlation IDs
- Health Checks
- Readiness Checks
- Rate Limiting
- Compression
- Monitoring
- Metrics

## Sprint 16 --- Security

- CSRF
- XSS
- SSRF
- SQL Injection Review
- Secrets Management

## Sprint 17 --- Performance

- Event Loop
- Streams
- Backpressure
- Connection Pool Tuning
- Load Testing

## Sprint 18 --- Future Enhancements

- Product Images
- Inventory
- Reviews
- Wishlist
- Coupons
- S3 Uploads
- CDN

---

# Definition of Done

- Feature implemented
- Validation completed
- Tests passing
- Manual verification
- Documentation updated

# Project Principles

- Thin controllers
- Business logic in services
- SQL only in repositories
- Validate at API boundary
- Use transactions when required
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

- Write integration tests for every endpoint

# Next Milestone

1.  Docker Compose
2.  Redis/BullMQ Integration Tests
3.  CI/CD
4.  Deployment
5.  Production Hardening
