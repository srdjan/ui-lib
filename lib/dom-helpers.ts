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
 * Spread HTMX attributes into format suitable for JSX spread operator
 * Returns Record<string, string> for proper JSX handling
 */
export const spreadAttrs = (attrs: Record<string, unknown> = {}): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    result[key] = String(value);
  }
  return result;
};

// Build attributes safely, supporting boolean presence attributes
export const buildAttrs = (attrs: Record<string, unknown> = {}): string => {
  if (!attrs) return "";
  return Object.entries(attrs)
    .flatMap(([key, value]) => {
      if (value === false || value === undefined || value === null) return [];
      if (value === true) return [key];
      return [`${key}="${escape(String(value))}"`];
    })
    .join(" ");
};

// Build a safe hx-vals attribute from a values object
export const hxVals = (values: Record<string, unknown>): string =>
  `hx-vals="${escape(JSON.stringify(values))}"`;

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
