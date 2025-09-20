// DOM Effect Descriptions - Pure functional approach to DOM operations
// Instead of directly mutating the DOM, functions return descriptions of effects

import { Result, ok, err } from "./result.ts";

// DOM operation types as algebraic data type
export type DOMOperation =
  | { readonly type: "addClass"; readonly elementId: string; readonly className: string }
  | { readonly type: "removeClass"; readonly elementId: string; readonly className: string }
  | { readonly type: "setStyle"; readonly elementId: string; readonly property: string; readonly value: string }
  | { readonly type: "setAttribute"; readonly elementId: string; readonly name: string; readonly value: string }
  | { readonly type: "removeAttribute"; readonly elementId: string; readonly name: string }
  | { readonly type: "setDisplay"; readonly elementId: string; readonly display: string }
  | { readonly type: "appendChild"; readonly parentId: string; readonly child: Element }
  | { readonly type: "removeChild"; readonly parentId: string; readonly childId: string }
  | { readonly type: "innerHTML"; readonly elementId: string; readonly html: string }
  | { readonly type: "focus"; readonly elementId: string }
  | { readonly type: "blur"; readonly elementId: string }
  | { readonly type: "dispatchEvent"; readonly elementId: string; readonly event: Event }
  | { readonly type: "addEventListener"; readonly elementId: string; readonly event: string; readonly handler: EventListener }
  | { readonly type: "removeEventListener"; readonly elementId: string; readonly event: string; readonly handler: EventListener }
  | { readonly type: "createElement"; readonly tagName: string; readonly id: string; readonly attributes?: Record<string, string> }
  | { readonly type: "querySelector"; readonly selector: string; readonly callback: (element: Element | null) => DOMOperation[] }
  | { readonly type: "setTimeout"; readonly callback: () => DOMOperation[]; readonly delay: number };

// Effect batch for atomic operations
export type DOMEffectBatch = {
  readonly operations: readonly DOMOperation[];
  readonly rollback?: readonly DOMOperation[];
};

// Error types for DOM operations
export type DOMError =
  | { readonly type: "ElementNotFound"; readonly id: string }
  | { readonly type: "InvalidOperation"; readonly reason: string }
  | { readonly type: "ExecutionFailed"; readonly operation: DOMOperation; readonly error: unknown };

// Pure function to create effect descriptions
export const createDOMEffects = {
  addClass: (elementId: string, className: string): DOMOperation => ({
    type: "addClass",
    elementId,
    className,
  }),

  removeClass: (elementId: string, className: string): DOMOperation => ({
    type: "removeClass",
    elementId,
    className,
  }),

  setStyle: (elementId: string, property: string, value: string): DOMOperation => ({
    type: "setStyle",
    elementId,
    property,
    value,
  }),

  setDisplay: (elementId: string, display: string): DOMOperation => ({
    type: "setDisplay",
    elementId,
    display,
  }),

  dispatchEvent: (elementId: string, event: Event): DOMOperation => ({
    type: "dispatchEvent",
    elementId,
    event,
  }),

  focus: (elementId: string): DOMOperation => ({
    type: "focus",
    elementId,
  }),

  innerHTML: (elementId: string, html: string): DOMOperation => ({
    type: "innerHTML",
    elementId,
    html,
  }),

  setTimeout: (callback: () => DOMOperation[], delay: number): DOMOperation => ({
    type: "setTimeout",
    callback,
    delay,
  }),
};

// Execute a single DOM operation (impure - should be at application boundary)
export const executeDOMOperation = (op: DOMOperation): Result<void, DOMError> => {
  try {
    switch (op.type) {
      case "addClass": {
        const element = document.getElementById(op.elementId);
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.classList.add(op.className);
        return ok(undefined);
      }

      case "removeClass": {
        const element = document.getElementById(op.elementId);
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.classList.remove(op.className);
        return ok(undefined);
      }

      case "setStyle": {
        const element = document.getElementById(op.elementId) as HTMLElement;
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        (element.style as any)[op.property] = op.value;
        return ok(undefined);
      }

      case "setDisplay": {
        const element = document.getElementById(op.elementId) as HTMLElement;
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.style.display = op.display;
        return ok(undefined);
      }

      case "setAttribute": {
        const element = document.getElementById(op.elementId);
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.setAttribute(op.name, op.value);
        return ok(undefined);
      }

      case "removeAttribute": {
        const element = document.getElementById(op.elementId);
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.removeAttribute(op.name);
        return ok(undefined);
      }

      case "appendChild": {
        const parent = document.getElementById(op.parentId);
        if (!parent) return err({ type: "ElementNotFound", id: op.parentId });
        parent.appendChild(op.child);
        return ok(undefined);
      }

      case "removeChild": {
        const parent = document.getElementById(op.parentId);
        const child = document.getElementById(op.childId);
        if (!parent) return err({ type: "ElementNotFound", id: op.parentId });
        if (!child) return err({ type: "ElementNotFound", id: op.childId });
        if (child.parentNode === parent) {
          parent.removeChild(child);
        }
        return ok(undefined);
      }

      case "innerHTML": {
        const element = document.getElementById(op.elementId);
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.innerHTML = op.html;
        return ok(undefined);
      }

      case "focus": {
        const element = document.getElementById(op.elementId) as HTMLElement;
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.focus();
        return ok(undefined);
      }

      case "blur": {
        const element = document.getElementById(op.elementId) as HTMLElement;
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.blur();
        return ok(undefined);
      }

      case "dispatchEvent": {
        const element = document.getElementById(op.elementId);
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.dispatchEvent(op.event);
        return ok(undefined);
      }

      case "addEventListener": {
        const element = document.getElementById(op.elementId);
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.addEventListener(op.event, op.handler);
        return ok(undefined);
      }

      case "removeEventListener": {
        const element = document.getElementById(op.elementId);
        if (!element) return err({ type: "ElementNotFound", id: op.elementId });
        element.removeEventListener(op.event, op.handler);
        return ok(undefined);
      }

      case "createElement": {
        const element = document.createElement(op.tagName);
        element.id = op.id;
        if (op.attributes) {
          Object.entries(op.attributes).forEach(([name, value]) => {
            element.setAttribute(name, value);
          });
        }
        document.body.appendChild(element);
        return ok(undefined);
      }

      case "querySelector": {
        const element = document.querySelector(op.selector);
        const effects = op.callback(element);
        return executeDOMBatch(effects);
      }

      case "setTimeout": {
        setTimeout(() => {
          executeDOMBatch(op.callback());
        }, op.delay);
        return ok(undefined);
      }

      default:
        // @ts-expect-error: Exhaustiveness check
        const _exhaustive: never = op;
        return err({ type: "InvalidOperation", reason: "Unknown operation type" });
    }
  } catch (error) {
    return err({ type: "ExecutionFailed", operation: op, error });
  }
};

// Execute a batch of DOM operations
export const executeDOMBatch = (operations: readonly DOMOperation[]): Result<void, DOMError> => {
  for (const op of operations) {
    const result = executeDOMOperation(op);
    if (!result.ok) {
      return result;
    }
  }
  return ok(undefined);
};

// Helper to create a deferred effect (for animations/transitions)
export const deferredEffect = (
  operations: readonly DOMOperation[],
  delay: number
): DOMOperation => ({
  type: "setTimeout",
  callback: () => operations,
  delay,
});