// Smart type helpers for function-style props
// Eliminates duplication between props definition and render parameters

import { err, ok, Result } from "./result.ts";

export type PropError =
  | {
    readonly type: "RequiredMissing";
    readonly key: string;
    readonly propType: string;
  }
  | {
    readonly type: "ParseFailed";
    readonly key: string;
    readonly value: string;
    readonly reason: string;
  }
  | {
    readonly type: "InvalidValue";
    readonly key: string;
    readonly value: string;
    readonly expected: string;
  };

export type PropHelper<T = unknown> = {
  readonly __propHelper: true;
  readonly type: string;
  readonly defaultValue?: T;
  readonly required: boolean;
  readonly parse: (attrs: Record<string, string>, key: string) => T;
  readonly parseSafe: (
    attrs: Record<string, string>,
    key: string,
  ) => Result<T, PropError>;
};

/**
 * Convert camelCase to kebab-case for HTML attribute lookup
 */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * String prop helper
 * @param defaultValue - Default value if attribute is missing (makes prop optional)
 * @returns PropHelper for string parsing
 */
export function string(defaultValue?: string): PropHelper<string> {
  const parseSafe = (
    attrs: Record<string, string>,
    key: string,
  ): Result<string, PropError> => {
    // Try both camelCase and kebab-case versions
    const kebabKey = camelToKebab(key);
    const value = attrs[key] ?? attrs[kebabKey];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return ok(defaultValue);
      }
      return err({ type: "RequiredMissing", key, propType: "string" });
    }
    return ok(value);
  };

  return {
    __propHelper: true,
    type: "string",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      const result = parseSafe(attrs, key);
      if (result.ok) {
        return result.value;
      }
      throw new Error(`Required string prop '${key}' is missing`);
    },
    parseSafe,
  };
}

/**
 * Number prop helper - automatically parses string attributes to numbers
 * @param defaultValue - Default value if attribute is missing (makes prop optional)
 * @returns PropHelper for number parsing
 */
export function number(defaultValue?: number): PropHelper<number> {
  const parseSafe = (
    attrs: Record<string, string>,
    key: string,
  ): Result<number, PropError> => {
    // Try both camelCase and kebab-case versions
    const kebabKey = camelToKebab(key);
    const value = attrs[key] ?? attrs[kebabKey];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return ok(defaultValue);
      }
      return err({ type: "RequiredMissing", key, propType: "number" });
    }
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return err({
        type: "ParseFailed",
        key,
        value,
        reason: "Not a valid number",
      });
    }
    return ok(parsed);
  };

  return {
    __propHelper: true,
    type: "number",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      const result = parseSafe(attrs, key);
      if (result.ok) {
        return result.value;
      }
      // Preserve existing error messages for backward compatibility
      if (result.error.type === "RequiredMissing") {
        throw new Error(`Required number prop '${key}' is missing`);
      }
      throw new Error(
        `Invalid number value for prop '${key}': ${result.error.value}`,
      );
    },
    parseSafe,
  };
}

/**
 * Boolean prop helper - presence-based (attribute exists = true)
 * @param defaultValue - Default value if attribute is missing (makes prop optional)
 * @returns PropHelper for boolean parsing
 */
export function boolean(defaultValue?: boolean): PropHelper<boolean> {
  const parseSafe = (
    attrs: Record<string, string>,
    key: string,
  ): Result<boolean, PropError> => {
    // Try both camelCase and kebab-case versions
    const kebabKey = camelToKebab(key);
    const raw = attrs[key] ?? attrs[kebabKey];
    const hasAttr = raw !== undefined;
    if (!hasAttr && defaultValue !== undefined) {
      return ok(defaultValue);
    }
    if (!hasAttr && defaultValue === undefined) {
      return err({ type: "RequiredMissing", key, propType: "boolean" });
    }
    // Presence-based logic: attribute exists = true
    return ok(hasAttr);
  };

  return {
    __propHelper: true,
    type: "boolean",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      const result = parseSafe(attrs, key);
      if (result.ok) {
        return result.value;
      }
      throw new Error(`Required boolean prop '${key}' is missing`);
    },
    parseSafe,
  };
}

