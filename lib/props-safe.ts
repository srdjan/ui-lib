// Safe prop parsing utilities using Result types
import { err, ok, Result } from "./result.ts";
import { PropError, PropHelper } from "./prop-helpers.ts";

export type PropsError = {
  readonly errors: readonly PropError[];
  readonly partialProps: Record<string, unknown>;
};

/**
 * Parse props safely using Result types
 * Returns all validation errors instead of throwing on the first one
 */
export function parsePropsListSafe<T extends Record<string, PropHelper>>(
  attrs: Record<string, string>,
  propDefinitions: T,
): Result<
  {
    [K in keyof T]: ReturnType<T[K]["parseSafe"]> extends Result<infer U, any>
      ? U
      : never;
  },
  PropsError
> {
  const results: Record<string, unknown> = {};
  const errors: PropError[] = [];

  for (const [key, helper] of Object.entries(propDefinitions)) {
    const result = helper.parseSafe(attrs, key);
    if (result.ok) {
      results[key] = result.value;
    } else {
      errors.push(result.error);
      // Include default value if available for partial recovery
      if (helper.defaultValue !== undefined) {
        results[key] = helper.defaultValue;
      }
    }
  }

  if (errors.length > 0) {
    return err({ errors, partialProps: results });
  }

  return ok(results as any);
}

/**
 * Parse props safely with early return on first error
 */
export function parsePropsStrictSafe<T extends Record<string, PropHelper>>(
  attrs: Record<string, string>,
  propDefinitions: T,
): Result<
  {
    [K in keyof T]: ReturnType<T[K]["parseSafe"]> extends Result<infer U, any>
      ? U
      : never;
  },
  PropError
> {
  const results: Record<string, unknown> = {};

  for (const [key, helper] of Object.entries(propDefinitions)) {
    const result = helper.parseSafe(attrs, key);
    if (result.ok) {
      results[key] = result.value;
    } else {
      return result as Result<any, PropError>;
    }
  }

  return ok(results as any);
}

/**
 * Utility to create a validation function for component props
 */
export function createPropsValidator<T extends Record<string, PropHelper>>(
  propDefinitions: T,
) {
  return {
    /**
     * Parse with all errors collected
     */
    parseAll: (attrs: Record<string, string>) =>
      parsePropsListSafe(attrs, propDefinitions),

    /**
     * Parse with early return on first error
     */
    parseStrict: (attrs: Record<string, string>) =>
      parsePropsStrictSafe(attrs, propDefinitions),

    /**
     * Legacy parser that throws (for backward compatibility)
     */
    parse: (attrs: Record<string, string>) => {
      const result = parsePropsStrictSafe(attrs, propDefinitions);
      if (result.ok) {
        return result.value;
      }

      const error = result.error;
      switch (error.type) {
        case "RequiredMissing":
          throw new Error(
            `Required ${error.propType} prop '${error.key}' is missing`,
          );
        case "ParseFailed":
          throw new Error(
            `Failed to parse prop '${error.key}': ${error.reason}`,
          );
        case "InvalidValue":
          throw new Error(
            `Invalid value for prop '${error.key}': expected ${error.expected}, got '${error.value}'`,
          );
      }
    },
  };
}

/**
 * Example usage:
 *
 * ```typescript
 * import { string, number, boolean } from "./prop-helpers.ts";
 * import { createPropsValidator } from "./props-safe.ts";
 *
 * const validator = createPropsValidator({
 *   name: string(),
 *   age: number(0),
 *   active: boolean(false),
 * });
 *
 * // Safe parsing with Result type
 * const result = validator.parseStrict(attrs);
 * if (result.ok) {
 *   console.log(result.value.name); // string
 *   console.log(result.value.age);  // number
 * } else {
 *   console.error("Validation failed:", result.error);
 * }
 *
 * // Legacy parsing (throws)
 * const props = validator.parse(attrs);
 * ```
 */
