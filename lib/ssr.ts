import { escape } from "./dom-helpers.ts";

// Minimal SSR string template utilities (no browser code)

export type RawHTML = { __raw_html: string };

export const raw = (html: string): RawHTML => ({ __raw_html: html });

export const escapeHtml = escape;

export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  let out = "";
  for (let i = 0; i < strings.length; i++) {
    out += strings[i];
    if (i < values.length) {
      const v = values[i];
      if (v == null || v === false) continue;

      if (Array.isArray(v)) {
        // Handle arrays by joining them
        out += v.map((x) => (typeof x === "string" ? x : escape(String(x))))
          .join("");
      } else if (typeof v === "object" && (v as RawHTML).__raw_html) {
        out += (v as RawHTML).__raw_html;
      } else if (typeof v === "string") {
        out += escape(v);
      } else {
        out += escape(String(v));
      }
    }
  }
  return out;
}
