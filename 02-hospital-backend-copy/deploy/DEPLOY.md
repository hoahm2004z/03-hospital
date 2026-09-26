# Deployment checklist — Hospital Backend P3

## Pre-deploy
- [ ] Set production secrets (`JWT_*`, `DATABASE_URL`, `REDIS_URL`)
- [ ] `CORS_ORIGIN` locked to real frontend origin(s)
- [ ] `NODE_ENV=production`
- [ ] `EMBED_WORKER=false` if running dedicated `npm run worker`
- [ ] Migrations reviewed: `npx prisma migrate deploy`

## Deploy steps
1. Pull release tag / merge to main
2. `npm ci`
3. `npx prisma generate && npx prisma migrate deploy`
4. Restart API process (systemd / pm2 / docker)
5. Restart worker if separate
6. Hit `GET /health` and `GET /ready`
7. Smoke: login → list appointments

## Rollback
1. Redeploy previous image/tag
2. If migration is irreversible, restore DB snapshot first
3. Verify `/health` + critical booking path

## Logs
- Structured JSON on stdout (journalctl / docker logs)
- Filter by `requestId` from error responses

## HTTPS
- Terminate TLS at Nginx (see `nginx.conf.example`)
- App listens HTTP on localhost:3000 only
