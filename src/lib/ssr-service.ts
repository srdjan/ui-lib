import { getRegistry } from "./registry.ts";
import { html } from "./ssr.ts";

export function renderComponent(name: string, props: Record<string, unknown> = {}): string {
  const reg = getRegistry();
  const entry = reg[name];
  if (!entry) {
    return `<!-- component ${name} not registered -->`;
  }
  const state = entry.init();
  const cssTag = entry.css ? html`<style>${entry.css}</style>` : "";
  const markup = entry.render(state, props);
  return `${cssTag}${markup}`;
}

