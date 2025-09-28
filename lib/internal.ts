// Internal API for library components
// This module exports unrestricted APIs that library components use
// Applications should NOT import from this module

// Core component system with full styling capabilities
export {
  defineComponent,
  defineSimpleComponent,
  registerComponentApi,
} from "./define-component.ts";
export type {
  ClassMap,
  ComponentConfig,
  DefinedComponent,
  ReactiveConfig,
  StylesInput,
} from "./define-component.ts";

// JSX runtime
export { h } from "./jsx-runtime.ts";

// CSS-in-TS system (library-only)
export {
  composeStyles,
  createTheme,
  css,
  cssHelpers,
  type CSSProperties,
  type StyleMap,
  type StyleObject,
  type ThemeTokens,
} from "./css-in-ts.ts";

// Prop helpers
export {
  array,
  boolean,
  isPropHelper,
  number,
  object,
  oneOf,
  type PropHelper,
  string,
} from "./prop-helpers.ts";

// API helpers
export { create, del, get, patch, post, put, remove } from "./api-helpers.ts";

// Reactive utilities
export {
  decorateAttributes,
  generateClientHx,
  hx,
  type HxEnhancementOptions,
} from "./api-recipes.ts";

export {
  bindClass,
  bindStyle,
  bindText,
  bindValue,
  combineBindings,
  createBoundElement,
  dispatchEvent,
  emitOn,
  getState,
  hideIf,
  hxOn,
  listenFor,
  listensFor,
  on,
  publishState,
  showIf,
  subscribeToState,
} from "./reactive-helpers.ts";

// Response helpers
export { error, html, json, text } from "./response.ts";

// SSR utilities
export { escapeHtml } from "./ssr.ts";

// Component state
export { renderComponent } from "./component-state.ts";
export { render } from "./render.ts";

// DOM helpers
export { toggleClass, toggleClasses } from "./dom-helpers.ts";

// Configuration
export { configure, type FuncwcConfig } from "./config.ts";

// Types
export type { PropsOf, UnwrapHelpers } from "./types.ts";

// Registry (for internal use)
export {
  getRegistry,
  registerComponent,
  resetRegistry,
  type SSRRegistry,
  type SSRRegistryEntry,
} from "./registry.ts";
