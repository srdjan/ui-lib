// Utilities - Common utility functions for ui-lib
// Extracted from showcase and made available to all applications

export * from "./clipboard.ts";
export * from "./smooth-scroll.ts";
export * from "./htmx-integration.ts";

// Export utility types
export type {
  ClipboardResult,
} from "./clipboard.ts";

export type {
  ScrollOptions,
} from "./smooth-scroll.ts";

export type {
  HTMXRequestOptions,
} from "./htmx-integration.ts";

// Export utility functions
export {
  ClipboardUtil,
  copyToClipboard,
  copyElementContent,
  copyWithFeedback,
  createClipboardScript,
} from "./clipboard.ts";

export {
  SmoothScroll,
  scrollEasing,
  smoothScrollTo,
  smoothScrollToTop,
  setupSmoothScrolling,
  createSmoothScrollScript,
} from "./smooth-scroll.ts";

export {
  HTMXUtil,
  htmx,
  htmxPatterns,
  createHTMXScript,
} from "./htmx-integration.ts";