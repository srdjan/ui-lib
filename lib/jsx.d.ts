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

      // ui-lib component types - add specific component prop types here

      // Layout components
      "app-layout": {
        theme?: "light" | "dark" | "system" | "auto";
        responsive?: boolean;
        padding?: string;
        "max-width"?: string;
        children?: string | string[];
      };

      navbar: {
        position?: "top" | "bottom" | "left" | "right";
        style?: "primary" | "secondary" | "transparent" | "accent";
        orientation?: "horizontal" | "vertical";
        sticky?: boolean;
        collapsible?: boolean;
        children?: string | string[];
      };

      navitem: {
        href?: string;
        active?: boolean;
        disabled?: boolean;
        badge?: string;
        icon?: string;
        target?: string;
        children?: string | string[];
      };

      "main-content": {
        padding?: string;
        "max-width"?: string;
        scrollable?: boolean;
        centered?: boolean;
        children?: string | string[];
      };

      sidebar: {
        position?: "left" | "right";
        mode?: "permanent" | "overlay" | "push";
        width?: string;
        collapsible?: boolean;
        collapsed?: boolean;
        children?: string | string[];
      };
    }

    // Extend IntrinsicElements with registered ui-lib components
    namespace JSX {
      interface IntrinsicElements extends ComponentJSXElements {}
    }

    // Generate JSX element types for all registered ui-lib components
    type ComponentJSXElements = {
      [K in keyof ComponentPropsMap]:
        & JSXProps<ComponentPropsMap[K]>
        & EventHandlers
        & {
          children?: string | number | boolean | null | undefined;
        };
    };

    // Enhanced element children attribute
    interface ElementChildrenAttribute {
      children: Record<PropertyKey, never>;
    }
  }
}
