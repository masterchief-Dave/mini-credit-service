# Mini Credit Service

A Bun + Express + Prisma service for uploading bank statements, generating insights, and running a (mock) bureau check. Uses MySQL and ships with **Adminer** to inspect the database.

---

## Stack

- **Runtime:** Bun
- **Web:** Express 5, Helmet, CORS, Rate limit
- **DB:** MySQL 8 + Prisma ORM
- **Auth:** JWT
- **Validation:** Zod (DTOs)
- **Logging:** pino / pino-http
- **CSV:** express-fileupload + csv-parser
- **Email:** nodemailer + handlebars templates

---

## Key Endpoints (v1)

- `GET /api/v1/health` — health check
- `POST /api/v1/statements/upload` — upload CSV statement (stores rows as transactions; returns parsing metadata)
- `POST /api/v1/insights/run` — compute insights for one/many statements
- `GET  /api/v1/insights/:id` — fetch insight (owner or ADMIN)
- `POST /api/v1/bureau/check` — mock bureau check (static normalized result, persisted)
- `POST /api/v1/auth/register` — register
- `POST /api/v1/auth/login` — login
- `POST /api/v1/auth/verify-otp` — verify email/OTP
- `POST /api/v1/admin/onboarding` — admin-assisted user creation

---

## Getting Started (Local Dev)

### 1) Install

```bash
bun install
```

## App

```sh
PORT=5000
NODE_ENV=development
APP_NAME="Mini Credit Insight"
CLIENT_BASE_URL="http://localhost:3000"
SUPPORT_EMAIL="Mini Credit <support.credit@email.com>"
Auth
JWT_SECRET="change-me"
JWT_EXPIRES_IN="10d"
LOG_LEVEL=info
PRETTY_LOGS=true
DATABASE_URL="mysql://root:root@localhost:3306/mini_credit_db"
MOCK_BUREAU_URL=""
BUREAU_API_KEY=""
```

## generate prisma client

`bun run prisma:generate`

## create & apply dev migration

`bun run prisma:migrate`

## Start the server

`bun run dev`

## build and start everything

`docker compose up -d --build`

### Adminer (DB UI)

Use Adminer to inspect the database:

```bash
URL: http://localhost:8080
System: MySQL
Server: db
Username: user
Password: password
Database: mini_credit_db
```

### Seeding

If you added a seed script for an admin:

`bun run seed:admin`

### or inside the container

`docker compose exec app bun run seed:admin`

### Testing

`NODE_ENV=test bun test`

### Bureau Check (Mock, Static)

POST /bureau/check always returns the same normalized payload (score, risk band, etc.) and persists a BureauReport.

If MOCK_BUREAU_URL is set, the service will attempt an HTTP call with retries/timeouts and X-API-KEY (from BUREAU_API_KEY) but still returns the static normalized values outward.

```text
# Health
curl -s http://localhost:5000/api/v1/health

# Upload CSV
curl -X POST http://localhost:5000/api/v1/statements/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/Transactions_CSV.csv" \
  -F "statementName=January Statement"

# Run insights
curl -X POST http://localhost:5000/api/v1/insights/run \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"statementId":"<returned_statement_id>"}'

# Get insight
curl -X GET http://localhost:5000/api/v1/insights/<insight_id> \
  -H "Authorization: Bearer <token>"

# Bureau check
curl -X POST http://localhost:5000/api/v1/bureau/check \
  -H "Authorization: Bearer <token)" \
  -H "Content-Type: application/json" \
  -d '{}'

```

### Notes / Planned Improvements

- Email queue (BullMQ/Redis): move email sending to a background job to keep API responses fast and add retries/backoff.

- OTP lifecycle: periodically clear the OTP table (TTL/cron) to avoid stale records.

- Metrics/Tracing: export metrics to Prometheus and consider OpenTelemetry for tracing.

- Uploads & parsing: better handling of document uploads and parsing (multi-bank formats, header mapping, locale-aware numbers/dates, stronger validation), optional S3/object storage for originals.

- Onboarding process: richer admin/user onboarding flow, temporary passwords, verification links, and improved templates.

- RBAC & Auditing: finer-grained permissions and comprehensive admin action logs.

### Project Info

Runtime: Bun v1.2.7

Start (compose): `docker compose up -d --build`

Start (dev): `bun run dev`
