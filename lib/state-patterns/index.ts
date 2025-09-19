// State Patterns - Reusable state management patterns for ui-lib
// Common patterns extracted from showcase and made available to all applications

export * from "./cart-manager.ts";
export * from "./theme-manager.ts";

// Export common pattern types (only from their actual sources)
export type {
  CartItem,
  CartState,
  CartAction,
  CartManagerConfig,
} from "./cart-manager.ts";

export type {
  ThemeConfig,
  ThemeState,
  ThemeManagerConfig,
} from "./theme-manager.ts";