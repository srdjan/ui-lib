// Enhanced prop helpers with automatic type inference and no runtime type checking needed
// This is the next evolution of the prop system - fully type-safe at compile time

import type { PropError, PropHelper } from "./prop-helpers.ts";
import { err, ok, Result } from "./result.ts";

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
      const result = helper.parseSafe(attrs, key);
      if (result.ok) return result.value;
      throw new Error(`Required string prop '${key}' is missing`);
    },
    parseSafe: (
      attrs: Record<string, string>,
      key: string,
    ): Result<string, PropError> => {
      const kebabKey = camelToKebab(key);
      const value = attrs[key] ?? attrs[kebabKey];
      if (value === undefined) {
        return defaultValue !== undefined
          ? ok(defaultValue)
          : err({ type: "RequiredMissing", key, propType: "string" });
      }
      return ok(value);
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
      const result = helper.parseSafe(attrs, key);
      if (result.ok) return result.value;
      if (result.error.type === "RequiredMissing") {
        throw new Error(`Required number prop '${key}' is missing`);
      }
      throw new Error(
        `Invalid number value for prop '${key}': ${(attrs[key] ??
          attrs[camelToKebab(key)])}. Expected a valid number but got "${(attrs[
            key
          ] ?? attrs[camelToKebab(key)])}".`,
      );
    },
    parseSafe: (
      attrs: Record<string, string>,
      key: string,
    ): Result<number, PropError> => {
      const kebabKey = camelToKebab(key);
      const value = attrs[key] ?? attrs[kebabKey];
      if (value === undefined) {
        return defaultValue !== undefined
          ? ok(defaultValue)
          : err({ type: "RequiredMissing", key, propType: "number" });
      }
      const parsed = Number(value);
      return isNaN(parsed)
        ? err({ type: "ParseFailed", key, value, reason: "Not a valid number" })
        : ok(parsed);
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
      const result = helper.parseSafe(attrs, key);
      if (result.ok) return result.value;
      throw new Error(`Required boolean prop '${key}' is missing`);
    },
    parseSafe: (
      attrs: Record<string, string>,
      key: string,
    ): Result<boolean, PropError> => {
      const kebabKey = camelToKebab(key);
      const raw = attrs[key] ?? attrs[kebabKey];
      const hasAttr = raw !== undefined;
      if (!hasAttr) {
        return defaultValue !== undefined
          ? ok(defaultValue)
          : err({ type: "RequiredMissing", key, propType: "boolean" });
      }
      return ok(true);
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
      const result = helper.parseSafe(attrs, key);
      if (result.ok) return result.value;
      if (result.error.type === "RequiredMissing") {
        throw new Error(`Required array prop '${key}' is missing`);
      }
      if (result.error.type === "ParseFailed") {
        throw new Error(
          `Invalid JSON array for prop '${key}': ${result.error.value}`,
        );
      }
      // InvalidValue means parsed but not an array
      throw new Error(
        `Prop '${key}' must be a valid JSON array. Got object instead.`,
      );
    },
    parseSafe: (
      attrs: Record<string, string>,
      key: string,
    ): Result<T[], PropError> => {
      const kebabKey = camelToKebab(key);
      const value = attrs[key] ?? attrs[kebabKey];
      if (value === undefined) {
        return defaultValue !== undefined
          ? ok(defaultValue)
          : err({ type: "RequiredMissing", key, propType: "array" });
      }
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          return err({ type: "InvalidValue", key, value, expected: "array" });
        }
        return ok(parsed as T[]);
      } catch {
        return err({ type: "ParseFailed", key, value, reason: "Invalid JSON" });
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
      const result = helper.parseSafe(attrs, key);
      if (result.ok) return result.value;
      if (result.error.type === "RequiredMissing") {
        throw new Error(`Required object prop '${key}' is missing`);
      }
      if (result.error.type === "ParseFailed") {
        throw new Error(
          `Invalid JSON object for prop '${key}': ${result.error.value}`,
        );
      }
      // InvalidValue means parsed but not an object (could be array)
      const val = String(result.error.value || "").trim();
      if (val.startsWith("[")) {
        throw new Error(
          `Prop '${key}' must be a valid JSON object. Got array instead.`,
        );
      }
      throw new Error(
        `Prop '${key}' must be a valid JSON object. Got ${
          val ? typeof {} : "non-object"
        } instead.`,
      );
    },
    parseSafe: (
      attrs: Record<string, string>,
      key: string,
    ): Result<T, PropError> => {
      const kebabKey = camelToKebab(key);
      const value = attrs[key] ?? attrs[kebabKey];
      if (value === undefined) {
        return defaultValue !== undefined
          ? ok(defaultValue as T)
          : err({ type: "RequiredMissing", key, propType: "object" });
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
