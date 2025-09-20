// Server-side component rendering for DOM-native components
import { getRegistry } from "./registry.ts";
import { shouldInjectStyle } from "./style-registry.ts";
import { setRenderContext, clearRenderContext } from "./jsx-runtime.ts";
import { Result, ok, err } from "./result.ts";

// Generate a unique component instance ID
export function generateComponentId(componentName: string): string {
  return `${componentName}-${crypto.randomUUID()}`;
}

// Error types for component rendering
export type RenderError =
  | { readonly type: "ComponentNotFound"; readonly name: string; readonly available: readonly string[] }
  | { readonly type: "RenderFailed"; readonly error: unknown; readonly component: string }
  | { readonly type: "InvalidProps"; readonly component: string; readonly details: string };

// Render component with DOM-native approach using Result type
export function renderComponentSafe(
  componentName: string,
  props: Record<string, unknown> = {},
): Result<string, RenderError> {
  const registry = getRegistry();
  const entry = registry[componentName];

  if (!entry) {
    const registeredComponents = Object.keys(registry);
    return err({
      type: "ComponentNotFound",
      name: componentName,
      available: registeredComponents,
    });
  }

  // Props are now handled directly in the component's render function
  // The registry no longer stores complex prop specs
  const rawProps = props;

  // Generate client API functions if available
  let apiCreators = undefined;
  if (entry.api) {
    // Note: entry.api should contain generated client functions, not route handlers
    apiCreators = entry.api;
  }

  // Set up rendering context for JSX runtime onAction support
  const componentId = generateComponentId(componentName);
  setRenderContext({
    apiMap: apiCreators,
    componentId,
  });

  let markup = "";
  try {
    // Simple render with props and optional API
    markup = entry.render(rawProps, apiCreators);
  } catch (error) {
    clearRenderContext();
    return err({
      type: "RenderFailed",
      error,
      component: componentName,
    });
  }

  // Clear the context after successful render
  clearRenderContext();

  let cssTag = "";
  if (entry.css) {
    const key = `${componentName}:${hashCss(entry.css)}`;
    if (shouldInjectStyle(key)) {
      cssTag = `<style>${entry.css}</style>`;
    }
  }

  return ok(`${cssTag}${markup}`);
}

// Legacy render function for backward compatibility
export function renderComponent(
  componentName: string,
  props: Record<string, unknown> = {},
): string {
  const result = renderComponentSafe(componentName, props);

  if (result.ok) {
    return result.value;
  }

  // Handle errors with fallback behavior matching original implementation
  switch (result.error.type) {
    case "ComponentNotFound":
      return `<!-- component "${result.error.name}" not found. Available components: ${
        result.error.available.join(", ") || "none"
      } -->`;
    case "RenderFailed":
      console.error(`Component render failed: ${result.error.component}`, result.error.error);
      return `<!-- component "${result.error.component}" failed to render -->`;
    case "InvalidProps":
      console.error(`Invalid props for component: ${result.error.component}`, result.error.details);
      return `<!-- component "${result.error.component}" received invalid props -->`;
  }
}

// Small, fast, deterministic string hash to key CSS dedup per request
function hashCss(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  }
  // Convert to unsigned and to base36 for compactness
  return (hash >>> 0).toString(36);
}
