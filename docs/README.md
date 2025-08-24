# Docs Index

Quick links and local docs dev.

## Guides

- Component Authoring with TSX: ./AUTHORING.md
- Migration from legacy `.state()`/`.actions()`: ./MIGRATION.md

## Run the Docs Site

The docs site uses Deno JSX precompile (separate from the component runtime):

```bash
deno task docs
# or override the port
PORT=9000 deno task docs
```

Visit http://localhost:8000 (or your chosen `PORT`).

