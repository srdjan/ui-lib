// Main exports for funcwc - DOM-native SSR components library

// Core component system
export { defineComponent } from "./lib/define-component.ts";
export { renderComponent } from "./lib/component-state.ts";
export { h } from "./lib/jsx-runtime.ts";

// HTTP method helpers for clean API definitions
export {
  create,
  del,
  get,
  patch,
  post,
  put,
  remove,
} from "./lib/api-helpers.ts";

// Legacy API (maintained for backward compatibility)
export { component } from "./lib/component-pipeline.ts";

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
export type { ApiMap, GeneratedApiMap } from "./lib/component-pipeline.ts";
export type {
  ComponentConfig,
  InferProps,
  PropsSpec,
  PropsTransformer,
} from "./lib/define-component.ts";

// Import JSX types to make them globally available
import "./lib/jsx.d.ts";

// Styles utilities
export type { UnifiedStyles } from "./lib/styles-parser.ts";

// Smart prop helpers for function-style props
export { 
  string, 
  number, 
  boolean, 
  array, 
  object,
  type PropHelper,
  isPropHelper 
} from "./lib/prop-helpers.ts";

// Utility TS types
export type { UnwrapHelpers, PropsOf } from "./lib/types.ts";
