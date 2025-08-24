import { getRegistry } from "./registry.ts";
import { html } from "./ssr.ts";

export function renderComponent(name: string, props: Record<string, unknown> = {}): string {
  const reg = getRegistry();
  const entry = reg[name];
  if (!entry) {
    return `<!-- component ${name} not registered -->`;
  }
  
  // Parse props if prop spec exists
  let parsedProps = props;
  if (entry.props) {
    parsedProps = {};
    for (const [key, spec] of Object.entries(entry.props)) {
      // Use the attribute name to look up the raw value from props
      const attributeName = spec.attribute;
      const rawValue = props[attributeName];
      parsedProps[key] = spec.parse(rawValue);
    }
  }
  
  // Create server action creators if available
  let serverActionCreators = undefined;
  if (entry.serverActions) {
    const creators: Record<string, (...args: unknown[]) => Record<string, unknown>> = {};
    for (const [actionType, handler] of Object.entries(entry.serverActions)) {
      creators[actionType] = (...args: unknown[]) => handler(...args);
    }
    serverActionCreators = creators;
  }
  
  // Render component with CSS and markup using simplified signature
  const cssTag = entry.css ? html`<style>${entry.css}</style>` : "";
  const markup = entry.render(parsedProps, serverActionCreators);
  return `${cssTag}${markup}`;
}

