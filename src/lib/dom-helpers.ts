import type {
  ToggleClassAction,
  ToggleClassesAction,
  UpdateParentCounterAction,
  ResetCounterAction,
  ActivateTabAction,
  ToggleParentClassAction,
  SyncCheckboxAction,
} from './actions.ts';

// Type-safe DOM helper functions that return structured action objects
// These can be used directly in JSX event handlers: onClick={toggleClass('active')}

/**
 * Toggle a single CSS class on the element
 * @param className - Class name to toggle
 */
export const toggleClass = (className: string): ToggleClassAction => ({
  type: 'toggleClass', className
});

/**
 * Toggle multiple CSS classes on the element
 * @param classNames - Array of class names to toggle
 */
export const toggleClasses = (classNames: string[]): ToggleClassesAction => ({
  type: 'toggleClasses', classNames
});

/**
 * Update a counter in a parent element
 * @param parentSelector - CSS selector for the parent container
 * @param counterSelector - CSS selector for the counter display element
 * @param delta - Amount to increment/decrement
 */
export const updateParentCounter = (parentSelector: string, counterSelector: string, delta: number): UpdateParentCounterAction => ({
  type: 'updateParentCounter', parentSelector, counterSelector, delta
});

/**
 * Reset a counter to its initial value
 * @param displaySelector - CSS selector for the counter display
 * @param initialValue - Value to reset to
 * @param containerSelector - Optional container selector (defaults to '.counter')
 */
export const resetCounter = (displaySelector: string, initialValue: number | string, containerSelector?: string): ResetCounterAction => ({
  type: 'resetCounter', displaySelector, initialValue, containerSelector
});

/**
 * Activate a tab in a tab system
 * @param container - CSS selector for the tab container
 * @param buttons - CSS selector for tab buttons
 * @param content - CSS selector for tab content
 * @param activeClass - CSS class name for active state
 */
export const activateTab = (container: string, buttons: string, content: string, activeClass: string): ActivateTabAction => ({
  type: 'activateTab', container, buttons, content, activeClass
});

/**
 * Toggle a CSS class on the parent element
 * @param className - Class name to toggle
 */
export const toggleParentClass = (className: string): ToggleParentClassAction => ({
  type: 'toggleParentClass', className
});

/**
 * Sync a checkbox state to a CSS class on the closest container
 * @param className - Class name to sync with checkbox state
 */
export const syncCheckboxToClass = (className: string): SyncCheckboxAction => ({
  type: 'syncCheckbox', className
});


// --- Pure utility functions that are not event handlers remain the same ---

/**
 * Spread HTMX attributes into HTML string format
 */
export const spreadAttrs = (attrs: Record<string, unknown> = {}): string => {
  return Object.entries(attrs)
    .map(([key, value]) => {
      const safeValue = String(value).replace(/"/g, '&quot;');
      return `${key}="${safeValue}"`;
    })
    .join(' ');
};

/**
 * Generate conditional CSS class based on a condition
 */
export const conditionalClass = (
  condition: boolean, 
  trueClass: string, 
  falseClass: string = ''
): string => {
  return condition ? trueClass : falseClass;
};

/**
 * Generate data attributes string from object
 */
export const dataAttrs = (data: Record<string, unknown>): string => {
  return Object.entries(data)
    .map(([key, value]) => {
      const attrKey = `data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      const attrValue = `"${String(value)}"`;
      return `${attrKey}=${attrValue}`;
    })
    .join(' ');
};

/**
 * Escape HTML content for safe inclusion in templates
 */
export const escape = (content: string): string => {
  return String(content)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};
