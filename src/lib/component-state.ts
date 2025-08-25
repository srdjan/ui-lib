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

  // Generate client API functions if available (should match component-pipeline logic)
  let apiCreators = undefined;
  if (entry.api) {
    // Note: entry.api should contain generated client functions, not route handlers
    apiCreators = entry.api;
  }

  // Simple render with props and optional API
  const markup = entry.render(parsedProps, apiCreators);

  const cssTag = entry.css ? `<style>${entry.css}</style>` : "";

  return `${cssTag}${markup}`;
}

