// ui-lib Simplified API - Direct JSX components without complexity
// This is the new, streamlined public API

// Core JSX runtime and utilities
export {
  css,
  escape,
  Fragment,
  h,
  initStateBindings,
  jsx,
  jsxs,
  renderToString,
  state,
} from "./lib/simple.tsx";

// Essential components
export {
  Alert,
  Button,
  Card,
  Container,
  Input,
} from "./lib/components-simple.tsx";

// Additional components from full library
export { Badge } from "./lib/components/feedback/badge.ts";

// API integration components and helpers
export {
  apiAction,
  todoHandlers,
  TodoItem,
  TodoList,
} from "./lib/api-simple.tsx";

// Simple router (reuse existing minimal router)
export { Router } from "./lib/router.ts";

// Response helpers (reuse existing)
export { error, html, json, text } from "./lib/response.ts";

// HTTP method helpers for API definitions
export { del, get, patch, post, put, remove } from "./lib/api-helpers.ts";
export type { ApiAction, ApiRoute } from "./lib/api-helpers.ts";

// Component API registration
export { registerComponentApi } from "./lib/define-component.ts";

// JSX types
import "./lib/jsx.d.ts";
