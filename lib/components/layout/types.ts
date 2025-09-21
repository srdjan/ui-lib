/**
 * Layout Component Types
 * Comprehensive type definitions for all layout components
 */

import type { ComponentSize } from "../types.ts";

// Core layout types
export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | string;
export type Alignment = "start" | "center" | "end" | "stretch" | "baseline";
export type JustifyContent = "start" | "center" | "end" | "between" | "around" | "evenly";
export type Direction = "row" | "column" | "row-reverse" | "column-reverse";
export type Wrap = "nowrap" | "wrap" | "wrap-reverse";

// Layout variants
export type LayoutVariant = "default" | "contained" | "full-width" | "centered" | "sidebar";
export type ContainerVariant = "fluid" | "constrained" | "narrow" | "wide";
export type CardVariant = "default" | "elevated" | "outlined" | "filled" | "interactive";

// Layout presets for different application types
export type LayoutPreset =
  | "app"           // General application layout
  | "dashboard"     // Admin dashboard with sidebar
  | "blog"          // Content-focused blog layout
  | "landing"       // Marketing landing page
  | "docs"          // Documentation layout
  | "auth"          // Authentication pages
  | "empty";        // Minimal layout

// Base props for all layout components
export interface BaseLayoutProps {
  readonly className?: string;
  readonly id?: string;
  readonly role?: string;
  readonly ariaLabel?: string;
}

// Common spacing props
export interface SpacingProps {
  readonly padding?: Spacing;
  readonly paddingX?: Spacing;
  readonly paddingY?: Spacing;
  readonly margin?: Spacing;
  readonly marginX?: Spacing;
  readonly marginY?: Spacing;
  readonly gap?: Spacing;
}

// Core component props
export interface LayoutProps extends BaseLayoutProps {
  readonly preset?: LayoutPreset;
  readonly variant?: LayoutVariant;
  readonly maxWidth?: string;
  readonly className?: string;
}

export interface PageProps extends BaseLayoutProps, SpacingProps {
  readonly maxWidth?: string;
  readonly centered?: boolean;
  readonly variant?: ContainerVariant;
  readonly children?: unknown;
}

export interface StackProps extends BaseLayoutProps, SpacingProps {
  readonly spacing?: Spacing;
  readonly align?: Alignment;
  readonly dividers?: boolean;
  readonly children?: unknown;
}

export interface GridProps extends BaseLayoutProps, SpacingProps {
  readonly columns?: number | string;
  readonly rows?: number | string;
  readonly areas?: string;
  readonly responsive?: boolean;
  readonly minItemWidth?: string;
  readonly children?: unknown;
}

export interface FlexProps extends BaseLayoutProps, SpacingProps {
  readonly direction?: Direction;
  readonly wrap?: Wrap;
  readonly align?: Alignment;
  readonly justify?: JustifyContent;
  readonly inline?: boolean;
  readonly children?: unknown;
}

export interface SectionProps extends BaseLayoutProps, SpacingProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly variant?: "default" | "contained" | "full-width";
  readonly children?: unknown;
}

export interface HeaderProps extends BaseLayoutProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly description?: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly centered?: boolean;
}

export interface ContainerProps extends BaseLayoutProps, SpacingProps {
  readonly variant?: ContainerVariant;
  readonly maxWidth?: string;
  readonly centered?: boolean;
}

export interface CardProps extends BaseLayoutProps, SpacingProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly variant?: CardVariant;
  readonly size?: ComponentSize;
  readonly interactive?: boolean;
  readonly href?: string;
}

export interface SidebarProps extends BaseLayoutProps {
  readonly position?: "left" | "right";
  readonly width?: string;
  readonly collapsible?: boolean;
  readonly defaultCollapsed?: boolean;
  readonly variant?: "default" | "overlay" | "push";
}

export interface MainProps extends BaseLayoutProps, SpacingProps {
  readonly centered?: boolean;
  readonly maxWidth?: string;
}

export interface CenterProps extends BaseLayoutProps {
  readonly maxWidth?: string;
  readonly inline?: boolean;
}

export interface SpacerProps extends BaseLayoutProps {
  readonly size?: Spacing;
  readonly direction?: "horizontal" | "vertical";
}

export interface DividerProps extends BaseLayoutProps {
  readonly orientation?: "horizontal" | "vertical";
  readonly variant?: "solid" | "dashed" | "dotted";
  readonly spacing?: Spacing;
}

export interface FooterProps extends BaseLayoutProps, SpacingProps {
  readonly variant?: "default" | "sticky" | "fixed";
  readonly links?: Array<{
    text: string;
    href: string;
    external?: boolean;
  }>;
  readonly copyright?: string;
}