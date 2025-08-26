// Simplified defineComponent with optional props transformer
import { getRegistry } from "./registry.ts";
import {
  type ApiMap,
  generateClientApi,
  type GeneratedApiMap,
} from "./api-generator.ts";
import { appRouter } from "./router.ts";
import {
  type UnifiedStyles,
  parseUnifiedStyles,
  isUnifiedStyles,
} from "./styles-parser.ts";
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

type ClassMap = Record<string, string>;
type StylesInput = string | UnifiedStyles;

// New config types: infer props directly from render parameter or optional transformer
export interface ComponentConfigWithApi<TProps> {
  props?: PropsTransformer<Record<string, string>, TProps>;
  styles?: StylesInput; // Can be string or unified styles object
  classes?: ClassMap;   // Optional when using unified styles
  api: ApiMap; // Required when this interface is used
  render: (props: TProps, api: GeneratedApiMap, classes?: ClassMap) => string;
}

export interface ComponentConfigWithoutApi<TProps> {
  props?: PropsTransformer<Record<string, string>, TProps>;
  styles?: StylesInput; // Can be string or unified styles object
  classes?: ClassMap;   // Optional when using unified styles
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
    render,
  } = config;

  // Handle unified styles or traditional string styles
  let css: string | undefined;
  let classMap: ClassMap | undefined;

  if (stylesInput) {
    if (isUnifiedStyles(stylesInput)) {
      // New unified styles format
      const { classMap: extractedClassMap, combinedCss } = parseUnifiedStyles(stylesInput);
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

      appRouter.register(method, path, handler);
    }
  }

  // Register the component in the SSR registry
  const registry = getRegistry();
  registry[name] = {
    props: undefined, // transformer is handled manually here
    css,
    api: generatedApi,
    render: (rawAttrs, _unusedApi) => {
      const finalProps = propsTransformer
        ? propsTransformer(rawAttrs as Record<string, string>)
        : (rawAttrs as unknown as TProps);

      if (generatedApi) {
        return (render as (
          p: TProps,
          a: GeneratedApiMap,
          c?: ClassMap,
        ) => string)(
          finalProps as TProps,
          generatedApi,
          classMap,
        );
      } else {
        return (render as (p: TProps, a?: undefined, c?: ClassMap) => string)(
          finalProps as TProps,
          undefined,
          classMap,
        );
      }
    },
  };
}
