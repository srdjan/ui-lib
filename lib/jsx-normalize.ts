// Shared helpers for normalizing JSX props into HTML-friendly strings

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

export function normalizeClass(value: unknown): string {
  if (value == null || value === false) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value
      .flat(Infinity)
      .map((entry) => normalizeClass(entry))
      .filter((entry) => entry.length > 0)
      .join(" ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key)
      .join(" ");
  }
  return "";
}

export function normalizeStyle(value: unknown): string {
  if (value == null || value === false) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value !== "object") return String(value);

  return Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([key, v]) => `${toKebabCase(key)}: ${String(v)}`)
    .join("; ");
}
