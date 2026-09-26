# Security notes — Hospital Backend P3

## Mitigations in this project

| Threat | Mitigation |
|--------|------------|
| SQL Injection | Prisma parameterized queries; raw SQL only static template for stats |
| XSS | API returns JSON; no HTML rendering |
| CSRF | Stateless JWT Bearer (no cookie session for API) |
| CORS | Configurable via `CORS_ORIGIN` |
| Password | bcrypt hash, never logged |
| Token | Separate access/refresh secrets; expiry; Bearer only |
| Rate limit | Redis-backed (shared) or memory fallback |
| Sensitive logs | `logger.redact` strips password/tokens |
| Headers | `helmet()` |

## Review checklist
- [ ] No hard-coded production secrets
- [ ] Debug routes disabled/gated in production (`/debug/headers`)
- [ ] Validation on all write endpoints
- [ ] RBAC on protected resources
