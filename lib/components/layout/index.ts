/**
 * Layout Components Module
 * Provides semantic layout components for consistent application structure
 */

// Core layout components
export { Page } from "./page.tsx";
export { Stack } from "./stack.tsx";
export { Grid } from "./grid.ts";
export { Section } from "./section.tsx";
export { Header } from "./header.tsx";
export { Footer } from "./footer.ts";
export { Container } from "./container.ts";
export { Card } from "./card.ts";
export { Sidebar } from "./sidebar.ts";
export { Main } from "./main.ts";
export { Flex } from "./flex.ts";
export { Center } from "./center.ts";
export { Spacer } from "./spacer.ts";
export { Divider } from "./divider.ts";

// Layout presets
export { AppLayout } from "./app-layout.ts";
export { DashboardLayout } from "./dashboard-layout.ts";
export { BlogLayout } from "./blog-layout.ts";
export { LandingLayout } from "./landing-layout.ts";

// Types
export type {
  LayoutProps,
  StackProps,
  GridProps,
  SectionProps,
  HeaderProps,
  ContainerProps,
  CardProps,
  FlexProps,
  LayoutPreset,
  LayoutVariant,
  Spacing,
  Alignment,
} from "./types.ts";
