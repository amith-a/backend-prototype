backend-prototype/
│
├── src/
│ ├── app.ts
│ ├── server.ts
│ ├── config/
│ ├── routes/
│ ├── controllers/
│ ├── services/
│ ├── repositories/
│ ├── middleware/
│ ├── db/
│ ├── utils/
│ ├── validators/
│ ├── types/
│ ├── cache/
│ ├── jobs/
│ └── workers/
│
├── package.json
├── tsconfig.json
├── .env
├── .gitignore
└── README.md

src/
│
├── config/
│ ├── env.ts
│ ├── logger.ts
│ ├── postgres.ts
│ └── redis.ts
│
├── db/
│ ├── migrations/
│ └── seeds/
│
├── repositories/
│
├── services/
│
├── controllers/
│
├── routes/
│
├── middleware/
│
├── validators/
│
├── types/
│
├── utils/
│
├── app.ts
│
└── server.ts

---

                Client
                   │
             Express API
                   │
        ┌──────────┼──────────┐
        │          │          │

Controllers Middleware Swagger
│
Services
│
Repositories
│
PostgreSQL
│
Redis Cache
│
BullMQ Workers

---

Sprint 1 Project Foundation

Goal: Bootstrappable application.

Learn
TypeScript setup
Express
Folder structure
Environment variables
tsx
Health endpoint
Deliverables
✅ app.ts
✅ server.ts
✅ tsconfig.json
✅ Folder structure

Sprint 2 🚧 Infrastructure

Goal: Production-ready application initialization.

Learn
Configuration management
Zod environment validation
Pino logging
PostgreSQL Pool
pool.query() vs pool.connect()
Singleton pattern
Dependency initialization
Deliverables
config/
├── env.ts
├── logger.ts
├── postgres.ts
└── redis.ts

Still remaining:

Database connectivity test
Startup initialization
Docker Compose
Health check improvements
Request logging (pino-http)

Sprint 3 Database Design

This is where backend engineering really starts.

Learn
Schema design
UUID vs SERIAL
Constraints
Foreign Keys
Indexes
Naming conventions
Soft deletes
Audit columns
Tables
users

roles

products

orders

order_items

We'll write raw SQL migrations ourselves.

Sprint 4 Repository Layer

Now we start writing SQL.

Learn
Repository Pattern
Parameterized SQL
Mapping database rows
Error handling
Query organization

Example

UserRepository

ProductRepository

OrderRepository

No business logic.

Only SQL.

Sprint 5 Authentication
Learn
bcrypt
JWT
Refresh tokens (optional)
Authorization middleware
RBAC

Endpoints

POST /register

POST /login

GET /me
Sprint 6 Products
Learn
CRUD
Pagination
Filtering
Searching
Validation (Zod)

Example

GET /products

POST /products

PUT /products/:id
Sprint 7 Orders

One of the most important sprints.

Learn

Transactions

BEGIN

↓

Insert Order

↓

Insert Items

↓

Update Inventory

↓

COMMIT

Topics

Transactions
Rollback
Locking
Stock validation

Sprint 8 Redis
Learn
Cache Aside
TTL
Cache Invalidation
Key Design

Example

GET Product

↓

Redis

↓

Miss

↓

Postgres

↓

Redis

Sprint 9 BullMQ
Learn
Background jobs
Workers
Retry
Delayed jobs

Flow

Create Order

↓

Queue Job

↓

Worker

↓

Mock Email
Sprint 10 Middleware

Topics

Rate Limiting
Global Error Handler
Request Validation
Authentication Middleware
Request ID
pino-http

Sprint 11 Swagger

Learn

OpenAPI
YAML
Documentation

Sprint 12 Docker

Learn

Dockerfile
Docker Compose
Multi-stage build
Environment variables
Health checks

Sprint 13 Deployment

Deploy to:

EC2
Render
Railway

Learn

Reverse proxy
Nginx
HTTPS
Environment variables
Production startup

Sprint 14 Production Improvements

This is where we make the project feel like something used in a real company.

Topics

Graceful shutdown
Connection cleanup
Centralized error handling
Structured logging
Request IDs
Security headers
CORS configuration
Compression
Performance tuning

users
----------------------

id
name
email
phone
password_hash
created_at
updated_at

products
-------------------------

id
sku
name
description
price
stock
category_id
is_active
created_at
updated_at

orders
-------------------------

id
user_id
status
total_amount
created_at
updated_at

order_items
-------------------------

id
order_id
product_id
quantity
unit_price
created_at
