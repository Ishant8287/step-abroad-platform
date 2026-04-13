# Study Abroad Platform

A backend REST API for a university discovery and student application management platform. Students can search universities, get personalized program recommendations, and track their application lifecycle from draft to enrollment.

---

## Features

- **JWT Authentication** — register, login, protected routes with role-based access (student / counselor)
- **Recommendation Engine** — built entirely with MongoDB aggregation pipeline, not in-memory JS scoring. Weighted scoring across country match, field match, budget, intake availability, and IELTS score
- **Application Lifecycle** — strict status transition enforcement (draft → submitted → under-review → offer-received → visa-processing → enrolled / rejected) with full audit trail via timeline array
- **University & Program Discovery** — filter by country, degree level, field, budget, intake, scholarship availability with full pagination and sorting
- **TTL-based Caching** — in-memory cache for high-traffic endpoints (popular universities, recommendations, dashboard). Cache TTL configurable via environment variable
- **Compound Indexing** — duplicate prevention at DB level via compound unique index on `{student, program, intake}`. Optimized query indexes on all filter fields
- **Automated Tests** — covers registration, duplicate prevention, login, wrong password, and protected route auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 + Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Caching | In-memory TTL Map (Redis-ready) |
| Testing | Jest + Supertest |
| Dev | Nodemon, Morgan |

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # DB connection, env validation, constants
│   ├── controllers/     # Request/response logic per feature
│   ├── middleware/      # Auth, error handler, 404
│   ├── models/          # Mongoose schemas (Student, University, Program, Application)
│   ├── routes/          # Express routers
│   ├── services/        # Business logic (recommendation engine, cache)
│   ├── utils/           # asyncHandler, HttpError
│   ├── scripts/         # DB seed script
│   ├── tests/           # Jest test suites
│   ├── app.js           # Express app setup
│   └── server.js        # HTTP server entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally

### Setup

```bash
git clone https://github.com/Ishant8287/study-abroad-platform
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| PORT | Server port | 4000 |
| MONGODB_URI | MongoDB connection string | mongodb://127.0.0.1:27017/study-abroad |
| JWT_SECRET | Secret for signing JWTs | — |
| JWT_EXPIRES_IN | Token expiry | 1d |
| CACHE_TTL_SECONDS | Cache TTL in seconds | 300 |

### Sample Credentials (after seed)

- Student: `aarav@example.com` / `Candidate123!`
- Counselor: `counselor@example.com` / `Candidate123!`

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get own profile |

### Universities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/universities | No | List with filters + pagination |
| GET | /api/universities/popular | No | Top 6 by popularity (cached) |

### Programs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/programs | No | Filter by country, field, degree, budget, intake |

### Recommendations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/recommendations/:studentId | Yes | Aggregation-based top 5 program matches |

### Applications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/applications | Yes | Apply to a program |
| GET | /api/applications | Yes | List applications with filters |
| PATCH | /api/applications/:id/status | Yes | Update status (strict transition enforcement) |

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/dashboard/overview | No | Total stats + status breakdown + top countries (cached) |

---

## Architecture Decisions

### Recommendation Engine
Built using MongoDB aggregation pipeline instead of fetching all programs to JS and scoring in-memory. This means filtering, scoring, and sorting all happen at the database level — significantly better performance as data grows.

Scoring weights:
- Country match: +35
- Field match: +30
- Within budget: +20
- Preferred intake available: +10
- IELTS score meets minimum: +5

### Caching Strategy
High-read, low-write endpoints (popular universities, dashboard overview, recommendations) use a TTL-based in-memory Map. Cache TTL is configurable via env. The service is designed as a drop-in replacement for Redis — swapping it out requires changing only `cacheService.js`.

### Indexing Strategy
- `Application`: compound unique index on `{student, program, intake}` prevents duplicate applications at the DB level, not just in application code
- `Application`: individual indexes on `student`, `program`, `status`, `destinationCountry` for filtered list queries
- `Program`: compound index on `{country, degreeLevel, field, tuitionFeeUsd}` covering the most common filter combination
- `University`: text index on `{name, country, city}` for search, plus index on `popularScore` for ranking queries

### Application Status Transitions
Valid transitions are defined in `config/constants.js`. Every `PATCH /status` request is validated against this map — no skipping steps, no invalid rollbacks. Every change appends to a `timeline` array for a full audit trail.

---

## Running Tests

```bash
npm test
```

Covers: registration, duplicate email, login, wrong password, protected route auth.

---

## What I'd Improve With More Time

- Replace in-memory cache with Redis for multi-instance support
- Add Zod validation on all request bodies
- Add refresh token rotation with httpOnly cookies
- Add rate limiting on auth endpoints
- Paginate the applications list endpoint
- Add RBAC — counselors should be able to manage any student's application, students only their own
