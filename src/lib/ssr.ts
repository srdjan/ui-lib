import { type ComponentAction as _ComponentAction } from "./actions.ts";

// Minimal SSR string template utilities (no browser code)

export type RawHTML = { __raw_html: string };

export const raw = (html: string): RawHTML => ({ __raw_html: html });

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
        out += v.map((x) => (typeof x === "string" ? x : escapeHtml(String(x)))).join("");
      } else if (typeof v === "object" && (v as RawHTML).__raw_html) {
        out += (v as RawHTML).__raw_html;
      } else if (typeof v === "string") {
        out += escapeHtml(v);
      } else {
        out += escapeHtml(String(v));
      }
    }
  }
  return out;
}