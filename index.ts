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

// Prefer defineComponent with function-style props inferred in the render signature.

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
export type { ApiClientOptions } from "./lib/api-generator.ts";
export type {
  ComponentConfig,
  InferProps,
  PropsSpec,
  PropsTransformer,
} from "./lib/define-component.ts";

// Import JSX types to make them globally available
import "./lib/jsx.d.ts";

// JSX Integration utilities
export {
  generateJSXTypes,
  JSXIntegration, 
  registerComponentWithJSX,
  validateJSXProps,
} from "./lib/jsx-integration.ts";

// JSX Component Types
export type {
  ComponentPropsMap,
  FuncwcComponentProps,
  JSXProps,
  RegisteredComponents,
} from "./lib/jsx-component-types.ts";

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

// Hybrid Reactivity System helpers (use with defineComponent reactive options)

// CSS Property Reactivity (Tier 1)
export {
  createThemeToggle,
  getCSSProperty,
  setCSSProperty,
  toggleCSSProperty,
} from "./lib/reactive-helpers.ts";

// Pub/Sub State Manager (Tier 2)
export {
  createCartAction,
  getState,
  hxOn,
  listensFor,
  publishState,
  subscribeToState,
} from "./lib/reactive-helpers.ts";

// DOM Event Communication (Tier 3)
export { createNotification, dispatchEvent } from "./lib/reactive-helpers.ts";

// State Manager Infrastructure
export {
  createMinimalStateManagerScript,
  createStateManagerScript,
  defaultStateManagerConfig,
  injectStateManager,
  type StateManager,
} from "./lib/state-manager.ts";

// Utility Helpers
export {
  conditionalAction,
  debugReactiveState,
  type EventTarget,
  findClosestComponent,
  type ReactiveScope,
  safeExecute,
} from "./lib/reactive-helpers.ts";

// Global configuration
export { configure, type FuncwcConfig } from "./lib/config.ts";
