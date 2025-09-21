// State Patterns - Reusable state management patterns for ui-lib
// Common patterns extracted from showcase and made available to all applications

export * from "./cart-manager.ts";
export * from "./theme-manager.ts";

// Export common pattern types (only from their actual sources)
export type {
  CartAction,
  CartItem,
  CartManagerConfig,
  CartState,
} from "./cart-manager.ts";

export type {
  ThemeConfig,
  ThemeManagerConfig,
  ThemeState,
} from "./theme-manager.ts";
