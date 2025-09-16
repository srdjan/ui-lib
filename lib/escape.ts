// Shared HTML escaping utility used across server/runtime helpers
const ESCAPE_LOOKUP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const ESCAPE_PATTERN = /[&<>"']/g;

export function escape(value: string): string {
  return String(value).replace(ESCAPE_PATTERN, (char) => ESCAPE_LOOKUP[char]);
}
