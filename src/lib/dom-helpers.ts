// Helper utilities for DOM-native state management

/**
 * Spread HTMX attributes into HTML string format
 * @param attrs - Object containing HTMX attributes
 * @returns Formatted attribute string for HTML
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
 * Generate onclick handler to toggle CSS class
 * @param className - Class name to toggle
 * @returns onclick attribute value
 */
export const toggleClass = (className: string): string => {
  return `this.classList.toggle('${className}')`;
};

/**
 * Generate onclick handler to toggle multiple CSS classes
 * @param classes - Array of class names to toggle
 * @returns onclick attribute value
 */
export const toggleClasses = (classes: string[]): string => {
  return classes.map(cls => `this.classList.toggle('${cls}')`).join('; ');
};

/**
 * Generate onclick handler to update a counter element
 * @param selector - CSS selector for the counter element
 * @param delta - Amount to change the counter by
 * @returns onclick attribute value
 */
export const updateCounter = (selector: string, delta: number): string => {
  const script = `
    const el = this.querySelector('${selector}') || this;
    const current = parseInt(el.textContent || el.dataset.count || '0');
    const newValue = current + ${delta};
    el.textContent = newValue;
    if (el.dataset) el.dataset.count = newValue;
  `;
  return script.trim().replace(/\s+/g, ' ');
};

/**
 * Generate onclick handler to update parent element's counter
 * @param parentSelector - CSS selector for parent element
 * @param counterSelector - CSS selector for counter within parent
 * @param delta - Amount to change the counter by
 * @returns onclick attribute value
 */
export const updateParentCounter = (
  parentSelector: string, 
  counterSelector: string, 
  delta: number
): string => {
  const script = `
    const parent = this.closest('${parentSelector}');
    if (parent) {
      const counter = parent.querySelector('${counterSelector}');
      if (counter) {
        const current = parseInt(counter.textContent || '0');
        const newValue = current + ${delta};
        counter.textContent = newValue;
        if (parent.dataset) parent.dataset.count = newValue;
      }
    }
  `;
  return script.trim().replace(/\s+/g, ' ');
};

/**
 * Generate onclick handler to set text content of an element
 * @param selector - CSS selector for the element
 * @param value - Value to set
 * @returns onclick attribute value
 */
export const setText = (selector: string, value: string): string => {
  const safeValue = value.replace(/'/g, "'\'");
  const script = `
    const el = this.querySelector('${selector}') || this;
    el.textContent = '${safeValue}';
  `;
  return script.trim().replace(/\s+/g, ' ');
};

/**
 * Generate onclick handler to toggle element visibility
 * @param selector - CSS selector for the element to toggle
 * @returns onclick attribute value
 */
export const toggleVisibility = (selector: string): string => {
  const script = `
    const el = this.querySelector('${selector}');
    if (el) {
      el.style.display = el.style.display === 'none' ? '' : 'none';
    }
  `;
  return script.trim().replace(/\s+/g, ' ');
};

/**
 * Generate onclick handler to update form input value
 * @param selector - CSS selector for the input element
 * @param value - Value to set
 * @returns onclick attribute value
 */
export const updateInputValue = (selector: string, value: string): string => {
  const safeValue = value.replace(/'/g, "'\'");
  const script = `
    const input = this.querySelector('${selector}');
    if (input) input.value = '${safeValue}';
  `;
  return script.trim().replace(/\s+/g, ' ');
};

/**
 * Generate onchange handler to sync checkbox state with CSS class
 * @param className - CSS class to toggle based on checked state
 * @returns onchange attribute value
 */
export const syncCheckboxToClass = (className: string): string => {
  return `this.closest('.todo, [data-todo]').classList.toggle('${className}', this.checked)`;
};

/**
 * Generate conditional CSS class based on a condition
 * @param condition - Boolean condition
 * @param trueClass - Class when condition is true
 * @param falseClass - Class when condition is false (optional)
 * @returns CSS class string
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
 * @param data - Object containing data attributes
 * @returns Formatted data attributes string
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
 * @param content - Content to escape
 * @returns Escaped content
 */
export const escape = (content: string): string => {
  return String(content)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Generate onclick handler to reset a counter element to its initial value
 * @param displaySelector - CSS selector for the counter display element
 * @param initialValue - The value to reset the counter to
 * @param containerSelector - Optional CSS selector for a container to update a data attribute on
 * @returns onclick attribute value
 */
export const resetCounter = (
  displaySelector: string,
  initialValue: number | string,
  containerSelector?: string
): string => {
  const container = containerSelector ? `this.closest('${containerSelector}')` : 'this.parentElement';
  const script = `
    const container = ${container};
    if (container) {
      const display = container.querySelector('${displaySelector}');
      if (display) display.textContent = '${initialValue}';
      if (container.dataset) container.dataset.count = '${initialValue}';
    }
  `;
  return script.trim().replace(/\s+/g, ' ');
};

/**
 * Generate onclick handler for activating a tab
 * @param tabContainerSelector - CSS selector for the main tab container
 * @param tabButtonSelector - CSS selector for tab buttons
 * @param tabContentSelector - CSS selector for tab content panels
 * @param activeClass - The CSS class to denote the active tab/panel
 * @returns onclick attribute value
 */
export const activateTab = (
  tabContainerSelector: string,
  tabButtonSelector: string,
  tabContentSelector: string,
  activeClass: string
): string => {
  const script = `
    const self = this;
    const container = self.closest('${tabContainerSelector}');
    if (!container) return;
    const tabKey = self.dataset.tab;

    container.querySelectorAll('${tabButtonSelector}').forEach(btn => btn.classList.remove('${activeClass}'));
    self.classList.add('${activeClass}');

    container.querySelectorAll('${tabContentSelector}').forEach(content => content.classList.remove('${activeClass}'));
    
    const selector = "[data-tab='" + tabKey + "']";
    const activeContent = container.querySelector(selector);
    if (activeContent) activeContent.classList.add('${activeClass}');

    if (container.dataset) container.dataset.active = tabKey;
  `;
  return script.trim().replace(/\s+/g, ' ');
};

/**
 * Generate onclick handler to toggle a CSS class on the parent element.
 * @param className - The CSS class to toggle.
 * @returns onclick attribute value
 */
export const toggleParentClass = (className: string): string => {
  return `this.parentElement.classList.toggle('${className}')`;
};
