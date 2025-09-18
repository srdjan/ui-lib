// Public, curated API surface for ui-lib (MVP-stable)

// Core component system
export { renderComponent } from "./lib/component-state.ts";
export { defineComponent } from "./lib/define-component.ts";
export type { DefinedComponent } from "./lib/define-component.ts";
export { h } from "./lib/jsx-runtime.ts";

// Prop helpers (stable set)
export {
  array,
  boolean,
  isPropHelper,
  number,
  object,
  oneOf,
  type PropHelper,
  string,
} from "./lib/prop-helpers.ts";

// CSS-in-TS utilities
export {
  composeStyles,
  createTheme,
  css,
  cssHelpers,
  type CSSProperties,
  type StyleMap,
  type StyleObject,
  type ThemeTokens,
} from "./lib/css-in-ts.ts";

// Router (stable minimal)
export { type RouteHandler, type RouteParams, Router } from "./lib/router.ts";
export type {
  Method,
  PathParamKeys,
  RouteHandlerFor,
  RouteParamsOf,
} from "./lib/router.ts";

// Reactive utilities (stable subset)
export {
  decorateAttributes,
  generateClientHx,
  hx,
  type HxEnhancementOptions,
} from "./lib/api-recipes.ts";
export {
  dispatchEvent,
  getState,
  hxOn,
  listensFor,
  on,
  publishState,
  subscribeToState,
} from "./lib/reactive-helpers.ts";

// Response helpers
export { error, html, json, text } from "./lib/response.ts";

// State manager (injection helpers)
export {
  createMinimalStateManagerScript,
  injectStateManager,
  type StateManager,
} from "./lib/state-manager.ts";

// DOM helpers
export { toggleClass, toggleClasses } from "./lib/dom-helpers.ts";
export { escapeHtml as escape } from "./lib/ssr.ts";

// Declarative bindings
export {
  bindClass,
  bindStyle,
  bindText,
  bindValue,
  combineBindings,
  createBoundElement,
  emitOn,
  hideIf,
  listenFor,
  showIf,
} from "./lib/reactive-helpers.ts";

// Configuration
export { configure, type FuncwcConfig } from "./lib/config.ts";

// Types
export type { PropsOf, UnwrapHelpers } from "./lib/types.ts";

// JSX types (ambient)
import "./lib/jsx.d.ts";
