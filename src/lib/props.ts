// Utilities for prop specification parsing
export type PropSpecObject = Record<string, string>;

// Enhanced prop specification with defaults and explicit syntax
export type PropConfig = {
  type: "string" | "number" | "boolean";
  required?: boolean;
  default?: unknown;
};

export type EnhancedPropSpec = Record<string, string | PropConfig>;

// Utility type to map string type hints to actual TS types
export type PropType<T extends string> = T extends "string" ? string
  : T extends "number" ? number
  : T extends "boolean" ? boolean
  : unknown;

// Utility type to infer the final props object type from a spec
export type InferProps<T extends PropSpecObject> =
  & {
    -readonly [K in keyof T as T[K] extends `${string}?` ? K : never]?:
      PropType<T[K] extends `${infer U}?` ? U : T[K]>;
  }
  & {
    -readonly [K in keyof T as T[K] extends `${string}?` ? never : K]: PropType<
      T[K]
    >;
  };

// Enhanced type inference for the new prop spec format
export type InferEnhancedProps<T extends EnhancedPropSpec> = {
  [K in keyof T]: T[K] extends string
    ? T[K] extends `${infer U}?`
      ? PropType<U> | undefined
      : PropType<T[K]>
    : T[K] extends PropConfig
      ? T[K]['required'] extends false
        ? (T[K]['type'] extends 'string' ? string : T[K]['type'] extends 'number' ? number : boolean) | undefined
        : T[K]['type'] extends 'string' ? string : T[K]['type'] extends 'number' ? number : boolean
      : unknown;
};

export type ParsedPropSpec = Record<string, {
  attribute: string;
  parse: (v: unknown) => unknown;
}>;

export const createPropSpec = (propSpec: PropSpecObject): ParsedPropSpec => {
  const result: ParsedPropSpec = {} as ParsedPropSpec;

  for (const [key, typeHint] of Object.entries(propSpec)) {
    const isOptional = typeHint.endsWith("?");
    const baseType = isOptional ? typeHint.slice(0, -1) : typeHint;

    result[key] = {
      attribute: key,
      parse: (v: unknown) => {
        if (v == null) return isOptional ? undefined : null;

        switch (baseType) {
          case "number": {
            const num = Number(v);
            return isNaN(num) ? (isOptional ? undefined : 0) : num;
          }
          case "boolean":
            // HTML boolean attribute standards: presence = true, "false" = false
            // Examples: disabled, checked="" (empty string should be true)
            if (typeof v === "string") {
              return v !== "false" && v !== "0"; // Empty string "" should be true
            }
            return v != null && Boolean(v);
          case "string":
          default:
            return String(v);
        }
      },
    };
  }

  return result;
};

// Enhanced prop spec creation supporting multiple syntax formats
export const createEnhancedPropSpec = (propSpec: EnhancedPropSpec): ParsedPropSpec => {
  const result: ParsedPropSpec = {} as ParsedPropSpec;

  for (const [key, spec] of Object.entries(propSpec)) {
    let config: PropConfig;
    
    if (typeof spec === "string") {
      // Handle string format: "string", "number?", etc.
      const isOptional = spec.endsWith("?");
      const baseType = isOptional ? spec.slice(0, -1) : spec;
      config = {
        type: baseType as "string" | "number" | "boolean",
        required: !isOptional
      };
    } else {
      // Handle object format
      config = spec;
    }

    result[key] = {
      attribute: key,
      parse: (v: unknown) => {
        // Handle null/undefined values
        if (v == null) {
          if (config.default !== undefined) return config.default;
          return config.required ? null : undefined;
        }

        switch (config.type) {
          case "number": {
            const num = Number(v);
            if (isNaN(num)) {
              return config.default !== undefined ? config.default : (config.required ? 0 : undefined);
            }
            return num;
          }
          case "boolean":
            // HTML boolean attribute standards: presence = true, "false" = false
            if (typeof v === "string") {
              return v !== "false" && v !== "0"; // Empty string "" should be true
            }
            return v != null && Boolean(v);
          case "string":
          default:
            return String(v);
        }
      },
    };
  }

  return result;
};
