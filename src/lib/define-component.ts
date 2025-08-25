// Clean, object-based component definition API
import {
  createEnhancedPropSpec,
  type EnhancedPropSpec,
  type InferEnhancedProps,
} from "./props.ts";
import { getRegistry } from "./registry.ts";
import {
  type ApiMap,
  generateClientApi,
  type GeneratedApiMap,
} from "./api-generator.ts";
import { appRouter } from "./router.ts";
import "./jsx.d.ts"; // Import JSX types

type ClassMap = Record<string, string>;

// Component configuration object
export interface ComponentConfig<TProps extends EnhancedPropSpec> {
  props?: TProps;
  styles?: string;
  classes?: ClassMap;
  api?: ApiMap;
  render: (
    props: InferEnhancedProps<TProps>,
    api?: GeneratedApiMap,
    classes?: ClassMap,
  ) => string;
}

/**
 * Define a component with a clean, object-based configuration API.
 * 
 * @example
 * ```tsx
 * export const MyButton = defineComponent("my-button", {
 *   props: { text: "string", disabled: "boolean?" },
 *   styles: ".btn { color: blue; }",
 *   classes: { btn: "btn-primary" },
 *   render: ({ text, disabled }, api, classes) => (
 *     <button class={classes.btn} disabled={disabled}>{text}</button>
 *   )
 * });
 * ```
 */
export function defineComponent<TProps extends EnhancedPropSpec>(
  name: string,
  config: ComponentConfig<TProps>,
): void {
  const { props: propSpec, styles: css, classes: classMap, api: apiMap, render } = config;

  // Validate required configuration
  if (!render) {
    throw new Error(
      `Component "${name}" is missing required configuration: render function must be provided.`
    );
  }

  // Process props if provided
  const parsedProps = propSpec ? createEnhancedPropSpec(propSpec) : undefined;

  // Generate API client functions if provided
  let generatedApi: GeneratedApiMap | undefined;
  if (apiMap) {
    generatedApi = generateClientApi(apiMap);
    
    // Register all routes with the router
    for (const [route, handler] of Object.entries(apiMap)) {
      const [method, path] = route.split(" ");
      if (!method || !path || !handler) {
        console.warn(`Invalid route definition: "${route}"`);
        continue;
      }
      appRouter.register(method, path, handler);
    }
  }

  // Register the component in the SSR registry
  const registry = getRegistry();
  registry[name] = {
    props: parsedProps,
    css,
    api: generatedApi,
    render: (finalProps, _unusedApi) => {
      return render(
        finalProps as InferEnhancedProps<TProps>,
        generatedApi,
        classMap,
      );
    },
  };
}