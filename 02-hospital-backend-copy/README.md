# Hospital Backend — P3 Engineering

Bản copy từ P2, nâng cấp thành backend engineering project:

- Testing (Jest unit + integration) + Postman collection
- Structured logging + requestId
- Docker / Docker Compose (Postgres + Redis + API)
- Swagger / OpenAPI đầy đủ hơn
- Clean architecture (routes tách, refresh trong service)
- Strategy pattern (notification jobs)
- GitHub Actions CI
- Redis cache-aside + Redis rate limit
- BullMQ queue (notify-appointment) + worker
- Security (helmet, CORS config, secret redaction)
- Deploy notes (Nginx / HTTPS / rollback)

> P2 gốc (`02-hospital-backend`) **không** bị sửa. Chỉ làm việc trong thư mục này.

## Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js 20+ |
| API | Express 5 |
| DB | PostgreSQL + Prisma |
| Auth | JWT + bcrypt + RBAC |
| Validation | Zod |
| Cache / Rate limit | Redis (ioredis) — memory fallback nếu không có `REDIS_URL` |
| Queue | BullMQ — memory fallback nếu không có Redis |
| Docs | Swagger UI `/docs` |

## Quick start (local)

```bash
cp .env.example .env
# chỉnh DATABASE_URL, JWT_*, REDIS_URL

npm install
npx prisma generate
npx prisma migrate deploy

npm run dev          # API (+ embed worker nếu có Redis)
npm run worker       # worker riêng (optional)
```

Health: `GET http://localhost:3000/health`  
Docs: `http://localhost:3000/docs`

## Docker Compose

```bash
docker compose up --build
```

Services: `postgres`, `redis`, `api`.  
Worker riêng: `docker compose --profile full up --build`.

## Tests

```bash
npm test                 # unit + integration (health luôn chạy)
npm run test:unit
npm run test:integration # booking flow cần DATABASE_URL
```

Không set `REDIS_URL` trong test → dùng memory fallback.

## Postman

Import:

- `postman/Hospital-Backend-P3.postman_collection.json`
- `postman/Hospital-P3-Local.postman_environment.json`

Flow: Login (lưu token) → Appointments.

## Scripts

- `scripts/linux-dev-check.sh` — pwd/ls/env tip (Git Bash / Linux)
- `scripts/health-check.sh` — curl health/ready

## Deploy

Xem `deploy/DEPLOY.md` và `deploy/nginx.conf.example`.

## Kiến trúc request

```
HTTP
 → helmet / cors / json
 → requestLogger (requestId)
 → rateLimit (Redis|memory)
 → route + validateBody + requireAuth + requirePermission
 → controller → service → repository → Prisma → PostgreSQL
 → cache (Redis|memory) trên list/stats
 → enqueue notify-appointment (BullMQ|memory)
 → errorHandler (structured log, no secrets)
```

## Phase A skill coverage (implementation)

| Pass | Skills (IDs) | Delivered |
|------|--------------|-----------|
| 1 | 365–416 | Jest, Postman, logging, debug foundation |
| 2 | 417–481 | Docker, Compose, Swagger, README, scripts |
| 3 | 482–527 | Clean routes/services, patterns, agile docs, CI |
| 4 | 528–574 | Deploy, security, Redis, BullMQ, concurrency |
| 5 | verify | Full suite + polish |

Learning dissection từng ID diễn ra ở **Phase B** (chưa bắt đầu).
