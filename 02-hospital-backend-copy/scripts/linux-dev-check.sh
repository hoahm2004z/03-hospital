#!/usr/bin/env bash
# Linux/Git-Bash helper — print cwd, list key files, show listening tip
set -euo pipefail
echo "== pwd =="
pwd
echo "== ls project root =="
ls -la
echo "== env (safe keys) =="
echo "NODE_ENV=${NODE_ENV:-unset}"
echo "PORT=${PORT:-3000}"
echo "REDIS_URL set? $([ -n "${REDIS_URL:-}" ] && echo yes || echo no)"
echo "== tip: health =="
echo "curl -s http://localhost:3000/health | head"
