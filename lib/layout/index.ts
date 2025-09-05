// ui-lib Layout Components Library
// Composable layout components for building responsive, accessible layouts

// Export layout component types
export type {
  LayoutOrientation,
  LayoutTheme,
  ModalProps,
  NavItemState,
  SidebarPosition,
} from "./layout-types.ts";

// Export layout components
export { AppLayout } from "./app-layout.tsx";
export { Navbar } from "./navbar.tsx";
export { NavItem } from "./navitem.tsx";
export { MainContent } from "./main-content.tsx";
export { Sidebar } from "./sidebar.tsx";
export { Modal } from "./modal.tsx";

// Auto-register all layout components when imported
import "./app-layout.tsx";
import "./navbar.tsx";
import "./navitem.tsx";
import "./main-content.tsx";
import "./sidebar.tsx";
import "./modal.tsx";

// Usage:
// import "ui-lib/layout"; // Auto-registers all layout components
//
// <app-layout theme="system" responsive>
//   <navbar position="top" variant="primary">
//     <navitem href="/" active>Home</navitem>
//     <navitem href="/docs">Documentation</navitem>
//   </navbar>
//   <main-content>
//     <!-- Your app content -->
//   </main-content>
// </app-layout>
