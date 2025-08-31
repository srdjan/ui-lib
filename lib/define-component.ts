// Simplified defineComponent with optional props transformer
import { getRegistry } from "./registry.ts";
import {
  type ApiMap,
  generateClientApi,
  type GeneratedApiMap,
} from "./api-generator.ts";

// Re-export for use in reactive components
export type { GeneratedApiMap };
import { appRouter } from "./router.ts";
import { listensFor, subscribeToState } from "./reactive-helpers.ts";
import {
  isUnifiedStyles,
  parseUnifiedStyles,
  type UnifiedStyles,
} from "./styles-parser.ts";
import { parseRenderParameters } from "./render-parameter-parser.ts";
import { extractPropDefinitions } from "./prop-helpers.ts";
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
// Reactive options (optional, additive)
interface ReactiveOptions {
  cssReactions?: Record<string, string>;
  stateSubscriptions?: Record<string, string>;
  eventListeners?: Record<string, string>;
  onMount?: string;
  onUnmount?: string;
  autoInjectReactive?: boolean; // default true
}

export interface ComponentConfigWithApi<TProps> extends ReactiveOptions {
  props?: PropsTransformer<Record<string, string>, TProps>;
  styles?: StylesInput; // Can be string or unified styles object
  classes?: ClassMap; // Optional when using unified styles
  api: ApiMap; // Required when this interface is used
  render: (props: TProps, api: GeneratedApiMap, classes?: ClassMap) => string;
}

export interface ComponentConfigWithoutApi<TProps> extends ReactiveOptions {
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
    // Reactive options
    cssReactions,
    stateSubscriptions,
    eventListeners,
    onMount,
    onUnmount,
    autoInjectReactive = true,
    render,
  } = config;

  // Auto-generate props transformer from render function parameters if none provided
  let finalPropsTransformer = propsTransformer;
  if (!propsTransformer) {
    const { propHelpers, hasProps } = parseRenderParameters(render);
    if (hasProps) {
      const { propsTransformer: autoTransformer } = extractPropDefinitions(
        propHelpers,
      );
      finalPropsTransformer = autoTransformer as PropsTransformer<
        Record<string, string>,
        TProps
      >;
      console.log(
        `Auto-generated props for component "${name}":`,
        Object.keys(propHelpers),
      );
    }
  }

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
  if (cssReactions) {
    const reactiveCssRules = Object.entries(cssReactions)
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

      appRouter.register(method, path, handler);
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

      // helper to inject reactive attrs (optional)
      const applyReactiveAttrs = (markup: string): string => {
        if (!autoInjectReactive) return markup;

        const reactiveAttrs: string[] = [];
        const reactiveCode: string[] = [];

        if (stateSubscriptions) {
          for (const [topic, handler] of Object.entries(stateSubscriptions)) {
            reactiveCode.push(subscribeToState(topic, handler));
          }
        }
        if (eventListeners) {
          for (const [ev, handler] of Object.entries(eventListeners)) {
            reactiveAttrs.push(listensFor(ev, handler));
          }
        }
        if (onMount || reactiveCode.length > 0 || onUnmount) {
          let lifecycleCode = "";
          if (onMount || reactiveCode.length > 0) {
            const mountCode = [
              ...(reactiveCode.length > 0 ? reactiveCode : []),
              ...(onMount ? [onMount] : []),
            ].join(";\n");
            lifecycleCode += mountCode;
          }
          if (onUnmount) {
            lifecycleCode += `\n\n// Setup unmount observer\n`;
            lifecycleCode += `
              if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((node) => {
                      if (node === this || (node.nodeType === 1 && node.contains(this))) {
                        try { ${onUnmount} } catch(e) { console.warn('funcwc unmount error:', e); }
                        observer.disconnect();
                      }
                    });
                  });
                });
                observer.observe(document.body, { childList: true, subtree: true });
              }
            `.trim();
          }
          if (lifecycleCode) {
            const code = lifecycleCode.replace(/\n/g, ' ').replace(/"/g, "&quot;");
            reactiveAttrs.push(`hx-on="htmx:load: ${code}"`);
          }
        }

        if (reactiveAttrs.length === 0) return markup;
        const firstTagMatch = markup.match(/^(\s*)(<[a-zA-Z][^>]*)(>)/);
        if (!firstTagMatch) return markup;
        const [, whitespace, openTag, closeAngle] = firstTagMatch;

        // Merge hx-on if already present on the root tag
        const existingHxOnMatch = openTag.match(/\s(hx-on)="([^"]*)"/);
        let newOpenTag = openTag;
        const injected = reactiveAttrs.join(" ");
        if (existingHxOnMatch) {
          const existing = existingHxOnMatch[2];
          // Merge by concatenating with a newline
          const merged = `${existing}\n${injected.replace(/^hx-on="|"$/g, "")}`;
          newOpenTag = openTag.replace(
            existingHxOnMatch[0],
            ` hx-on="${merged}"`,
          );
        } else {
          newOpenTag = `${openTag} ${injected}`;
        }
        const enhancedTag = `${whitespace}${newOpenTag}${closeAngle}`;
        return markup.replace(firstTagMatch[0], enhancedTag);
      };
      const html = generatedApi
        ? (render as (p: TProps, a: GeneratedApiMap, c?: ClassMap) => string)(
          finalProps as TProps,
          generatedApi,
          classMap,
        )
        : (render as (p: TProps, a?: undefined, c?: ClassMap) => string)(
          finalProps as TProps,
          undefined,
          classMap,
        );
      // Inject reactive attrs only if present, then add data-component
      return injectDataComponent(applyReactiveAttrs(html), name);
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
