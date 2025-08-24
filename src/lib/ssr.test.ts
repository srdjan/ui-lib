const assertEquals = (a: unknown, b: unknown, msg?: string) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    throw new Error(
      msg ?? `Expected ${JSON.stringify(a)} to equal ${JSON.stringify(b)}`,
    );
  }
};

import { html, raw } from "./ssr.ts";

Deno.test("html template escapes and preserves raw", () => {
  const name = "<Admin>";
  const out = html`
    <div class="box">Hello ${name}! ${raw("<b>ok</b>")}</div>
  `;
  assertEquals(out.trim(), '<div class="box">Hello &lt;Admin&gt;! <b>ok</b></div>');
});
