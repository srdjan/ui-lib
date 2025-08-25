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

// Conditional render function types based on whether API is provided
type RenderFunctionWithApi<TProps extends EnhancedPropSpec> = (
  props: InferEnhancedProps<TProps>,
  api: GeneratedApiMap,
  classes?: ClassMap,
) => string;

type RenderFunctionWithoutApi<TProps extends EnhancedPropSpec> = (
  props: InferEnhancedProps<TProps>,
  api?: undefined,
  classes?: ClassMap,
) => string;

// Component configuration with API
export interface ComponentConfigWithApi<TProps extends EnhancedPropSpec> {
  props?: TProps;
  styles?: string;
  classes?: ClassMap;
  api: ApiMap;  // Required when this interface is used
  render: RenderFunctionWithApi<TProps>;
}

// Component configuration without API
export interface ComponentConfigWithoutApi<TProps extends EnhancedPropSpec> {
  props?: TProps;
  styles?: string;
  classes?: ClassMap;
  api?: never;  // Not allowed when this interface is used
  render: RenderFunctionWithoutApi<TProps>;
}

// Union type for component configuration
export type ComponentConfig<TProps extends EnhancedPropSpec> = 
  | ComponentConfigWithApi<TProps>
  | ComponentConfigWithoutApi<TProps>;

/**
 * Define a component with a clean, object-based configuration API.
 * 
 * @example
 * ```tsx
 * // With API - api parameter is required and guaranteed
 * export const TodoItem = defineComponent("todo-item", {
 *   props: { id: "string", text: "string" },
 *   api: {
 *     "DELETE /api/todos/:id": async (req, params) => new Response("")
 *   },
 *   render: ({ id, text }, api) => (  // api is guaranteed to exist!
 *     <div>
 *       <span>{text}</span>
 *       <button {...api.delete(id)}>Delete</button>
 *     </div>
 *   )
 * });
 * 
 * // Without API - no api parameter
 * export const SimpleCard = defineComponent("simple-card", {
 *   props: { title: "string" },
 *   render: ({ title }) => <h3>{title}</h3>  // no api parameter needed
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
    for (const [functionName, apiDef] of Object.entries(apiMap)) {
      const { route, handler } = apiDef;
      const [method, path] = route.split(" ");
      if (!method || !path || !handler) {
        console.warn(`Invalid route definition: "${route}" for function "${functionName}"`);
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
      // Pass the correct parameters based on whether API exists
      if (generatedApi) {
        // Component has API - pass api as required parameter
        return (render as RenderFunctionWithApi<TProps>)(
          finalProps as InferEnhancedProps<TProps>,
          generatedApi,
          classMap,
        );
      } else {
        // Component has no API - don't pass api parameter
        return (render as RenderFunctionWithoutApi<TProps>)(
          finalProps as InferEnhancedProps<TProps>,
          undefined,
          classMap,
        );
      }
    },
  };
}