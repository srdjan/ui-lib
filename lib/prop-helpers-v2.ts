// Enhanced prop helpers with automatic type inference and no runtime type checking needed
// This is the next evolution of the prop system - fully type-safe at compile time

import type { PropHelper } from "./prop-helpers.ts";

/**
 * Enhanced PropHelper that returns already-typed values
 * No more manual type checking in render functions!
 */
export interface TypedPropHelper<T> extends PropHelper<T> {
  readonly __typed: true;
  readonly transform: (value: T) => T;
}

/**
 * Convert camelCase to kebab-case for HTML attribute lookup
 */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Enhanced string prop helper with automatic inference
 * @param defaultValue - Default value if attribute is missing
 * @returns Strongly typed string value
 */
export function typedString(
  defaultValue?: string,
): string & TypedPropHelper<string> {
  const helper: TypedPropHelper<string> = {
    __propHelper: true,
    __typed: true,
    type: "string",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
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
    transform: (value: string) => value,
  };

  // Return a Proxy that acts as both the value and the helper
  const proxyTarget = defaultValue ?? "";
  return new Proxy({} as any, {
    get(_target, prop) {
      if (prop in helper) {
        return helper[prop as keyof typeof helper];
      }
      if (prop === "toString" || prop === Symbol.toStringTag) {
        return () => proxyTarget;
      }
      return (proxyTarget as any)[prop];
    },
  }) as string & TypedPropHelper<string>;
}

/**
 * Enhanced number prop helper with automatic inference
 * @param defaultValue - Default value if attribute is missing
 * @returns Strongly typed number value
 */
export function typedNumber(
  defaultValue?: number,
): number & TypedPropHelper<number> {
  const helper: TypedPropHelper<number> = {
    __propHelper: true,
    __typed: true,
    type: "number",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
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
        throw new Error(
          `Invalid number value for prop '${key}': ${value}. Expected a valid number but got "${value}".`,
        );
      }
      return parsed;
    },
    transform: (value: number) => value,
  };

  const proxyTarget = defaultValue ?? 0;
  return new Proxy({} as any, {
    get(_target, prop) {
      if (prop in helper) {
        return helper[prop as keyof typeof helper];
      }
      if (
        prop === Symbol.toPrimitive || prop === "valueOf" || prop === "toString"
      ) {
        return () => proxyTarget;
      }
      return (proxyTarget as any)[prop];
    },
  }) as number & TypedPropHelper<number>;
}

/**
 * Enhanced boolean prop helper with automatic inference
 * @param defaultValue - Default value if attribute is missing
 * @returns Strongly typed boolean value
 */
export function typedBoolean(
  defaultValue?: boolean,
): boolean & TypedPropHelper<boolean> {
  const helper: TypedPropHelper<boolean> = {
    __propHelper: true,
    __typed: true,
    type: "boolean",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
      const kebabKey = camelToKebab(key);
      const hasAttr = key in attrs || kebabKey in attrs;
      if (!hasAttr && defaultValue !== undefined) {
        return defaultValue;
      }
      if (!hasAttr && defaultValue === undefined) {
        throw new Error(`Required boolean prop '${key}' is missing`);
      }
      return hasAttr;
    },
    transform: (value: boolean) => value,
  };

  const proxyTarget = defaultValue ?? false;
  return new Proxy({} as any, {
    get(_target, prop) {
      if (prop in helper) {
        return helper[prop as keyof typeof helper];
      }
      if (
        prop === Symbol.toPrimitive || prop === "valueOf" || prop === "toString"
      ) {
        return () => proxyTarget;
      }
      return (proxyTarget as any)[prop];
    },
  }) as boolean & TypedPropHelper<boolean>;
}

/**
 * Enhanced array prop helper with automatic inference
 * @param defaultValue - Default value if attribute is missing
 * @returns Strongly typed array value
 */
export function typedArray<T = unknown>(
  defaultValue?: T[],
): T[] & TypedPropHelper<T[]> {
  const helper: TypedPropHelper<T[]> = {
    __propHelper: true,
    __typed: true,
    type: "array",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
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
          throw new Error(
            `Prop '${key}' must be a valid JSON array. Got ${typeof parsed} instead.`,
          );
        }
        return parsed as T[];
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);
        throw new Error(
          `Invalid JSON array for prop '${key}': ${value}. Parse error: ${errorMessage}`,
        );
      }
    },
    transform: (value: T[]) => value,
  };

  const proxyTarget = defaultValue ?? [];
  return new Proxy(proxyTarget, {
    get(target, prop) {
      if (prop in helper) {
        return helper[prop as keyof typeof helper];
      }
      return target[prop as keyof typeof target];
    },
  }) as T[] & TypedPropHelper<T[]>;
}

/**
 * Enhanced object prop helper with automatic inference
 * @param defaultValue - Default value if attribute is missing
 * @returns Strongly typed object value
 */
export function typedObject<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  defaultValue?: T,
): T & TypedPropHelper<T> {
  const helper: TypedPropHelper<T> = {
    __propHelper: true,
    __typed: true,
    type: "object",
    defaultValue,
    required: defaultValue === undefined,
    parse: (attrs: Record<string, string>, key: string) => {
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
          typeof parsed !== "object" ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          throw new Error(
            `Prop '${key}' must be a valid JSON object. Got ${
              Array.isArray(parsed) ? "array" : typeof parsed
            } instead.`,
          );
        }
        return parsed as T;
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);
        throw new Error(
          `Invalid JSON object for prop '${key}': ${value}. Parse error: ${errorMessage}`,
        );
      }
    },
    transform: (value: T) => value,
  };

  const proxyTarget = defaultValue ?? ({} as T);
  return new Proxy(proxyTarget, {
    get(target, prop) {
      if (prop in helper) {
        return helper[prop as keyof typeof helper];
      }
      return target[prop as keyof typeof target];
    },
  }) as T & TypedPropHelper<T>;
}

/**
 * Type guard to check if a value is a typed prop helper
 */
export function isTypedPropHelper(
  value: unknown,
): value is TypedPropHelper<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as any).__propHelper === true &&
    (value as any).__typed === true
  );
}

/**
 * Extract actual values from typed prop helpers
 * Used internally during prop parsing
 */
export function extractTypedValues<T extends Record<string, unknown>>(
  props: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (isTypedPropHelper(value)) {
      // Extract the actual parsed value
      result[key] = value.defaultValue;
    } else {
      result[key] = value;
    }
  }

  return result;
}

// Re-export for backward compatibility with enhanced features
export {
  typedArray as array2,
  typedBoolean as boolean2,
  typedNumber as number2,
  typedObject as object2,
  typedString as string2,
};