/**
 * Array prop helper - parses JSON strings to arrays
 * @param defaultValue - Default value if attribute is missing (makes prop optional)
 * @returns PropHelper for array parsing
 */
export function array<T = unknown>(defaultValue?: T[]): PropHelper<T[]> {
  const parseSafe = (
    attrs: Record<string, string>,
    key: string,
  ): Result<T[], PropError> => {
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
        throw new Error(`Required array prop '${key}' is missing`);
      }
      throw new Error(
        `Invalid array value for prop '${key}': ${result.error.value}`,
      );
    },
    parseSafe,
  };
}

/**
 * Object prop helper - parses JSON strings to objects
 * @param defaultValue - Default value if attribute is missing (makes prop optional)
 * @returns PropHelper for object parsing
 */
export function object<T = Record<string, unknown>>(
  defaultValue?: T,
): PropHelper<T> {
  const parseSafe = (
    attrs: Record<string, string>,
    key: string,
  ): Result<T, PropError> => {
    const kebabKey = camelToKebab(key);
    const value = attrs[key] ?? attrs[kebabKey];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return ok(defaultValue);
      }
      return err({ type: "RequiredMissing", key, propType: "object" });
    }
    try {
      const parsed = JSON.parse(value);
      if (
        typeof parsed !== "object" || parsed === null || Array.isArray(parsed)
      ) {
        return err({ type: "InvalidValue", key, value, expected: "object" });
      }
      return ok(parsed as T);
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
        throw new Error(`Required object prop '${key}' is missing`);
      }
      throw new Error(
        `Invalid object value for prop '${key}': ${result.error.value}`,
      );
    },
    parseSafe,
  };
}

/**
 * oneOf helper – restrict a string prop to a fixed set of values
 * @example oneOf(["primary","secondary"], "primary")
 */
export function oneOf<T extends readonly string[]>(
  options: T,
  defaultValue?: T[number],
): PropHelper<T[number]> {
  const typeDesc = `oneOf(${options.map((v) => JSON.stringify(v)).join("|")})`;

  const parseSafe = (
    attrs: Record<string, string>,
    key: string,
  ): Result<T[number], PropError> => {
    const kebabKey = camelToKebab(key);
    const value = (attrs[key] ?? attrs[kebabKey]) as string | undefined;
    if (value === undefined) {
      if (defaultValue !== undefined) return ok(defaultValue);
      return err({ type: "RequiredMissing", key, propType: "oneOf" });
    }
    if ((options as readonly string[]).includes(value)) {
      return ok(value as T[number]);
    }
    return err({
      type: "InvalidValue",
      key,
      value,
      expected: `one of: ${options.map(String).join(", ")}`,
    });
  };

  return {
    __propHelper: true,
    type: typeDesc,
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      const result = parseSafe(attrs, key);
      if (result.ok) return result.value;
      throw new Error(
        `Required prop '${key}' is missing (expected ${typeDesc})`,
      );
    },
    parseSafe,
  };
}

/**
 * Type guard to check if a value is a prop helper
 */
export function isPropHelper(value: unknown): value is PropHelper {
  return typeof value === "object" &&
    value !== null &&
    (value as { __propHelper?: unknown }).__propHelper === true;
}

/**
 * Extract prop definitions from a record of prop helpers
 * Used internally by the parser to generate props transformers
 */
export function extractPropDefinitions(
  propHelpers: Record<string, PropHelper>,
): {
  propsTransformer: (attrs: Record<string, string>) => Record<string, unknown>;
  propTypes: Record<
    string,
    { type: string; required: boolean; defaultValue?: unknown }
  >;
} {
  const propTypes: Record<
    string,
    { type: string; required: boolean; defaultValue?: unknown }
  > = {};

  const propsTransformer = (attrs: Record<string, string>) => {
    const result: Record<string, unknown> = {};

    for (const [key, helper] of Object.entries(propHelpers)) {
      try {
        result[key] = helper.parse(attrs, key);
        propTypes[key] = {
          type: helper.type,
          required: helper.required,
          defaultValue: helper.defaultValue,
        };
      } catch (error) {
        // Re-throw with component context if available
        throw error;
      }
    }

    return result;
  };

  return { propsTransformer, propTypes };
}
