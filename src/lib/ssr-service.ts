import { getRegistry } from "./registry.ts";
import { html } from "./ssr.ts";

export function renderComponent(name: string, props: Record<string, unknown> = {}): string {
  const reg = getRegistry();
  const entry = reg[name];
  if (!entry) {
    return `<!-- component ${name} not registered -->`;
  }
  
  // Initialize component state
  const state = entry.init();
  
  // Parse props if prop spec exists
  let parsedProps = props;
  if (entry.props) {
    parsedProps = {};
    for (const [key, spec] of Object.entries(entry.props)) {
      const rawValue = props[key];
      parsedProps[key] = spec.parse(rawValue);
    }
  }
  
  // Create empty action creators for static SSR
  const actionCreators = {};
  
  // Render component with CSS and markup
  const cssTag = entry.css ? html`<style>${entry.css}</style>` : "";
  const markup = entry.render(state, parsedProps, actionCreators);
  return `${cssTag}${markup}`;
}

