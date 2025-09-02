import type { ComponentAction } from "./actions.ts";
import type { ComponentPropsMap, JSXProps } from "./jsx-component-types.ts";

// Define global event handler types to accept our ComponentAction objects
type EventHandlers = {
  [K in keyof GlobalEventHandlers]?: ComponentAction | string;
};

declare global {
  namespace JSX {
    // The return type of our h function is a string
    type Element = string;

    // This defines the props that intrinsic elements like 'div' or 'button' can have.
    // It includes all standard HTML attributes, plus our custom event handlers.
    interface IntrinsicElements {
      [elemName: string]: Record<string, unknown> & EventHandlers;
      
      // funcwc component types - add specific component prop types here
    }
    
    // Extend IntrinsicElements with registered funcwc components
    namespace JSX {
      interface IntrinsicElements extends ComponentJSXElements {}
    }
    
    // Generate JSX element types for all registered funcwc components
    type ComponentJSXElements = {
      [K in keyof ComponentPropsMap]: JSXProps<ComponentPropsMap[K]> & EventHandlers & {
        children?: string | number | boolean | null | undefined;
      };
    };

    // Enhanced element children attribute
    interface ElementChildrenAttribute {
      children: Record<PropertyKey, never>;
    }
  }
}
