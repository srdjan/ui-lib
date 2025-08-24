import type { ComponentAction } from './actions.ts';

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
      [elemName: string]: Record<string, any> & EventHandlers;
    }
  }
}
