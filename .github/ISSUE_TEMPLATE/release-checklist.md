---
name: Release Checklist
about: Run through checks before tagging a release
title: "Release vX.Y.Z"
labels: release
assignees: ''
---

## Pre‑release
- [ ] Update `CHANGELOG.md` with highlights and breaking changes
- [ ] Update docs if needed (`docs/dev-guide.md`, `docs/AUTHORING.md`, `docs/UNIFIED-API.md`)
- [ ] Ensure examples reflect latest APIs (notifications, cart badge, theme)

## Validation
- [ ] Type check: `deno task check`
- [ ] Format check: `deno task fmt:check`
- [ ] Lint: `deno task lint`
- [ ] Tests: `deno task test`
- [ ] Coverage (optional): `deno task coverage` (verify `coverage/coverage.lcov`)

## Manual QA (examples)
- [ ] Navbar cart badge updates via pub/sub
- [ ] Notifications fire via DOM events (no inline script rendered)
- [ ] Theme toggle updates CSS properties
- [ ] HTMX swaps keep reactive behavior

## Tag + Release
- [ ] Tag the version: `git tag vX.Y.Z && git push --tags`
- [ ] Create GitHub Release with notes from `CHANGELOG.md`
- [ ] Verify CI is green on the tag

