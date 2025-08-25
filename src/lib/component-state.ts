// Server-side component rendering for DOM-native components
import { getRegistry } from "./registry.ts";

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
    return `<!-- component ${componentName} not found -->`;
  }

  // Parse props if prop spec exists
  let parsedProps = props;
  if (entry.props) {
    parsedProps = {};
    for (const [key, spec] of Object.entries(entry.props)) {
      const rawValue = props[key];
      parsedProps[key] = spec.parse(rawValue);
    }
  }

  // Create API function creators if available
  let apiCreators = undefined;
  if (entry.api) {
    apiCreators = createApiCreators(entry.api);
  }

  // Simple render with props and optional API
  const markup = entry.render(parsedProps, apiCreators);

  const cssTag = entry.css ? `<style>${entry.css}</style>` : "";

  return `${cssTag}${markup}`;
}

// Create API creators that return HTMX attribute objects
function createApiCreators(
  apiMap: Record<string, (...args: unknown[]) => Record<string, unknown>>,
): Record<string, (...args: unknown[]) => Record<string, unknown>> {
  const creators: Record<
    string,
    (...args: unknown[]) => Record<string, unknown>
  > = {};

  for (const [actionType, handler] of Object.entries(apiMap)) {
    creators[actionType] = (...args: unknown[]) => {
      return handler(...args);
    };
  }

  return creators;
}
