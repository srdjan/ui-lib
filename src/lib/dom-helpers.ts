import type { 
  ToggleClassAction, 
  ToggleClassesAction, 
  UpdateParentCounterAction, 
  ResetCounterAction, 
  ActivateTabAction, 
  ToggleParentClassAction, 
  SyncCheckboxAction 
} from './actions.ts';

// DOM-helper functions now return structured action objects instead of strings.

export consttoggleClass = (className: string): ToggleClassAction => ({
  type: 'toggleClass', className
});

export const toggleClasses = (classNames: string[]): ToggleClassesAction => ({
  type: 'toggleClasses', classNames
});

export const updateParentCounter = (parentSelector: string, counterSelector: string, delta: number): UpdateParentCounterAction => ({
  type: 'updateParentCounter', parentSelector, counterSelector, delta
});

export const resetCounter = (displaySelector: string, initialValue: number | string, containerSelector?: string): ResetCounterAction => ({
  type: 'resetCounter', displaySelector, initialValue, containerSelector
});

export const activateTab = (container: string, buttons: string, content: string, activeClass: string): ActivateTabAction => ({
  type: 'activateTab', container, buttons, content, activeClass
});

export const toggleParentClass = (className: string): ToggleParentClassAction => ({
  type: 'toggleParentClass', className
});

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