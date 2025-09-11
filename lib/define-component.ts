// Simplified defineComponent with optional props transformer
import { getRegistry } from "./registry.ts";
import {
  type ApiMap,
  generateClientApi,
  type GeneratedApiMap,
} from "./api-generator.ts";

// Re-export for use in reactive components
export type { GeneratedApiMap };

import { getConfig } from "./config.ts";

import {
  isUnifiedStyles,
  parseUnifiedStyles,
  type UnifiedStyles,
} from "./styles-parser.ts";

import { applyReactiveAttrs } from "./reactive-system.ts";
import { createPropsParser } from "./props.ts";
import { processDeclarativeBindings, hasDeclarativeBindings } from "./declarative-bindings.ts";
import "./jsx.d.ts"; // Import JSX types

// Props transformer function type - takes raw attributes, returns whatever the user wants
export type PropsTransformer<
  TRawAttrs = Record<string, string>,
  TProps = unknown,
> = (attrs: TRawAttrs) => TProps;

// Back-compat helper types (still exported)
export type PropsSpec<TProps = unknown> =
  | PropsTransformer<Record<string, string>, TProps>
  | undefined;
export type InferProps<T extends PropsSpec> = T extends
  PropsTransformer<Record<string, string>, infer P> ? P
  : Record<string, string>;

export type ClassMap = Record<string, string>;
export type StylesInput = string | UnifiedStyles;

// New config types: infer props directly from render parameter or optional transformer
// Consolidated reactive configuration
interface ReactiveConfig {
  on?: Record<string, string>;
  state?: Record<string, string>;
  css?: Record<string, string>;
  mount?: string;
  unmount?: string;
  inject?: boolean; // default false
}

export interface ComponentConfigWithApi<TProps> {
  router?: any; // Replace with Router instance type
  reactive?: ReactiveConfig;
  autoProps?: boolean;
  props?: PropsTransformer<Record<string, string>, TProps>;
  styles?: StylesInput; // Can be string or unified styles object
  classes?: ClassMap; // Optional when using unified styles
  api: ApiMap; // Required when this interface is used
  render: (props: TProps, api: GeneratedApiMap, classes?: ClassMap) => string;
}

export interface ComponentConfigWithoutApi<TProps> {
  router?: any; // Replace with Router instance type
  reactive?: ReactiveConfig;
  autoProps?: boolean;
  props?: PropsTransformer<Record<string, string>, TProps>;
  styles?: StylesInput; // Can be string or unified styles object
  classes?: ClassMap; // Optional when using unified styles
  api?: never; // Not allowed when this interface is used
  render: (props: TProps, api?: undefined, classes?: ClassMap) => string;
}

export type ComponentConfig<TProps> =
  | ComponentConfigWithApi<TProps>
  | ComponentConfigWithoutApi<TProps>;

/**
 * Define a component with simplified props system.
 *
 * @example
 * ```tsx
 * // Zero config - props are just strings
 * defineComponent("simple-text", {
 *   render: (props: { message: string }) => <div>{props.message}</div>
 * });
 *
 * // With transformer when parsing needed
 * defineComponent("counter", {
 *   props: (attrs) => ({
 *     count: parseInt(attrs.count || "0"),
 *     step: parseInt(attrs.step || "1"),
 *     active: "active" in attrs
 *   }),
 *   render: (props) => (
 *     <div class={props.active ? "active" : ""}>
 *       Count: {props.count}
 *     </div>
 *   )
 * });
 *
 * // With API
 * defineComponent("todo-item", {
 *   props: (attrs) => ({
 *     id: attrs.id,
 *     text: attrs.text,
 *     done: "done" in attrs
 *   }),
 *   api: {
 *     toggle: patch("/api/todos/:id/toggle", handler),
 *     remove: del("/api/todos/:id", handler)
 *   },
 *   render: (props, api) => (
 *     <div>
 *       <span>{props.text}</span>
 *       <button {...api.toggle(props.id)}>Toggle</button>
 *       <button {...api.remove(props.id)}>×</button>
 *     </div>
 *   )
 * });
 * ```
 */
