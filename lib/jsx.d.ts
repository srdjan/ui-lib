import type { ComponentAction } from "./actions.ts";
import type { ComponentPropsMap, JSXProps } from "./jsx-component-types.ts";

type JSXChild = string | number | boolean | null | undefined;
type JSXChildren = JSXChild | readonly JSXChild[];

type EventHandlers = {
  [K in keyof GlobalEventHandlers]?: ComponentAction | string;
};

type BaseIntrinsicProps = EventHandlers & {
  children?: JSXChildren;
  class?: string;
  className?:
    | string
    | readonly (string | readonly string[] | Record<string, boolean>)[];
  style?: string | Record<string, string | number>;
  dangerouslySetInnerHTML?: { __html: string };
  [key: string]: unknown;
};

declare global {
  namespace JSX {
    type Element = string;

    interface IntrinsicElements {
      [elemName: string]: BaseIntrinsicProps;

      "app-layout": BaseIntrinsicProps & {
        theme?: "light" | "dark" | "system" | "auto";
        responsive?: boolean;
        padding?: string;
        "max-width"?: string;
      };

      navbar: BaseIntrinsicProps & {
        position?: "top" | "bottom" | "left" | "right";
        style?: "primary" | "secondary" | "transparent" | "accent";
        orientation?: "horizontal" | "vertical";
        sticky?: boolean;
        collapsible?: boolean;
      };

      navitem: BaseIntrinsicProps & {
        href?: string;
        active?: boolean;
        disabled?: boolean;
        badge?: string;
        icon?: string;
        target?: string;
      };

      "main-content": BaseIntrinsicProps & {
        padding?: string;
        "max-width"?: string;
        scrollable?: boolean;
        centered?: boolean;
      };

      sidebar: BaseIntrinsicProps & {
        position?: "left" | "right";
        mode?: "permanent" | "overlay" | "push";
        width?: string;
        collapsible?: boolean;
        collapsed?: boolean;
      };
    }

    namespace JSX {
      interface IntrinsicElements extends ComponentJSXElements {}
    }

    type ComponentJSXElements = {
      [K in keyof ComponentPropsMap]:
        & JSXProps<ComponentPropsMap[K]>
        & EventHandlers
        & { children?: JSXChildren };
    };

    interface ElementChildrenAttribute {
      children: Record<PropertyKey, never>;
    }
  }
}
