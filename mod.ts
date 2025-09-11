// Public, curated API surface for ui-lib (MVP-stable)

// Core component system
export { defineComponent } from "./lib/define-component.ts";
export { renderComponent } from "./lib/component-state.ts";
export { h } from "./lib/jsx-runtime.ts";

// Prop helpers (stable set)
export {
  array,
  boolean,
  isPropHelper,
  number,
  object,
  type PropHelper,
  string,
  oneOf,
} from "./lib/prop-helpers.ts";

// CSS-in-TS utilities
export {
  css,
  composeStyles,
  createTheme,
  cssHelpers,
  type CSSProperties,
  type StyleMap,
  type StyleObject,
  type ThemeTokens,
} from "./lib/css-in-ts.ts";

// Router (stable minimal)
export { Router, type RouteHandler, type RouteParams } from "./lib/router.ts";
export type { Method, RouteHandlerFor, RouteParamsOf, PathParamKeys } from "./lib/router.ts";

// Reactive utilities (stable subset)
export {
  publishState,
  subscribeToState,
  getState,
  dispatchEvent,
  hxOn,
  on,
  listensFor,
} from "./lib/reactive-helpers.ts";

// Response helpers
export { html, json, text, error } from "./lib/response.ts";

// State manager (injection helpers)
export {
  injectStateManager,
  createMinimalStateManagerScript,
  type StateManager,
} from "./lib/state-manager.ts";

// DOM helpers
export { toggleClass, toggleClasses } from "./lib/dom-helpers.ts";
export { escapeHtml as escape } from "./lib/ssr.ts";

// Declarative bindings
export {
  bindText,
  bindClass,
  bindStyle,
  bindValue,
  emitOn,
  listenFor,
  showIf,
  hideIf,
  combineBindings,
  createBoundElement,
} from "./lib/reactive-helpers.ts";

// Configuration
export { configure, type FuncwcConfig } from "./lib/config.ts";

// Types
export type { PropsOf, UnwrapHelpers } from "./lib/types.ts";

// JSX types (ambient)
import "./lib/jsx.d.ts";
