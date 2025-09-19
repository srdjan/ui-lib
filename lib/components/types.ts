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

export interface BaseComponentProps {
  className?: string;
  size?: ComponentSize;
  variant?: ComponentVariant;
  disabled?: boolean;
  children?: unknown | unknown[];
}

export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: string;
  onFocus?: string;
  onBlur?: string;
  onKeyDown?: string;
}

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
export interface SpacingProps {
  padding?: string | number;
  margin?: string | number;
  gap?: string | number;
}

export interface LayoutProps extends SpacingProps {
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
}
