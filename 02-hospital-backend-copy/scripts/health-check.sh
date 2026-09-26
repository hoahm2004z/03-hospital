#!/usr/bin/env bash
# Smoke health check against running API
set -euo pipefail
BASE_URL="${1:-http://localhost:3000}"
echo "GET $BASE_URL/health"
curl -sf "$BASE_URL/health"
echo
echo "GET $BASE_URL/ready (may 503 if DB down)"
curl -s "$BASE_URL/ready" || true
echo
