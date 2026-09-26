# Performance notes — Hospital Backend P3

## Current optimizations
- List/stats **cache-aside** (Redis or memory) with TTL
- Cache invalidation by prefix on write
- Pagination (`page`/`limit` max 50)
- Prisma indexes via unique constraints (`User.email`, `Appointment(doctorId,time)`)
- Rate limiting to protect against abuse storms
- Async notification via queue (HTTP không chờ gửi notify)

## How to find bottlenecks
1. Check `durationMs` in structured request logs
2. Reproduce slow endpoint
3. Hypothesis: DB vs cache miss vs N+1
4. Use Prisma query logging / `EXPLAIN` on raw SQL
5. Fix → re-measure → regression test

## Concurrency
- Booking uses transaction + unique constraint to avoid double booking under concurrent requests
- BullMQ worker `QUEUE_CONCURRENCY` controls parallel job processing
