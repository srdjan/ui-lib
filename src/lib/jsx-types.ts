// Enhanced JSX type definitions for funcwc components
// This file extends the existing JSX types

import { type ComponentAction as _ComponentAction } from './actions.ts';

declare global {
  namespace JSX {
    // Enhance the existing IntrinsicElements with better event handler types
    interface ElementChildrenAttribute {
      children: Record<PropertyKey, never>;
    }
  }
}

// Export empty object to make this a module
export {};