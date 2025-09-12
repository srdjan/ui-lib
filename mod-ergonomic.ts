// ui-lib Ergonomic API - The Three Breakthroughs Restored!
// This is the enhanced API that provides the original ergonomic vision

// ✨ Core Ergonomic Component System
export {
  defineApiComponent,
  defineErgonomicComponent,
  defineSimpleComponent,
  type ErgonomicComponentConfig,
} from "./lib/ergonomic-component.ts";

// ✨ Breakthrough 1: Function-Style Props (Zero Duplication!)
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

// ✨ Breakthrough 2: CSS-Only Format (Auto-Generated Classes!)
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

// ✨ Breakthrough 3: Unified API System (HTMX Attributes Auto-Generated!)
export {
  create,
  del,
  get,
  patch,
  post,
  put,
  remove,
} from "./lib/api-helpers.ts";

// Core JSX runtime and utilities
export { Fragment, h, jsx, jsxs, renderToString } from "./lib/simple.tsx";

// Essential utilities
export {
  css as cssHelper,
  escape,
  initStateBindings,
  state,
} from "./lib/simple.tsx";

// Component rendering
export { renderComponent } from "./lib/component-state.ts";

// API integration
export type { ApiMap, GeneratedApiMap } from "./lib/api-generator.ts";

// Router integration
export { Router } from "./lib/router.ts";

// Configuration
export { configure, type FuncwcConfig } from "./lib/config.ts";

// Development tools
export {
  a11yChecker,
  clearDevStats,
  componentInspector,
  type ComponentRenderInfo,
  configureDevTools,
  type DevConfig,
  devHelpers,
  getComponentStats,
  getDevConfig,
  getPerformanceReport,
  performanceMonitor,
  propValidator,
  trackComponentRender,
} from "./lib/dev-tools.ts";

// ✨ Example Usage Documentation
/**
 * # ✨ ui-lib Ergonomic API - Three Breakthroughs
 *
 * ## 🚀 Quick Start
 *
 * ```tsx
 * import {
 *   defineErgonomicComponent,
 *   string, number, boolean, oneOf,
 *   patch, del, h
 * } from "ui-lib/mod-ergonomic.ts";
 *
 * // ✨ All three breakthroughs in one component!
 * defineErgonomicComponent({
 *   name: "todo-item",
 *
 *   // ✨ Breakthrough 2: CSS-Only Format
 *   styles: {
 *     container: `{ padding: 1rem; background: white; border-radius: 0.5rem; }`,
 *     title: `{ font-size: 1.2rem; font-weight: bold; }`,
 *     button: `{ background: #007bff; color: white; border: none; }`
 *   },
 *
 *   // ✨ Breakthrough 3: Unified API System
 *   api: {
 *     toggle: patch("/api/todos/:id/toggle", toggleHandler),
 *     remove: del("/api/todos/:id", removeHandler)
 *   },
 *
 *   // ✨ Breakthrough 1: Function-Style Props (Zero Duplication!)
 *   render: ({
 *     id = string(),
 *     text = string("Untitled"),
 *     completed = boolean(false),
 *     priority = oneOf(["low", "medium", "high"], "medium")
 *   }, api, classes) => (
 *     `<div class="${classes.container}">
 *        <h3 class="${classes.title}">${text}</h3>
 *        <button class="${classes.button}" ${api.toggle(id)}>
 *          ${completed ? "✓" : "○"}
 *        </button>
 *        <button class="${classes.button}" ${api.remove(id)}>×</button>
 *      </div>`
 *   )
 * });
 * ```
 *
 * ## 🎯 The Three Breakthroughs Explained
 *
 * ### 1. Function-Style Props (Zero Duplication!)
 * - Props are auto-inferred from render function parameters
 * - No need to define props twice
 * - TypeScript gets full type safety automatically
 *
 * ### 2. CSS-Only Format (Auto-Generated Classes!)
 * - Write pure CSS properties in strings
 * - Class names are auto-generated and scoped
 * - No manual class naming required
 *
 * ### 3. Unified API System (HTMX Attributes Auto-Generated!)
 * - Define server endpoints once
 * - Client functions with HTMX attributes generated automatically
 * - Seamless server-client integration
 *
 * ## 📚 More Examples
 *
 * ### Simple Component (No API)
 * ```tsx
 * defineSimpleComponent("greeting-card",
 *   ({ name = string("World"), age = number(0) }, api, classes) =>
 *     `<div class="${classes.card}">Hello ${name}! Age: ${age}</div>`,
 *   {
 *     card: `{ padding: 2rem; background: #f0f0f0; }`
 *   }
 * );
 * ```
 *
 * ### API-Enabled Component
 * ```tsx
 * defineApiComponent("user-profile",
 *   ({ userId = string(), name = string() }, api, classes) =>
 *     `<div class="${classes.profile}">
 *        <h2>${name}</h2>
 *        <button ${api.updateProfile(userId)}>Update</button>
 *      </div>`,
 *   {
 *     updateProfile: patch("/api/users/:id", updateHandler)
 *   },
 *   {
 *     profile: `{ border: 1px solid #ccc; padding: 1rem; }`
 *   }
 * );
 * ```
 */
