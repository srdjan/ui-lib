// Shared TypeScript types for layout components

export type LayoutTheme = "light" | "dark" | "system" | "auto";
export type LayoutOrientation = "horizontal" | "vertical";
export type NavbarPosition = "top" | "bottom" | "left" | "right";
export type NavbarStyle = "primary" | "secondary" | "transparent" | "accent";
export type SidebarPosition = "left" | "right";
export type SidebarMode = "push" | "overlay" | "permanent";

export interface NavItemState {
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export interface ResponsiveConfig {
  breakpoints?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  collapsible?: boolean;
  mobileMenu?: boolean;
}

export interface ThemeConfig {
  cssProperties?: Record<string, string>;
  classes?: string[];
}

// Layout component prop interfaces
export interface AppLayoutProps {
  theme?: LayoutTheme;
  responsive?: boolean | ResponsiveConfig;
  padding?: string;
  maxWidth?: string;
  children?: string;
}

export interface NavbarProps {
  position?: NavbarPosition;
  style?: NavbarStyle;
  orientation?: LayoutOrientation;
  sticky?: boolean;
  collapsible?: boolean;
  children?: string;
}

export interface NavItemProps {
  href?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  icon?: string;
  target?: string;
  children?: string;
}

export interface MainContentProps {
  padding?: string;
  maxWidth?: string;
  scrollable?: boolean;
  centered?: boolean;
  children?: string;
}

export interface SidebarProps {
  position?: SidebarPosition;
  mode?: SidebarMode;
  width?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  children?: string;
}
