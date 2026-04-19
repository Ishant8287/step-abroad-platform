# Step Abroad — University Application Platform API

A production-ready REST API for international university discovery and student application management. Students search programs, receive personalized recommendations, and track their application through a strict lifecycle from draft to enrollment.

---

## Live

⚙️ **API (Render)** → https://study-abroad-platform-c4uh.onrender.com
📦 **GitHub** → https://github.com/Ishant8287/step-abroad-platform

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 + Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (access) + SHA-256 hashed refresh tokens |
| Cache | In-memory TTL Map + Redis (drop-in swap) |
| File Uploads | Cloudinary |
| Email | Nodemailer (SMTP) |
| AI | Groq API (LLaMA 3.1) |
| Testing | Jest + Supertest |

---

## Features

- **JWT auth with refresh token rotation** — access tokens (15m), refresh tokens (7d) stored as SHA-256 hashes, rotated on every use
- **Role-based access control** — student / counselor / admin with middleware-level enforcement
- **FSM application lifecycle** — 7-stage pipeline with strict transition validation and full audit trail per application
- **Dual recommendation engine** — MongoDB aggregation pipeline (rule-based) with Groq AI fallback; graceful degradation if Groq times out
- **Dual cache layer** — in-memory TTL Map with optional Redis upgrade; designed as drop-in replacement (only `cacheService.js` changes)
- **Document uploads** — PDF/image uploads via Cloudinary with per-application, per-type deduplication
- **Email notifications** — fire-and-forget status change emails via Nodemailer; API never blocks on mail failures
- **XSS sanitization** — custom middleware strips HTML/script tags from all incoming JSON body fields
- **Rate limiting** — 10 req/15min on login, 5 req/15min on register, 30 req/15min on token refresh

---

## Application Lifecycle

```
draft → submitted → under-review → offer-received → visa-processing → enrolled
                                                   ↘ rejected (from any active stage)
```

Every `PATCH /status` request is validated against a transitions map in `config/constants.js`. Invalid transitions return a 400 with a clear error. Each change appends to a `timeline` array stored on the application — no history is lost.

---

## Recommendation Engine

Two engines, automatic fallback:

**Rule-based (MongoDB aggregation pipeline)**
Scoring happens entirely at the database level — no in-memory JS. Weighted criteria:

| Signal | Weight |
|---|---|
| Country match | +35 |
| Field match | +30 |
| Within budget | +20 |
| Preferred intake available | +10 |
| IELTS score meets minimum | +5 |

**Groq AI (LLaMA 3.1)**
When `GROQ_API_KEY` is set, up to 30 candidate programs are sent to Groq for LLM-based ranking with natural language reasoning per recommendation. If Groq fails or times out, the system automatically falls back to the rule-based engine and logs `meta.fallbackFrom: "groq"` in the response.

---

## Caching Strategy

High-read, low-write endpoints use TTL-based caching:

| Cache Key | Invalidated On |
|---|---|
| `popular-universities` | TTL expiry only |
| `dashboard-overview` | Application create / status update |
| `recommendations-{studentId}-{engine}` | Profile update |

To upgrade to Redis, set `CACHE_PROVIDER=redis` and `REDIS_URL` — no other code changes needed.

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # DB, env validation, FSM transition constants
│   ├── controllers/     # Request/response logic per feature
│   ├── middleware/      # Auth, RBAC, error handler, sanitizer, upload, 404
│   ├── models/          # Student, University, Program, Application, Document, RefreshToken
│   ├── routes/          # Express routers
│   ├── services/        # Cache, recommendation engine, Groq, email, Cloudinary
│   ├── utils/           # asyncHandler, HttpError
│   ├── scripts/         # DB seed
│   ├── tests/           # Jest test suites
│   ├── app.js
│   └── server.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally

### Setup

```bash
git clone https://github.com/Ishant8287/step-abroad-platform
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `4000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/study-abroad` |
| `JWT_SECRET` | Required in production | — |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `REFRESH_TOKEN_SECRET` | Required in production | — |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry | `7d` |
| `CACHE_PROVIDER` | `memory` or `redis` | `memory` |
| `CACHE_TTL_SECONDS` | Cache TTL | `300` |
| `REDIS_URL` | Redis connection URL | — |
| `GROQ_API_KEY` | Enables AI recommendations | — |
| `GROQ_MODEL` | Groq model | `llama-3.1-8b-instant` |
| `GROQ_TIMEOUT_MS` | Groq request timeout | `5000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary config | — |
| `CLOUDINARY_API_KEY` | Cloudinary config | — |
| `CLOUDINARY_API_SECRET` | Cloudinary config | — |
| `SMTP_HOST` | SMTP server | — |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | — |
| `SMTP_PASS` | SMTP password | — |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Seed Credentials

After `npm run seed`:

| Role | Email | Password |
|---|---|---|
| Student | `aarav@example.com` | `Candidate123!` |
| Student | `sara@example.com` | `Candidate123!` |
| Counselor | `counselor@example.com` | `Candidate123!` |
| Admin | `admin@example.com` | `AdminPassword123!` |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns access + refresh token |
| POST | `/refresh` | Public | Rotate refresh token, get new access token |
| POST | `/logout` | User | Invalidate refresh token |
| GET | `/me` | User | Get current user profile |
| PATCH | `/profile` | User | Update profile fields |

### Universities — `/api/universities`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List with filters + pagination |
| GET | `/popular` | Public | Top 6 by popularity score (cached) |
| GET | `/:id` | Public | Get single university |

### Programs — `/api/programs`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | User | Filter by country, field, degree, budget, intake |
| GET | `/:id` | User | Get single program |

### Recommendations — `/api/recommendations`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/me` | User | Top 5 matches for signed-in student (cached) |
| GET | `/:studentId` | User | Top 5 matches by student ID |

### Applications — `/api/applications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Student | Apply to a program |
| GET | `/` | User | List applications (students see own only) |
| PATCH | `/:id/status` | Student / Admin | Update status (strict FSM enforcement) |

### Documents — `/api/documents`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | User | Upload document (PDF/image, max 5MB) |
| GET | `/` | User | List documents with filters |
| DELETE | `/:id` | User | Delete document |

### Dashboard — `/api/dashboard`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/overview` | Admin / Counselor | Stats + status breakdown + top countries (cached) |

---

## Running Tests

```bash
npm test
```

Covers: auth flows, duplicate prevention, protected route enforcement, RBAC guards, FSM transition validation, recommendation engine, cache service Redis/memory sync, Groq error handling, env config validation, and seed safety.

---

## Security

- Passwords hashed with bcrypt (10 rounds) via Mongoose pre-save hook
- Refresh tokens stored as SHA-256 hashes — plain token never touches the DB
- Token rotation on every refresh — old token invalidated immediately
- MongoDB TTL index auto-deletes expired refresh tokens
- XSS protection via custom body sanitizer on every request
- Admin self-registration blocked at the API level
- Helmet.js security headers on every response
- CORS configured with explicit allowed origin

---

## What I'd Add Next

- httpOnly cookie transport for refresh tokens
- Zod validation on all request bodies
- Counselor-to-application assignment model (currently blocked by design)
- Pagination on the applications list endpoint
- Background job queue for email notifications

---

## License

MIT
