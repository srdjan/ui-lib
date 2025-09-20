// Shared component types for ui-lib component library

export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ComponentVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "success"
  | "warning"
  | "error"
  | "info"
  // Extended to allow component-specific variants
  | "destructive"
  | "subtle"
  | "solid"
  | "linear"
  | "attached"
  | "spaced"
  | "default"
  | "filled"
  | "flushed"
  | "unstyled"
  | "circular"
  | "compact";

export type ComponentState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled";

export type BaseComponentProps = {
  readonly className?: string;
  readonly size?: ComponentSize;
  readonly variant?: ComponentVariant;
  readonly disabled?: boolean;
  readonly children?: unknown | unknown[];
};

export type InteractiveComponentProps = BaseComponentProps & {
  readonly onClick?: string;
  readonly onFocus?: string;
  readonly onBlur?: string;
  readonly onKeyDown?: string;
};

// Position types for overlays
export type Position =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

// Common style utilities
export type SpacingProps = {
  readonly padding?: string | number;
  readonly margin?: string | number;
  readonly gap?: string | number;
};

export type LayoutProps = SpacingProps & {
  readonly width?: string | number;
  readonly height?: string | number;
  readonly maxWidth?: string | number;
  readonly maxHeight?: string | number;
};