export function defineComponent<TProps = Record<string, string>>(
  name: string,
  config: ComponentConfig<TProps>,
): void {
  const {
    props: propsTransformer,
    styles: stylesInput,
    classes: providedClassMap,
    api: apiMap,
    reactive,
    autoProps = false,
    render,
  } = config;

  const { logging, dev } = getConfig();

  const finalPropsTransformer = createPropsParser<TProps>({ name, ...config });

  // Handle unified styles or traditional string styles
  let css: string | undefined;
  let classMap: ClassMap | undefined;

  if (stylesInput) {
    if (isUnifiedStyles(stylesInput)) {
      // New unified styles format
      const { classMap: extractedClassMap, combinedCss } = parseUnifiedStyles(
        stylesInput,
      );
      css = combinedCss;
      classMap = extractedClassMap;

      // If user also provided separate classes, merge them (provided classes take precedence)
      if (providedClassMap) {
        classMap = { ...extractedClassMap, ...providedClassMap };
      }
    } else {
      // Traditional string styles
      css = stylesInput;
      classMap = providedClassMap;
    }
  } else {
    // No styles provided
    classMap = providedClassMap;
  }

  // Enhance CSS with reactive rules if requested
  if (reactive?.css) {
    const reactiveCssRules = Object.entries(reactive.css)
      .map(([property, rule]) => {
        return `[data-component="${name}"] { ${
          rule.replace(/var\(--[\w-]+\)/g, `var(--${property})`)
        } }`;
      })
      .join("\n");
    css = css ? `${css}\n${reactiveCssRules}` : reactiveCssRules;
  }

  // Validate required configuration
  if (!render) {
    throw new Error(
      `Component "${name}" is missing required configuration: render function must be provided.`,
    );
  }

  // Generate API client functions if provided
  let generatedApi: GeneratedApiMap | undefined;
  if (apiMap) {
    generatedApi = generateClientApi(apiMap);

    // Register all routes with the router
    for (const [functionName, apiDefinition] of Object.entries(apiMap)) {
      if (!Array.isArray(apiDefinition) || apiDefinition.length !== 3) {
        console.warn(
          `Invalid API definition for "${functionName}". Expected format: [method, path, handler] (e.g., ["POST", "/api/todos", handler])`,
        );
        continue;
      }

      const [method, path, handler] = apiDefinition;
      if (!method || !path || !handler) {
        console.warn(
          `Invalid API definition for "${functionName}": method, path, and handler are required`,
        );
        continue;
      }

      if (config.router) {
        config.router.register(method, path, handler);
      }
    }
  }

  // Register the component in the SSR registry with collision detection
  const registry = getRegistry();
  if (registry[name]) {
    console.warn(
      `⚠️  Component "${name}" already exists and will be overwritten!`,
    );
  }
  registry[name] = {
    props: undefined, // transformer is handled manually here
    css,
    api: generatedApi,
    render: (rawAttrs, _unusedApi) => {
      const finalProps = finalPropsTransformer
        ? finalPropsTransformer(rawAttrs as Record<string, string>)
        : (rawAttrs as unknown as TProps);

      // Preserve children passed from SSR tag processor
      const children = (rawAttrs as Record<string, unknown>)["children"] as
        | string
        | undefined;

      let html = generatedApi
        ? (render as (
          p: TProps,
          a: GeneratedApiMap,
          c?: ClassMap,
          ch?: string,
        ) => string)(finalProps as TProps, generatedApi, classMap, children)
        : (render as (
          p: TProps,
          a?: undefined,
          c?: ClassMap,
          ch?: string,
        ) => string)(finalProps as TProps, undefined, classMap, children);
      
      // Process declarative bindings if present
      if (hasDeclarativeBindings(html)) {
        html = processDeclarativeBindings(html, name);
      }
      
      // Inject reactive attrs only if present, then add data-component
      return injectDataComponent(
        applyReactiveAttrs(html, reactive, name),
        name,
      );
    },
  };
}

// Injects data-component="<name>" into the first opening tag of the HTML string
function injectDataComponent(html: string, name: string): string {
  const firstTagMatch = html.match(/^(\s*)(<[a-zA-Z][^>]*)(>)/);
  if (!firstTagMatch) return html;
  const [full, whitespace, openTag, closeAngle] = firstTagMatch;
  if (openTag.includes("data-component=")) return html; // already present
  const enhancedTag =
    `${whitespace}${openTag} data-component="${name}"${closeAngle}`;
  return html.replace(full, enhancedTag);
}
