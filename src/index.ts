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

// Legacy pipeline API is no longer exported. Prefer defineComponent with
// function-style props inferred in the render signature.

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
export type { ApiMap, GeneratedApiMap } from "./lib/api-generator.ts";
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
  array,
  boolean,
  isPropHelper,
  number,
  object,
  type PropHelper,
  string,
} from "./lib/prop-helpers.ts";

// Utility TS types
export type { PropsOf, UnwrapHelpers } from "./lib/types.ts";

// Hybrid Reactivity System - Three-tier client-side component communication

// Enhanced reactive component definition
export {
  defineReactiveComponent,
  defineCSSReactiveComponent,
  defineMultiStateComponent,
  createReactiveCSSClasses,
  type ReactiveComponentConfig,
  type MultiStateComponentConfig,
} from "./lib/reactive-component.ts";

// CSS Property Reactivity (Tier 1)
export {
  setCSSProperty,
  getCSSProperty,
  toggleCSSProperty,
  createThemeToggle,
} from "./lib/reactive-helpers.ts";

// Pub/Sub State Manager (Tier 2)
export {
  publishState,
  subscribeToState,
  getState,
  createCartAction,
} from "./lib/reactive-helpers.ts";

// DOM Event Communication (Tier 3)
export {
  dispatchEvent,
  listensFor,
  createNotification,
} from "./lib/reactive-helpers.ts";

// State Manager Infrastructure
export {
  createStateManagerScript,
  createMinimalStateManagerScript,
  injectStateManager,
  defaultStateManagerConfig,
  type StateManager,
} from "./lib/state-manager.ts";

// Utility Helpers
export {
  findClosestComponent,
  conditionalAction,
  safeExecute,
  debugReactiveState,
  type ReactiveScope,
  type EventTarget,
} from "./lib/reactive-helpers.ts";
