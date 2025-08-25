// Utilities for prop specification parsing
export type PropSpecObject = Record<string, string>;

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
