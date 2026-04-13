# Waygood Backend Assignment

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally

### Steps
```bash
git clone https://github.com/Ishant8287/waygood-assignment
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 4000 |
| MONGODB_URI | MongoDB connection string | mongodb://127.0.0.1:27017/waygood-evaluation |
| JWT_SECRET | Secret for signing JWTs | dev-secret |
| JWT_EXPIRES_IN | Token expiry | 1d |
| CACHE_TTL_SECONDS | Cache TTL in seconds | 300 |

### Sample Credentials (after seed)
- student: `aarav@example.com` / `Candidate123!`
- counselor: `counselor@example.com` / `Candidate123!`

---

## Architecture Decisions

### Auth
- JWT stored client-side, stateless auth
- Passwords hashed via bcrypt (10 salt rounds) using Mongoose pre-save hook
- Single Student model handles both student and counselor roles via `role` field

### Application Workflow
- Valid status transitions defined in `config/constants.js`
- Duplicate prevention via unique compound index on `{student, program, intake}`
- Every status change appends to `timeline` array for full audit trail

### Recommendation Engine
- Built using MongoDB aggregation pipeline (not in-memory JS scoring)
- Scoring logic:
  - Country match: +35
  - Field match: +30
  - Within budget: +20
  - Intake match: +10
  - IELTS score met: +5
- Returns top 5 matches with reasons array

### Caching
- In-memory cache using a TTL-based Map (cacheService.js)
- Cached endpoints: popular universities, dashboard overview, recommendations
- Cache TTL configurable via CACHE_TTL_SECONDS env variable
- Redis can replace this in production for multi-instance deployments

### Indexing Strategy
- `Application`: compound unique index on `{student, program, intake}` prevents duplicates at DB level
- `Application`: individual indexes on `student`, `program`, `status`, `destinationCountry`
- `Program`: compound index on `{country, degreeLevel, field, tuitionFeeUsd}` for filtered discovery queries
- `University`: text index on `{name, country, city}` for search, index on `popularScore`

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get profile |
| GET | /api/universities | No | List with filters |
| GET | /api/universities/popular | No | Cached top 6 |
| GET | /api/programs | No | List with filters |
| GET | /api/recommendations/:studentId | Yes | Aggregation-based recommendations |
| POST | /api/applications | Yes | Apply to program |
| PATCH | /api/applications/:id/status | Yes | Update status |
| GET | /api/applications | Yes | List applications |
| GET | /api/dashboard/overview | No | Cached dashboard stats |

---

## Assumptions
- One Student model is used for both students and counselors
- Recommendation engine only considers programs from student's target countries
- In-memory cache resets on server restart — acceptable for this scope
- Status transitions are strictly enforced, no skipping allowed

## Testing
```bash
npm test
```
Covers: registration, duplicate email, login, wrong password, protected route auth.
