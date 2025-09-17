// Reactive helper functions for ui-lib components
// Supports three types of reactivity: CSS properties, Pub/Sub state, and DOM events

/**
 * CSS Property Reactivity Helpers
 * For visual coordination, theming, and styling state
 */

/**
 * Generate inline JavaScript to set a CSS custom property
 * @param property - Property name (without -- prefix)
 * @param value - Property value
 * @param scope - 'global' for document root, 'component' for closest component container
 */
export const setCSSProperty = (
  property: string,
  value: string,
  scope: "global" | "component" = "global",
): string => {
  const target = scope === "global"
    ? "document.documentElement"
    : 'this.closest("[data-component]")';
  return `${target}.style.setProperty('--${property}', '${value}')`;
};

/**
 * Generate inline JavaScript to get a CSS custom property value
 * @param property - Property name (without -- prefix)
 * @param scope - 'global' for document root, 'component' for closest component container
 */
export const getCSSProperty = (
  property: string,
  scope: "global" | "component" = "global",
): string => {
  const target = scope === "global"
    ? "document.documentElement"
    : 'this.closest("[data-component]")';
  return `${target}.style.getPropertyValue('--${property}')`;
};

/**
 * Generate inline JavaScript to toggle a CSS custom property between two values
 * @param property - Property name (without -- prefix)
 * @param value1 - First value
 * @param value2 - Second value
 * @param scope - 'global' for document root, 'component' for closest component container
 */
export const toggleCSSProperty = (
  property: string,
  value1: string,
  value2: string,
  scope: "global" | "component" = "global",
): string => {
  const target = scope === "global"
    ? "document.documentElement"
    : 'this.closest("[data-component]")';
  return `
    const current = ${target}.style.getPropertyValue('--${property}');
    const newValue = current === '${value1}' ? '${value2}' : '${value1}';
    ${target}.style.setProperty('--${property}', newValue);
  `.trim();
};

/**
 * Pub/Sub State Manager Helpers
 * For complex business logic state sharing
 */

/**
 * Generate inline JavaScript to publish state to a topic
 * @param topic - Topic name for state updates
 * @param data - Data to publish (will be JSON stringified if object)
 */
// Untyped public function (stringly by design for runtime attributes)
export function publishState<TData>(topic: string, data: TData): string {
  const serializedData = typeof data === "string" ? data : JSON.stringify(data);
  return `window.funcwcState?.publish('${topic}', ${serializedData})`;
}

/**
 * Generate inline JavaScript to subscribe to state updates
 * @param topic - Topic name to subscribe to
 * @param handler - JavaScript code to execute when state updates (receives 'data' parameter)
 */
// Untyped public function (stringly by design for runtime attributes)
export function subscribeToState<TData>(
  topic: string,
  handler: string,
): string {
  return `window.funcwcState?.subscribe('${topic}', function(data) { ${handler} }, this)`;
}

/**
 * Generate inline JavaScript to get current state for a topic
 * @param topic - Topic name
 */
// Untyped public function (stringly by design for runtime attributes)
export function getState<TData = unknown>(topic: string): string {
  return `window.funcwcState?.getState('${topic}')`;
}

/**
 * DOM Event Communication Helpers
 * For component-to-component communication and UI interactions
 */

/**
 * Generate inline JavaScript to dispatch a custom event
 * @param eventName - Event name (will be prefixed with 'ui-lib:')
 * @param data - Event data payload (optional)
 * @param target - Where to dispatch the event ('self', 'parent', 'document')
 */
export function dispatchEvent<TData>(
  eventName: string,
  data?: TData,
  target: "self" | "parent" | "document" = "document",
): string {
  const targetElement = target === "self"
    ? "this"
    : target === "parent"
    ? "this.parentElement"
    : "document";

  const eventData = data ? `, { detail: ${JSON.stringify(data)} }` : "";

  return `${targetElement}.dispatchEvent(new CustomEvent('ui-lib:${eventName}'${eventData}))`;
}

/**
 * Build an hx-on aggregator string from a map of events → code
 * Example: hxOn({ 'htmx:load': 'init()', 'ui-lib:open': '...' })
 */
export const hxOn = (events: Record<string, string>): string => {
  return Object.entries(events)
    .map(([evt, code]) => `${evt.replace(/^ui-lib:/, "funcwc:")}: ${code}`)
    .join("\n");
};

/**
 * Generate a consolidated hx-on attribute from a map of events → code.
 * Example: on({ 'htmx:load': 'init()', 'ui-lib:open': '...' })
 * Returns: hx-on="htmx:load: init()\nfuncwc:open: ..."
 */
