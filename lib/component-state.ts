// Server-side component rendering for DOM-native components
import { getRegistry } from "./registry.ts";
import { shouldInjectStyle } from "./style-registry.ts";
import { setRenderContext, clearRenderContext } from "./jsx-runtime.ts";

// Generate a unique component instance ID
export function generateComponentId(componentName: string): string {
  return `${componentName}-${crypto.randomUUID()}`;
}

// Render component with DOM-native approach
export function renderComponent(
  componentName: string,
  props: Record<string, unknown> = {},
): string {
  const registry = getRegistry();
  const entry = registry[componentName];

  if (!entry) {
    const registeredComponents = Object.keys(registry).join(", ");
    return `<!-- component "${componentName}" not found. Available components: ${
      registeredComponents || "none"
    } -->`;
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
  } finally {
    // Always clear the context, even if rendering throws
    clearRenderContext();
  }

  let cssTag = "";
  if (entry.css) {
    const key = `${componentName}:${hashCss(entry.css)}`;
    if (shouldInjectStyle(key)) {
      cssTag = `<style>${entry.css}</style>`;
    }
  }

  return `${cssTag}${markup}`;
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
