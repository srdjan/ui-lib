// ui-lib Simplified API - Direct JSX components without complexity
// This is the new, streamlined public API

// Core JSX runtime and utilities
export { 
  h, 
  jsx, 
  jsxs, 
  Fragment, 
  escape, 
  css, 
  renderToString,
  state,
  initStateBindings
} from "./lib/simple.tsx";

// Essential components
export {
  Button,
  Input,
  Card,
  Alert,
  Container
} from "./lib/components-simple.tsx";

// API integration components and helpers
export {
  apiAction,
  TodoItem,
  TodoList,
  todoHandlers
} from "./lib/api-simple.tsx";

// Simple router (reuse existing minimal router)
export { Router } from "./lib/router.ts";

// Response helpers (reuse existing)
export { html, json, text, error } from "./lib/response.ts";

// JSX types
import "./lib/jsx.d.ts";