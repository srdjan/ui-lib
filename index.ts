// Main exports for ui-lib - DOM-native SSR components library

// Core component system
export { renderComponent } from "./lib/component-state.ts";
export { defineComponent } from "./lib/define-component.ts";
export type { DefinedComponent } from "./lib/define-component.ts";
export { h } from "./lib/jsx-runtime.ts";

// NEW: Complete component library
export * from "./lib/components/index.ts";

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
export { err, flatMap, map, mapError, ok } from "./lib/result.ts";
export type { Result } from "./lib/result.ts";

// SSR utilities
export { escapeHtml } from "./lib/ssr.ts";

// Type definitions
export type { ComponentAction } from "./lib/actions.ts";
export type {
  ApiClientOptions,
  ApiMap,
  GeneratedApiMap,
} from "./lib/api-generator.ts";
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

// Enhanced prop helpers (Phase 1)
export {
  array2,
  boolean2,
  isTypedPropHelper,
  number2,
  object2,
  // Compatibility exports
  string2,
  typedArray,
  typedBoolean,
  typedNumber,
  typedObject,
  typedString,
} from "./lib/prop-helpers-v2.ts";

// CSS-in-TypeScript system (Phase 2)
export {
  composeStyles,
  createTheme,
  css,
  cssHelpers,
  type CSSProperties,
  responsive,
  type StyleMap,
  type StyleObject,
  type ThemeTokens,
} from "./lib/css-in-ts.ts";

// Component composition helpers (Phase 3)
export {
  Card,
  type CardProps,
  Form,
  type FormField,
  type FormProps,
  Grid,
  type GridProps,
  Layout,
  type LayoutProps,
  Navigation,
  type NavigationProps,
  type NavItem,
} from "./lib/composition.ts";

// Re-export ButtonGroup for backward compatibility (now in components library)
export {
  ButtonGroup,
  type ButtonGroupProps,
} from "./lib/components/button/index.ts";

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
  findClosestComponent,
  type ReactiveEventTarget,
  type ReactiveScope,
  safeExecute,
} from "./lib/reactive-helpers.ts";

// Global configuration
export { configure, type FuncwcConfig } from "./lib/config.ts";

// Layout Components Library
export type {
  AppLayoutProps,
  LayoutOrientation,
  LayoutTheme,
  MainContentProps,
  NavbarPosition,
  NavbarProps,
  NavbarStyle,
  NavItemProps,
  SidebarMode,
  SidebarPosition,
  SidebarProps,
} from "./lib/layout/layout-types.ts";

// Layout components are auto-registered when imported
export * from "./lib/layout/index.ts";

// Development Tools and Debugging (Phase 4)
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

// Performance Optimizations (Phase 5)
export {
  cachedRender,
  type CacheEntry,
  type CacheKey,
  cacheMonitoring,
  type CacheOptions,
  cachePresets,
  type CacheStats,
  cacheWarming,
  getRenderCache,
  initializeRenderCache,
  PerformanceCache,
} from "./lib/performance-cache.ts";

export {
  type BundleAnalysis,
  BundleAnalyzer,
  codeSplitting,
  MinimalRuntime,
  type ModuleInfo,
  type OptimizationConfig,
  optimizationPresets,
  treeShaking,
} from "./lib/bundle-optimizer.ts";

export {
  type CompiledTemplate,
  type OptimizationReport,
  PropParserOptimizer,
  RenderBatchOptimizer,
  type RenderMetrics,
  renderOptimizationPresets,
  RenderOptimizer,
  RenderProfiler,
  TemplateCompiler,
} from "./lib/render-optimizer.ts";
