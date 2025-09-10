// Showcase Components - Interactive demo and documentation components
// Extracted from showcase inline JavaScript for broader reuse

export * from "./demo-viewer.ts";
export * from "./code-modal.ts";
export * from "./code-actions.ts";

// Export component types
export type {
  DemoViewerConfig,
  DemoViewerProps,
  CodeModalConfig,
  CodeModalProps,
  CodeActionConfig,
  CodeActionResult,
} from "./demo-viewer.ts";

export type {
  CodeModalConfig as ModalConfig,
  CodeModalProps as ModalProps,
} from "./code-modal.ts";

export type {
  CodeActionConfig as ActionConfig,
  CodeActionResult as ActionResult,
} from "./code-actions.ts";