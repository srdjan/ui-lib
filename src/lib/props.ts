// Utilities for prop specification parsing
export type PropSpecObject = Record<string, string>;

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
            return v != null && v !== "false" && v !== "0";
          case "string":
          default:
            return String(v);
        }
      },
    };
  }

  return result;
};