export const on = (events: Record<string, string>): string => {
  const body = hxOn(events).replace(/"/g, "&quot;");
  return `hx-on="${body}"`;
};

/**
 * Generate HTMX attribute for listening to custom events
 * @param eventName - Event name (will be prefixed with 'ui-lib:')
 * @param handler - JavaScript code to execute when event is received
 */
// Untyped public function (stringly by design for runtime attributes)
export function listensFor<TData = unknown>(
  eventName: string,
  handler: string,
): string {
  // Prefer consolidated hx-on attribute to avoid JSX parser issues with colons in names
  const safe = handler.replace(/"/g, "&quot;");
  return `hx-on="ui-lib:${eventName}: ${safe}"`;
}

/**
 * Utility Helpers
 */

/**
 * Generate inline JavaScript to find the closest component container
 * @param selector - Additional selector to match (optional)
 */
export const findClosestComponent = (selector?: string): string => {
  const baseSelector = "[data-component]";
  const fullSelector = selector ? `${baseSelector}${selector}` : baseSelector;
  return `this.closest('${fullSelector}')`;
};

/**
 * Generate inline JavaScript for conditional execution
 * @param condition - JavaScript condition to evaluate
 * @param trueAction - Code to execute if condition is true
 * @param falseAction - Code to execute if condition is false (optional)
 */
export const conditionalAction = (
  condition: string,
  trueAction: string,
  falseAction?: string,
): string => {
  const falseClause = falseAction ? ` else { ${falseAction} }` : "";
  return `if (${condition}) { ${trueAction} }${falseClause}`;
};

/**
 * Generate inline JavaScript to safely execute code with error handling
 * @param code - JavaScript code to execute
 * @param errorHandler - Code to execute on error (optional)
 */
export const safeExecute = (code: string, errorHandler?: string): string => {
  const errorClause = errorHandler
    ? ` catch (error) { ${errorHandler} }`
    : " catch (error) { console.warn('ui-lib reactive action failed:', error); }";
  return `try { ${code} }${errorClause}`;
};

/**
 * Debugging Helpers
 */

/**
 * Generate inline JavaScript to log reactive state for debugging
 * @param label - Label for the debug output
 * @param includeCSS - Include CSS custom properties in output
 * @param includeState - Include pub/sub state in output
 */
export const debugReactiveState = (
  label: string,
  includeCSS = true,
  includeState = true,
): string => {
  let code = `console.group('🔄 ui-lib Reactive Debug: ${label}');`;

  if (includeCSS) {
    code += `
      const styles = getComputedStyle(document.documentElement);
      const cssVars = {};
      for (let prop of document.documentElement.style) {
        if (prop.startsWith('--')) {
          cssVars[prop] = styles.getPropertyValue(prop);
        }
      }
      console.log('CSS Properties:', cssVars);
    `;
  }

  if (includeState) {
    code += `
      if (window.funcwcState) {
        console.log('State Manager:', Object.fromEntries(window.funcwcState._state));
        console.log('Active Subscriptions:', window.funcwcState._subscribers.size);
      }
    `;
  }

  code += `console.groupEnd();`;
  return code;
};

/**
 * Type Definitions for Better DX
 */
export type ReactiveScope = "global" | "component";
export type ReactiveEventTarget = "self" | "parent" | "document";

/**
 * Common Reactive Patterns
 * Pre-built combinations for common use cases
 */

/**
 * Theme toggle pattern using CSS properties
 * @param lightTheme - CSS properties for light theme
 * @param darkTheme - CSS properties for dark theme
 */
export const createThemeToggle = (
  lightTheme: Record<string, string>,
  darkTheme: Record<string, string>,
): string => {
  const getCurrentTheme = getCSSProperty("theme-mode");
  const isDark = `(${getCurrentTheme}) === 'dark'`;

  const toggleCode = conditionalAction(
    isDark,
    // Switch to light
    Object.entries(lightTheme)
      .map(([prop, value]) => setCSSProperty(prop, value))
      .join("; "),
    // Switch to dark
    Object.entries(darkTheme)
      .map(([prop, value]) => setCSSProperty(prop, value))
      .join("; "),
  );

  return toggleCode;
};

/**
 * Cart update pattern using state manager
 * @param action - 'add', 'remove', or 'update'
 * @param itemData - Item data for the action
 */
export const createCartAction = (
  action: "add" | "remove" | "update",
  itemData: string,
): string => {
  // Use a global function to avoid long inline JavaScript
  return `window.uiLibCartAction('${action}', ${itemData})`;
};

/**
 * Notification pattern using DOM events
 * @param message - Notification message
 * @param type - Notification type ('info', 'success', 'error', 'warning')
 * @param duration - Duration in milliseconds (optional)
 */
export const createNotification = (
  message: string,
  type: "info" | "success" | "error" | "warning" = "info",
  duration?: number,
): string => {
  const payload = { message, type, ...(duration && { duration }) };
  return dispatchEvent("show-notification", payload);
};

/**
 * Declarative Binding Helpers
 * For use with data-bind-* attributes
 */

/**
 * Generate text content binding
 * @param stateName - State topic to bind to
 */
export const bindText = (stateName: string): string =>
  `data-bind-text="${stateName}"`;

/**
 * Generate CSS class binding
 * @param stateName - State topic to bind to
 */
export const bindClass = (stateName: string): string =>
  `data-bind-class="${stateName}"`;

/**
 * Generate inline style property binding
 * @param property - CSS property name
 * @param stateName - State topic to bind to
 */
export const bindStyle = (property: string, stateName: string): string =>
  `data-bind-style="${property}:${stateName}"`;

/**
 * Generate two-way value binding for form inputs
 * @param stateName - State topic to bind to
 */
export const bindValue = (stateName: string): string =>
  `data-bind-value="${stateName}"`;

/**
 * Generate event emission on click
 * @param eventName - Event name to emit
 * @param eventValue - Optional event payload (JSON string)
 */
export const emitOn = (eventName: string, eventValue?: string): string => {
  const valueAttr = eventValue ? ` data-emit-value="${eventValue}"` : "";
  return `data-emit="${eventName}"${valueAttr}`;
};

/**
 * Generate event listener
 * @param eventName - Event name to listen for
 * @param handlerCode - JavaScript code to execute
 */
export const listenFor = (eventName: string, handlerCode: string): string =>
  `data-listen="${eventName}:${handlerCode}"`;

/**
 * Generate conditional display binding
 * @param stateName - State topic to bind to
 */
export const showIf = (stateName: string): string =>
  `data-show-if="${stateName}"`;

/**
 * Generate conditional hiding binding
 * @param stateName - State topic to bind to
 */
export const hideIf = (stateName: string): string =>
  `data-hide-if="${stateName}"`;

/**
 * Combine multiple declarative bindings
 * @param bindings - Array of binding strings
 */
export const combineBindings = (...bindings: string[]): string =>
  bindings.filter(Boolean).join(" ");

/**
 * Create a complete declarative element with bindings
 * @param tag - HTML tag name
 * @param bindings - Object with binding configurations
 * @param content - Inner content
 */
export const createBoundElement = (
  tag: string,
  bindings: {
    text?: string;
    class?: string;
    style?: { property: string; state: string };
    value?: string;
    emit?: { event: string; value?: string };
    listen?: { event: string; handler: string };
    showIf?: string;
    hideIf?: string;
    attrs?: Record<string, string>;
  },
  content?: string,
): string => {
  const bindingAttrs: string[] = [];

  if (bindings.text) bindingAttrs.push(bindText(bindings.text));
  if (bindings.class) bindingAttrs.push(bindClass(bindings.class));
  if (bindings.style) {
    bindingAttrs.push(bindStyle(bindings.style.property, bindings.style.state));
  }
  if (bindings.value) bindingAttrs.push(bindValue(bindings.value));
  if (bindings.emit) {
    bindingAttrs.push(emitOn(bindings.emit.event, bindings.emit.value));
  }
  if (bindings.listen) {
    bindingAttrs.push(
      listenFor(bindings.listen.event, bindings.listen.handler),
    );
  }
  if (bindings.showIf) bindingAttrs.push(showIf(bindings.showIf));
  if (bindings.hideIf) bindingAttrs.push(hideIf(bindings.hideIf));

  // Add regular attributes
  const regularAttrs = bindings.attrs
    ? Object.entries(bindings.attrs).map(([key, value]) => `${key}="${value}"`)
      .join(" ")
    : "";

  const allAttrs = [regularAttrs, ...bindingAttrs].filter(Boolean).join(" ");
  const attrs = allAttrs ? ` ${allAttrs}` : "";

  return content !== undefined
    ? `<${tag}${attrs}>${content}</${tag}>`
    : `<${tag}${attrs} />`;
};
