// Tiny SSR benchmarks for funcwc
// Run: deno task bench

import { renderComponent } from "../index.ts";
import { runWithRequestHeaders } from "../lib/request-headers.ts";

// Ensure demo components are registered
import "../examples/layout.tsx";
import "../examples/demo-counter.tsx";
import { renderCurrentDemo } from "../examples/layout.tsx";

let sink = 0;
const hold = (s: string) => (sink ^= s.length);

Deno.bench("SSR app-layout (welcome)", () => {
  const html = runWithRequestHeaders(
    {},
    () => renderComponent("app-layout", { currentDemo: "welcome" }),
  );
  hold(html);
});

Deno.bench("SSR app-layout (basic)", () => {
  const html = runWithRequestHeaders(
    {},
    () => renderComponent("app-layout", { currentDemo: "basic" }),
  );
  hold(html);
});

Deno.bench("SSR demo-counter", () => {
  const html = runWithRequestHeaders({}, () =>
    renderComponent("demo-counter", {
      "initial-count": 42,
      step: 2,
      "max-value": 100,
      label: "Bench",
    }));
  hold(html);
});

Deno.bench("Render demo partial (welcome)", () => {
  const html = renderCurrentDemo("welcome", {});
  hold(html);
});
