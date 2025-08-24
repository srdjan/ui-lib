export type { Action } from "./lib/types.ts";
export { component } from "./lib/component-pipeline.ts";
export type { Result } from "./lib/result.ts";
export { err, flatMap, map, mapError, ok } from "./lib/result.ts";
export { escapeHtml } from "./lib/ssr.ts";
export { h } from "./lib/jsx-runtime.ts";
export { renderComponent } from "./lib/component-state.ts";
export { 
  spreadAttrs, 
  toggleClass, 
  toggleClasses,
  updateParentCounter,
  syncCheckboxToClass,
  conditionalClass,
  dataAttrs,
  escape,
  resetCounter,
  activateTab,
  toggleParentClass
} from "./lib/dom-helpers.ts";
