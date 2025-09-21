// Showcase Components - Interactive demo and documentation components
// Extracted from showcase inline JavaScript for broader reuse

export * from "./demo-viewer.ts";
export * from "./code-modal.ts";
export * from "./code-actions.ts";

// Export component types
export type { DemoViewerConfig, DemoViewerProps } from "./demo-viewer.ts";

export type {
  CodeModalConfig,
  CodeModalConfig as ModalConfig,
  CodeModalProps,
  CodeModalProps as ModalProps,
} from "./code-modal.ts";

export type {
  CodeActionConfig,
  CodeActionConfig as ActionConfig,
  CodeActionResult,
  CodeActionResult as ActionResult,
} from "./code-actions.ts";
