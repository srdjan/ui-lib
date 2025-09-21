// Declarative bindings processor for ui-lib
// Transforms data-bind-* attributes into reactive HTMX patterns at SSR time

import {
  listensFor,
  publishState,
  subscribeToState,
} from "./reactive-helpers.ts";

/**
 * Process declarative bindings in HTML markup
 * Transforms data-bind-* attributes into working reactive patterns
 */
export function processDeclarativeBindings(
  html: string,
  componentName: string,
): string {
  let processedHtml = html;

  // Track if we need to inject binding initialization
  let needsBindingInit = false;

  // Process data-bind-text: bind text content to state
  processedHtml = processedHtml.replace(
    /\s+data-bind-text="([^"]+)"/g,
    (match, stateName) => {
      needsBindingInit = true;
      const bindingId = generateBindingId(componentName, stateName, "text");
      return ` data-binding-id="${bindingId}" data-state-topic="${stateName}"` +
        ` hx-on="htmx:load: ${
          subscribeToState(stateName, `this.textContent = data`)
        }"`;
    },
  );

  // Process data-bind-class: bind CSS class to state
  processedHtml = processedHtml.replace(
    /\s+data-bind-class="([^"]+)"/g,
    (match, stateName) => {
      needsBindingInit = true;
      const bindingId = generateBindingId(componentName, stateName, "class");
      return ` data-binding-id="${bindingId}" data-state-topic="${stateName}"` +
        ` hx-on="htmx:load: ${
          subscribeToState(stateName, `this.className = data`)
        }"`;
    },
  );

  // Process data-bind-style: bind inline style property to state
  processedHtml = processedHtml.replace(
    /\s+data-bind-style="([^:]+):([^"]+)"/g,
    (match, property, stateName) => {
      needsBindingInit = true;
      const bindingId = generateBindingId(componentName, stateName, "style");
      return ` data-binding-id="${bindingId}" data-state-topic="${stateName}"` +
        ` hx-on="htmx:load: ${
          subscribeToState(stateName, `this.style.${property} = data`)
        }"`;
    },
  );

  // Process data-bind-value: two-way binding for form inputs
  processedHtml = processedHtml.replace(
    /\s+data-bind-value="([^"]+)"/g,
    (match, stateName) => {
      needsBindingInit = true;
      const bindingId = generateBindingId(componentName, stateName, "value");
      return ` data-binding-id="${bindingId}" data-state-topic="${stateName}"` +
        ` data-bind-value-target="${stateName}"` +
        ` hx-on="htmx:load: window.uiLibBindings?.initValueBinding(this, '${stateName}')"`;
    },
  );

  // Process data-emit: emit events on click
  processedHtml = processedHtml.replace(
    /\s+data-emit="([^"]+)"(?:\s+data-emit-value="([^"]+)")?/g,
    (match, eventName, eventValue = "{}") => {
      const bindingId = generateBindingId(componentName, eventName, "emit");
      return ` data-binding-id="${bindingId}"` +
        ` onclick="document.dispatchEvent(new CustomEvent('ui-lib:${eventName}', { detail: ${eventValue}, bubbles: true }))"`;
    },
  );

  // Process data-listen: listen for custom events
  processedHtml = processedHtml.replace(
    /\s+data-listen="([^:]+):([^"]+)"/g,
    (match, eventName, handlerCode) => {
      const bindingId = generateBindingId(componentName, eventName, "listen");
      const safeHandler = handlerCode.replace(/"/g, "&quot;");
      return ` data-binding-id="${bindingId}"` +
        ` ${listensFor(eventName, safeHandler)}`;
    },
  );

  // Process data-show-if: conditional display using CSS
  processedHtml = processedHtml.replace(
    /\s+data-show-if="([^"]+)"/g,
    (match, stateName) => {
      needsBindingInit = true;
      const bindingId = generateBindingId(componentName, stateName, "show");
      return ` data-binding-id="${bindingId}" data-state-topic="${stateName}"` +
        ` hx-on="htmx:load: ${
          subscribeToState(stateName, `this.style.display = data ? '' : 'none'`)
        }"`;
    },
  );

  // Process data-hide-if: conditional hiding using CSS
  processedHtml = processedHtml.replace(
    /\s+data-hide-if="([^"]+)"/g,
    (match, stateName) => {
      needsBindingInit = true;
      const bindingId = generateBindingId(componentName, stateName, "hide");
      return ` data-binding-id="${bindingId}" data-state-topic="${stateName}"` +
        ` hx-on="htmx:load: ${
          subscribeToState(stateName, `this.style.display = data ? 'none' : ''`)
        }"`;
    },
  );

  return processedHtml;
}

/**
 * Check if HTML contains declarative bindings
 */
export function hasDeclarativeBindings(html: string): boolean {
  return /data-bind-|data-emit|data-listen|data-show-if|data-hide-if/.test(
    html,
  );
}

/**
 * Generate unique binding ID for debugging and tracking
 */
function generateBindingId(
  componentName: string,
  target: string,
  type: string,
): string {
  const hash = simpleHash(`${componentName}-${target}-${type}`);
  return `bind-${componentName}-${type}-${hash}`;
}

/**
 * Simple hash function for generating binding IDs
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Extract all binding information from processed HTML for debugging
 */
export function extractBindingInfo(html: string): Array<{
  id: string;
  type: string;
  target: string;
  element: string;
}> {
  const bindings: Array<{
    id: string;
    type: string;
    target: string;
    element: string;
  }> = [];

  // Extract binding IDs and their context
  const bindingRegex =
    /data-binding-id="([^"]+)"(?:[^>]*data-state-topic="([^"]+)")?[^>]*>/g;
  let match;

  while ((match = bindingRegex.exec(html)) !== null) {
    const [fullMatch, id, target] = match;
    const typeMatch = id.match(/bind-[^-]+-([^-]+)-/);
    const type = typeMatch ? typeMatch[1] : "unknown";

    bindings.push({
      id,
      type,
      target: target || "",
      element: fullMatch,
    });
  }

  return bindings;
}

/**
 * Validate binding syntax and return warnings
 */
export function validateBindings(html: string): string[] {
  const warnings: string[] = [];

  // Check for malformed data-bind-style
  const malformedStyleBindings = html.match(/data-bind-style="[^:]*"/g);
  if (malformedStyleBindings) {
    warnings.push('data-bind-style requires format "property:stateName"');
  }

  // Check for malformed data-listen
  const malformedListenBindings = html.match(/data-listen="[^:]*"/g);
  if (malformedListenBindings) {
    warnings.push('data-listen requires format "eventName:handlerCode"');
  }

  // Check for empty binding targets
  const emptyBindings = html.match(/data-bind-[^=]*=""/g);
  if (emptyBindings) {
    warnings.push("Empty binding targets are not allowed");
  }

  return warnings;
}
