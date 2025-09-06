# Authoring Guide

This library enables Functional Web Components with a DOM‑first workflow. Author small, pure helpers that render predictable HTML on the server and progressively enhance in the client. The DOM (attributes, classes, data-*) is your state.

## Principles
- Keep components pure: render from inputs → markup string.
- Prefer attributes/data-* to store state; avoid global mutable state.
- Compose tiny helpers; colocate tests next to sources.
- Ship HTML first; attach behavior with delegated events.

## Getting Started
- Create files in `lib/` and colocate tests as `*.test.ts` (e.g., `lib/ssr.test.ts`).
- Re-export public surface from `index.ts` only.
- Run checks locally: `deno task check`, `deno task test`, `deno task fmt:check`, `deno task lint`.

## Define a Component
Use kebab-case names and return markup from a pure render function. See `docs/UNIFIED-API.md` for signatures.

```ts
// lib/theme-toggle.ts
import { defineComponent } from "../index.ts";

export const ThemeToggle = defineComponent("theme-toggle", ({ attrs }) => {
  const next = attrs.theme === "dark" ? "light" : "dark";
  return `
    <button type="button" data-next="${next}">
      Toggle ${next}
    </button>
  `;
});
```

Use in HTML (SSR output) and progressively enhance on the client:

```html
<theme-toggle theme="light"></theme-toggle>
<script type="module" src="/client.js"></script>
```

## Props & Attributes
- Map props to attributes and `data-*`.
- Booleans: presence/absence (e.g., `disabled`), not `true/false` strings.
- Numbers: use decimal strings (e.g., `data-count="3"`).
- Complex values: serialize minimally (e.g., `data-state="open"`), avoid JSON when possible.

## Events & Behavior (Delegation)
Attach one delegated listener and target via selectors so components stay lightweight.

```ts
addEventListener("click", (e) => {
  const btn = (e.target as Element).closest("theme-toggle button");
  if (!btn) return;
  const host = btn.closest("theme-toggle")!;
  host.setAttribute("theme", btn.getAttribute("data-next")!);
});
```

## SSR & Progressive Enhancement
- Server: render HTML using the provided SSR helpers (see `docs/UNIFIED-API.md`).
- Client: do not re-render; read/modify attributes and `data-*` only.
- Hydration-free: avoid duplicating server logic; enhance by listening to events.

## Testing
- Location: `lib/**/*.test.ts` beside implementations.
- Run: `deno task test` or `deno test lib/some-file.test.ts`.
- Aim for pure tests: assert markup strings and attribute effects.

```ts
// lib/theme-toggle.test.ts
import { ThemeToggle } from "./theme-toggle.ts";

Deno.test("renders next theme label", () => {
  const html = ThemeToggle.render({ attrs: { theme: "light" } });
  if (!html.includes('data-next="dark"')) {
    throw new Error("Expected next theme to be dark");
  }
});
```

## Style & Naming
- TypeScript (strict). 2-space indent. `deno fmt` and `deno lint` enforce style.
- Components: kebab-case names; files end with `.ts`; tests end with `.test.ts`.

## Accessibility & Semantics
- Prefer native elements and ARIA where needed.
- Manage focus explicitly on interactive updates.
- Ensure components are operable via keyboard.

## Performance Tips
- Use event delegation instead of many listeners.
- Keep markup small; prefer class/attribute toggles to re-rendering.
- Avoid runtime network/env dependencies.

