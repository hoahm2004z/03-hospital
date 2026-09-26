# Git / Branch / PR workflow (simulation for P3 learning)

## Branch naming
- `main` — stable
- `feature/<short-name>` — new capability
- `bugfix/<short-name>` — fix

## Local flow
```bash
git status
git checkout -b feature/p3-engineering
git add .
git commit -m "feat: hospital p3 engineering upgrades"
git push -u origin HEAD
```

## Pull Request
Use `docs/PR_TEMPLATE.md` for description.
Reviewers check: tests, secrets, API contract, rollback.

## Merge
Prefer squash or merge commit after approve.
Verify CI green before merge.
