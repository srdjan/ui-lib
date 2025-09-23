// ui-lib Token-Based Public API
// Only block-level components and token customization are exposed
// Components can ONLY be customized through CSS variables

// ============================================================
// Components - Sealed with Token Interfaces
// ============================================================

// Button component
export { Button } from "./lib/components/button/token-button.ts";
export type { ButtonProps } from "./lib/components/button/token-button.ts";

// Future components will be added here:
// export { Input } from "./lib/components/input/token-input.ts";
// export { Card } from "./lib/components/card/token-card.ts";
// export { Modal } from "./lib/components/modal/token-modal.ts";
// export { Alert } from "./lib/components/feedback/token-alert.ts";
// export { Badge } from "./lib/components/feedback/token-badge.ts";
// export { Stack } from "./lib/components/layout/token-stack.ts";
// export { Grid } from "./lib/components/layout/token-grid.ts";

// ============================================================
// Token Customization API
// ============================================================

export {
  applyTheme,
  createTheme,
  customizeComponent,
  // Main customization functions
  defineTokens,
  // Utility
  getAllComponentStyles,
  responsiveTokens,
  // Pre-built themes
  themes,
} from "./lib/tokens/index.ts";

// Token type definitions for IntelliSense
export type {
  ButtonTokens,
  Theme,
  TokenOverrides,
  // Future token types:
  // InputTokens,
  // CardTokens,
  // ModalTokens,
  // LayoutTokens,
  // FeedbackTokens,
} from "./lib/tokens/index.ts";

// ============================================================
// SSR Support (Minimal)
// ============================================================

// Component rendering for SSR
export { renderComponent } from "./lib/component-state.ts";

// Response helpers for SSR
export { error, html, json, text } from "./lib/response.ts";

// Router for SSR (if needed by applications)
export { Router } from "./lib/router.ts";
export type { RouteHandler, RouteParams } from "./lib/router.ts";

// ============================================================
// IMPORTANT: The following are NOT exposed:
// ============================================================
// ❌ css() function
// ❌ composeStyles()
// ❌ createTheme() for CSS-in-JS
// ❌ defineComponent()
// ❌ prop helpers (string(), number(), etc.)
// ❌ Direct style manipulation utilities
// ❌ Internal component implementation details
// ❌ CSS-in-TS system internals

/**
 * Usage Example:
 *
 * ```typescript
 * import { Button, defineTokens, applyTheme, themes } from "ui-lib/mod-token";
 *
 * // Apply a pre-built theme
 * const styles = applyTheme(themes.dark);
 *
 * // Or define custom tokens
 * const customStyles = defineTokens({
 *   button: {
 *     primary: {
 *       background: "#FF5722",
 *       backgroundHover: "#E64A19"
 *     }
 *   }
 * });
 *
 * // Use the component
 * const button = Button({
 *   variant: "primary",
 *   children: "Click Me"
 * });
 * ```
 *
 * Components are sealed - they can only be customized through tokens.
 * This ensures consistency and prevents style conflicts.
 */
