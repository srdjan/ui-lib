// Public, curated API surface for ui-lib (MVP-stable)

// Core component system
export { renderComponent } from "./lib/component-state.ts";
export { render } from "./lib/render.ts";
export {
  registerComponentApi,
} from "./lib/define-component.ts";
export type {
  AppComponentConfig,
  DefinedComponent,
} from "./lib/define-component.ts";
export { h } from "./lib/jsx-runtime.ts";

// App-level defineComponent - restricted to composition only (no custom styles)
// Apps must use pre-styled library components with variants
import {
  defineComponent as defineComponentInternal,
  type AppComponentConfig as AppComponentConfigInternal,
  type DefinedComponent as DefinedComponentInternal,
} from "./lib/define-component.ts";

export function defineComponent<TProps = any>(
  name: string,
  config: AppComponentConfigInternal<TProps>,
): DefinedComponentInternal<TProps> {
  if ("styles" in config || "clientScript" in config) {
    throw new Error(
      `Component "${name}": Custom styles and clientScript are not allowed in app components. ` +
        `Please use library components with variants instead.`,
    );
  }
  return defineComponentInternal(name, config);
}

// HTTP method helpers (curated subset)
export {
  create,
  del,
  get,
  patch,
  post,
  put,
  remove,
} from "./lib/api-helpers.ts";

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

// CSS-in-TS utilities removed from public API
// Apps should use library components with variants instead of custom styling

// Router (stable minimal)
export { type RouteHandler, type RouteParams, Router } from "./lib/router.ts";
export type {
  Method,
  PathParamKeys,
  RouteHandlerFor,
  RouteParamsOf,
} from "./lib/router.ts";
// Functional Router API
export { createRouter, type IRouter } from "./lib/router.ts";

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
