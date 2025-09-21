/**
 * Layout Components Module
 * Provides semantic layout components for consistent application structure
 */

// Core layout components
export { Grid } from "./grid.ts";
export { Header } from "./header.tsx";
export { Page } from "./page.tsx";
export { Section } from "./section.tsx";
export { Stack } from "./stack.tsx";
// Note: The following components are staged or not yet implemented; omit from public exports for now.
// export { Footer } from "./footer.ts";
// export { Container } from "./container.ts";
export { Card } from "./card.ts";
// export { Sidebar } from "./sidebar.ts";
// export { Main } from "./main.ts";
// export { Flex } from "./flex.ts";
// export { Center } from "./center.ts";
// export { Spacer } from "./spacer.ts";
// export { Divider } from "./divider.ts";

// Layout presets
export { AppLayout } from "./app-layout.ts";
// export { DashboardLayout } from "./dashboard-layout.ts";
// export { BlogLayout } from "./blog-layout.ts";
// export { LandingLayout } from "./landing-layout.ts";

// Types
export type {
  Alignment,
  CardProps,
  ContainerProps,
  FlexProps,
  GridProps,
  HeaderProps,
  LayoutPreset,
  LayoutProps,
  LayoutVariant,
  SectionProps,
  Spacing,
  StackProps,
} from "./types.ts";
