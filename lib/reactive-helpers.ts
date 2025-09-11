// Reactive helper functions for ui-lib components
// Supports three types of reactivity: CSS properties, Pub/Sub state, and DOM events

// Global type augmentation hooks – users can declare their app-wide topics and events:
// declare global { namespace UIlib { interface Topics { cart: CartState } interface Events { 'show-notification': { message: string } } } }
declare global {
  namespace UIlib {
    // Map of pub/sub topic → payload type (augment in app code)
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Topics {}
    // Map of custom event name → payload type (augment in app code)
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Events {}
  }
}

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
export function publishState(topic: string, data: unknown): string {
  const serializedData = typeof data === "string" ? data : JSON.stringify(data);
  return `window.funcwcState?.publish('${topic}', ${serializedData})`;
}
// Typed facade – compile-time only, delegates to publishState
export function typedPublishState<K extends keyof UIlib.Topics & string>(
  topic: K,
  data: UIlib.Topics[K],
): string {
  return publishState(topic as string, data as unknown);
}

/**
 * Generate inline JavaScript to subscribe to state updates
 * @param topic - Topic name to subscribe to
 * @param handler - JavaScript code to execute when state updates (receives 'data' parameter)
 */
// Untyped public function (stringly by design for runtime attributes)
export function subscribeToState(topic: string, handler: string): string {
  return `window.funcwcState?.subscribe('${topic}', function(data) { ${handler} }, this)`;
}
// Typed facade – compile-time only, delegates to subscribeToState
export function typedSubscribeToState<K extends keyof UIlib.Topics & string>(
  topic: K,
  handler: string,
): string {
  return subscribeToState(topic as string, handler);
}

/**
 * Generate inline JavaScript to get current state for a topic
 * @param topic - Topic name
 */
// Untyped public function (stringly by design for runtime attributes)
export function getState(topic: string): string {
  return `window.funcwcState?.getState('${topic}')`;
}

// Typed facade – compile-time only, delegates to getState
export function typedGetState<K extends keyof UIlib.Topics & string>(topic: K): string {
  return getState(topic as string);
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
export function dispatchEvent(
  eventName: string,
  data?: unknown,
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

// Typed facade – compile-time only, delegates to dispatchEvent
export function typedDispatchEvent<E extends keyof UIlib.Events & string>(
  eventName: E,
  data?: UIlib.Events[E],
  target: "self" | "parent" | "document" = "document",
): string {
  return dispatchEvent(eventName as string, data as unknown, target);
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
export function listensFor(eventName: string, handler: string): string {
  // Prefer consolidated hx-on attribute to avoid JSX parser issues with colons in names
  const safe = handler.replace(/"/g, "&quot;");
  return `hx-on="ui-lib:${eventName}: ${safe}"`;
}

// Typed facade – compile-time only, delegates to listensFor
export function typedListensFor<E extends keyof UIlib.Events & string>(
  eventName: E,
  handler: string,
): string {
  return listensFor(eventName as string, handler);
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
