import { parseRenderParameters } from "./render-parameter-parser.ts";
import { extractPropDefinitions } from "./prop-helpers.ts";
import type { PropsTransformer } from "./define-component.ts";
import { getConfig } from "./config.ts";

interface PropsParserConfig<TProps> {
  name: string;
  props?: PropsTransformer<Record<string, string>, TProps>;
  autoProps?: boolean;
  render: (...args: any[]) => unknown;
}

export function createPropsParser<TProps>(
  config: PropsParserConfig<TProps>,
): PropsTransformer<Record<string, string>, TProps> | undefined {
  const {
    props: propsTransformer,
    autoProps,
    render,
    name,
  } = config;
  const shouldAutoInfer = autoProps !== false;

  // Auto-generate props transformer from render function parameters if none provided
  let finalPropsTransformer = propsTransformer;
  if (!propsTransformer && shouldAutoInfer) {
    const { propHelpers, hasProps } = parseRenderParameters(render);
    if (hasProps) {
      const { propsTransformer: autoTransformer } = extractPropDefinitions(
        propHelpers,
      );
      finalPropsTransformer = autoTransformer as PropsTransformer<
        Record<string, string>,
        TProps
      >;
      if (getConfig().logging || getConfig().dev) {
        console.log(
          `Auto-generated props for component "${name}":`,
          Object.keys(propHelpers),
        );
      }
    }
  }

  return finalPropsTransformer;
}

// Back-compat lightweight prop spec parser for tests/migration
// Supports primitives with optional suffix '?'
// Returned shape: { key: { parse: (value: unknown) => T | undefined } }
export function createPropSpec(spec: Record<string, string>): Record<string, {
  parse: (value: unknown) => unknown;
}> {
  const out: Record<string, { parse: (value: unknown) => unknown }> = {};

  for (const [key, typeStr] of Object.entries(spec)) {
    const isOptional = typeStr.endsWith("?");
    const base = isOptional ? typeStr.slice(0, -1) : typeStr;

    if (base === "number") {
      out[key] = {
        parse: (value: unknown) => {
          if (value === undefined || value === null || value === "") {
            return isOptional ? undefined : 0;
          }
          const n = Number(value as any);
          return isNaN(n) ? (isOptional ? undefined : NaN) : n;
        },
      };
    } else if (base === "boolean") {
      out[key] = {
        parse: (value: unknown) => {
          if (value === undefined || value === null) {
            return isOptional ? undefined : false;
          }
          const s = String(value).toLowerCase();
          if (s === "false" || s === "0") return false;
          // Presence/any other value considered true; empty string is true per HTML boolean attrs
          return true;
        },
      };
    } else if (base === "string") {
      out[key] = {
        parse: (value: unknown) => {
          if (value === undefined || value === null) {
            return isOptional ? undefined : "";
          }
          return String(value);
        },
      };
    } else {
      // Fallback: identity
      out[key] = { parse: (value: unknown) => value };
    }
  }

  return out;
}
