#!/usr/bin/env -S deno run --allow-read --allow-write

const filePath = "lib/prop-helpers.ts";
const content = await Deno.readTextFile(filePath);

// Fix array helper
let updated = content.replace(
  /export function array<T = unknown>\(defaultValue\?\: T\[\]\): PropHelper<T\[\]> \{\s*return \{([^}]+)\}/s,
  (match, body) => {
    return `export function array<T = unknown>(defaultValue?: T[]): PropHelper<T[]> {
  const parseSafe = (attrs: Record<string, string>, key: string): Result<T[], PropError> => {
    const kebabKey = camelToKebab(key);
    const value = attrs[key] ?? attrs[kebabKey];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return ok(defaultValue);
      }
      return err({ type: "RequiredMissing", key, propType: "array" });
    }
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        return err({ type: "InvalidValue", key, value, expected: "array" });
      }
      return ok(parsed);
    } catch {
      return err({ type: "ParseFailed", key, value, reason: "Invalid JSON" });
    }
  };

  return {
    __propHelper: true,
    type: "array",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      const result = parseSafe(attrs, key);
      if (result.ok) return result.value;
      if (result.error.type === "RequiredMissing") {
        throw new Error(\`Required array prop '\${key}' is missing\`);
      }
      throw new Error(\`Invalid array value for prop '\${key}': \${result.error.value}\`);
    },
    parseSafe,
  }`;
  }
);

// Fix object helper
updated = updated.replace(
  /export function object<T = unknown>\(defaultValue\?\: T\): PropHelper<T> \{\s*return \{([^}]+)\}/s,
  (match, body) => {
    return `export function object<T = unknown>(defaultValue?: T): PropHelper<T> {
  const parseSafe = (attrs: Record<string, string>, key: string): Result<T, PropError> => {
    const kebabKey = camelToKebab(key);
    const value = attrs[key] ?? attrs[kebabKey];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return ok(defaultValue);
      }
      return err({ type: "RequiredMissing", key, propType: "object" });
    }
    try {
      return ok(JSON.parse(value));
    } catch {
      return err({ type: "ParseFailed", key, value, reason: "Invalid JSON" });
    }
  };

  return {
    __propHelper: true,
    type: "object",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      const result = parseSafe(attrs, key);
      if (result.ok) return result.value;
      if (result.error.type === "RequiredMissing") {
        throw new Error(\`Required object prop '\${key}' is missing\`);
      }
      throw new Error(\`Invalid object value for prop '\${key}': \${result.error.value}\`);
    },
    parseSafe,
  }`;
  }
);

// Fix oneOf helper
updated = updated.replace(
  /export function oneOf<T extends readonly unknown\[\]>\(\s*options: T,\s*defaultValue\?\: T\[number\]\s*\): PropHelper<T\[number\]> \{\s*return \{([^}]+)\}/s,
  (match, body) => {
    return `export function oneOf<T extends readonly unknown[]>(
  options: T,
  defaultValue?: T[number]
): PropHelper<T[number]> {
  const parseSafe = (attrs: Record<string, string>, key: string): Result<T[number], PropError> => {
    const kebabKey = camelToKebab(key);
    const value = attrs[key] ?? attrs[kebabKey];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return ok(defaultValue);
      }
      return err({ type: "RequiredMissing", key, propType: "oneOf" });
    }
    if (!options.includes(value as T[number])) {
      return err({
        type: "InvalidValue",
        key,
        value,
        expected: \`one of: \${options.map(String).join(", ")}\`
      });
    }
    return ok(value as T[number]);
  };

  return {
    __propHelper: true,
    type: "oneOf",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      const result = parseSafe(attrs, key);
      if (result.ok) return result.value;
      if (result.error.type === "RequiredMissing") {
        throw new Error(\`Required oneOf prop '\${key}' is missing\`);
      }
      throw new Error(\`Invalid value for prop '\${key}': \${result.error.value}\`);
    },
    parseSafe,
  }`;
  }
);

await Deno.writeTextFile(filePath, updated);
console.log("✅ Fixed prop helpers");