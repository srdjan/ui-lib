// Smart type helpers for function-style props
// Eliminates duplication between props definition and render parameters

export interface PropHelper<T = unknown> {
  readonly __propHelper: true;
  readonly type: string;
  readonly defaultValue?: T;
  readonly required: boolean;
  readonly parse: (attrs: Record<string, string>, key: string) => T;
}

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
  return {
    __propHelper: true,
    type: "string",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      // Try both camelCase and kebab-case versions
      const kebabKey = camelToKebab(key);
      const value = attrs[key] ?? attrs[kebabKey];
      if (value === undefined) {
        if (defaultValue !== undefined) {
          return defaultValue;
        }
        throw new Error(`Required string prop '${key}' is missing`);
      }
      return value;
    },
  };
}

/**
 * Number prop helper - automatically parses string attributes to numbers
 * @param defaultValue - Default value if attribute is missing (makes prop optional)
 * @returns PropHelper for number parsing
 */
export function number(defaultValue?: number): PropHelper<number> {
  return {
    __propHelper: true,
    type: "number",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      // Try both camelCase and kebab-case versions
      const kebabKey = camelToKebab(key);
      const value = attrs[key] ?? attrs[kebabKey];
      if (value === undefined) {
        if (defaultValue !== undefined) {
          return defaultValue;
        }
        throw new Error(`Required number prop '${key}' is missing`);
      }
      const parsed = Number(value);
      if (isNaN(parsed)) {
        throw new Error(`Invalid number value for prop '${key}': ${value}`);
      }
      return parsed;
    },
  };
}

/**
 * Boolean prop helper - presence-based (attribute exists = true)
 * @param defaultValue - Default value if attribute is missing (makes prop optional)
 * @returns PropHelper for boolean parsing
 */
export function boolean(defaultValue?: boolean): PropHelper<boolean> {
  return {
    __propHelper: true,
    type: "boolean",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      // Try both camelCase and kebab-case versions
      const kebabKey = camelToKebab(key);
      const hasAttr = key in attrs || kebabKey in attrs;
      if (!hasAttr && defaultValue !== undefined) {
        return defaultValue;
      }
      if (!hasAttr && defaultValue === undefined) {
        throw new Error(`Required boolean prop '${key}' is missing`);
      }
      // Presence-based: attribute exists = true, regardless of value
      return hasAttr;
    },
  };
}

/**
 * Array prop helper - parses JSON strings to arrays
 * @param defaultValue - Default value if attribute is missing (makes prop optional)
 * @returns PropHelper for array parsing
 */
export function array<T = unknown>(defaultValue?: T[]): PropHelper<T[]> {
  return {
    __propHelper: true,
    type: "array",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      // Try both camelCase and kebab-case versions
      const kebabKey = camelToKebab(key);
      const value = attrs[key] ?? attrs[kebabKey];
      if (value === undefined) {
        if (defaultValue !== undefined) {
          return defaultValue;
        }
        throw new Error(`Required array prop '${key}' is missing`);
      }
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error(`Prop '${key}' must be a valid JSON array`);
        }
        return parsed as T[];
      } catch (_error) {
        throw new Error(`Invalid JSON array for prop '${key}': ${value}`);
      }
    },
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
  return {
    __propHelper: true,
    type: "object",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      // Try both camelCase and kebab-case versions
      const kebabKey = camelToKebab(key);
      const value = attrs[key] ?? attrs[kebabKey];
      if (value === undefined) {
        if (defaultValue !== undefined) {
          return defaultValue;
        }
        throw new Error(`Required object prop '${key}' is missing`);
      }
      try {
        const parsed = JSON.parse(value);
        if (
          typeof parsed !== "object" || parsed === null || Array.isArray(parsed)
        ) {
          throw new Error(`Prop '${key}' must be a valid JSON object`);
        }
        return parsed as T;
      } catch (_error) {
        throw new Error(`Invalid JSON object for prop '${key}': ${value}`);
      }
    },
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
