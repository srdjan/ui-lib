// ui-lib - The Most Ergonomic Component Library Ever Built
// Complete library export including all extracted functionality from showcase

// Core library functionality
export * from "./define-component.ts";
export * from "./jsx-runtime.ts";
export * from "./ssr.ts";
export * from "./router.ts";
export * from "./state-manager.ts";
export * from "./reactive-helpers.ts";
export * from "./actions.ts";

// Component library
export * from "./components/index.ts";

// State management patterns (extracted from showcase)
// Export specific items to avoid conflicts
export { CartManager } from "./state-patterns/index.ts";
export type { ThemeManager } from "./state-patterns/index.ts";

// Animation utilities (extracted from showcase)
export * from "./animations/index.ts";

// Utility functions (extracted from showcase)
export * from "./utils/index.ts";

// Core types - only export what exists
export type { PropsOf, UnwrapHelpers } from "./types.ts";

// Component types
export type {
  ComponentSize,
  ComponentState,
  ComponentVariant,
} from "./components/types.ts";

// State management types
export type {
  CartItem,
  CartState,
  ThemeState,
} from "./state-patterns/index.ts";

// Animation types
export type {
  CounterAnimationOptions,
  EasingFunction,
} from "./animations/index.ts";

// Utility types
export type { ClipboardResult } from "./utils/index.ts";

// Action types
export type { BaseAction, ChainAction, ComponentAction } from "./actions.ts";
