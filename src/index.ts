// Main exports for funcwc - DOM-native SSR web components library

// Core component system
export { component } from "./lib/component-pipeline.ts";
export { renderComponent } from "./lib/component-state.ts";
export { h } from "./lib/jsx-runtime.ts";

// Type-safe DOM helpers for event handlers
export { toggleClass, toggleClasses } from "./lib/dom-helpers.ts";

// Utility functions for templates
export {
  conditionalClass,
  dataAttrs,
  escape,
  spreadAttrs,
} from "./lib/dom-helpers.ts";

// Functional programming utilities
export type { Result } from "./lib/result.ts";
export { err, flatMap, map, mapError, ok } from "./lib/result.ts";

// SSR utilities
export { escapeHtml } from "./lib/ssr.ts";

// Type definitions
export type { ComponentAction } from "./lib/actions.ts";
export type { Action } from "./lib/types.ts";
export type { ApiMap, GeneratedApiMap } from "./lib/component-pipeline.ts";

// Import JSX types to make them globally available
import "./lib/jsx.d.ts";
