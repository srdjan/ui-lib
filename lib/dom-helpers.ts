import type {
  ChainAction,
  ComponentAction,
  ToggleClassAction,
  ToggleClassesAction,
} from "./actions.ts";
import { escape } from "./escape.ts";

// Type-safe DOM helper functions that return structured action objects
// These can be used directly in JSX event handlers: onClick={toggleClass('active')}

/**
 * Toggle a single CSS class on the element
 * @param className - Class name to toggle
 */
export const toggleClass = (className: string): ToggleClassAction => ({
  type: "toggleClass",
  className,
});

/**
 * Toggle multiple CSS classes on the element
 * @param classNames - Array of class names to toggle
 */
export const toggleClasses = (classNames: string[]): ToggleClassesAction => ({
  type: "toggleClasses",
  classNames,
});

/**
 * Compose multiple actions into a single action for event handlers
 */
export const chain = (...actions: ComponentAction[]): ChainAction => ({
  type: "chain",
  actions: actions.flatMap((a) => a.type === "chain" ? a.actions : [a]) as (
    ToggleClassAction | ToggleClassesAction
  )[],
});

// --- Pure utility functions that are not event handlers remain the same ---

/**
 * Spread HTMX attributes into HTML string format
 */
export const spreadAttrs = (attrs: Record<string, unknown> = {}): string => {
  return Object.entries(attrs)
    .map(([key, value]) => {
      const safeValue = String(value).replace(/"/g, "&quot;");
      return `${key}="${safeValue}"`;
    })
    .join(" ");
};

/**
 * Generate conditional CSS class based on a condition
 */
export const conditionalClass = (
  condition: boolean,
  trueClass: string,
  falseClass: string = "",
): string => {
  return condition ? trueClass : falseClass;
};

/**
 * Generate data attributes string from object
 */
export const dataAttrs = (data: Record<string, unknown>): string => {
  return Object.entries(data)
    .map(([key, value]) => {
      const attrKey = `data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      const attrValue = `"${String(value)}"`;
      return `${attrKey}=${attrValue}`;
    })
    .join(" ");
};

export { escape };
