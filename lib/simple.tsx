// Simplified ui-lib Core - JSX components without registry complexity
// Direct imports, simple JSX functions, minimal overhead

import { escape } from "./escape.ts";
import { normalizeClass, normalizeStyle } from "./jsx-normalize.ts";

/**
 * Minimal JSX runtime for server-side rendering
 * Converts JSX directly to HTML strings without virtual DOM or hydration
 */

const SELF_CLOSING_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export { escape };

// Fragment for JSX
export function Fragment({ children }: { children?: unknown[] }): string {
  return Array.isArray(children) ? children.join("") : String(children || "");
}

// Simple JSX factory function
export function h(
  tag: string | ((props: any) => string),
  props: Record<string, any> | null,
  ...children: unknown[]
): string {
  props = props || {};

  // Handle function components (direct JSX components)
  if (typeof tag === "function") {
    return tag({ ...props, children });
  }

  // Handle HTML elements
  let attributes = "";

  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || value == null || value === false) continue;

    if (key === "class" || key === "className") {
      const className = normalizeClass(value);
      if (className) {
        attributes += ` class="${escape(className)}"`;
      }
    } else if (key === "style") {
      const style = normalizeStyle(value);
      if (style) {
        attributes += ` style="${escape(style)}"`;
      }
    } else if (key === "htmlFor") {
      attributes += ` for="${escape(String(value))}"`;
    } else if (key === "dangerouslySetInnerHTML" && value?.__html) {
      // Handle raw HTML
      continue;
    } else if (typeof value === "boolean" && value) {
      attributes += ` ${key}`;
    } else {
      attributes += ` ${key}="${escape(String(value))}"`;
    }
  }

  const openTag = `<${tag}${attributes}>`;

  if (SELF_CLOSING_TAGS.has(tag)) {
    return openTag.replace(">", " />");
  }

  // Handle dangerouslySetInnerHTML
  if (props.dangerouslySetInnerHTML?.__html) {
    return `${openTag}${props.dangerouslySetInnerHTML.__html}</${tag}>`;
  }

  // Process children (preserve already-rendered HTML strings)
  const childrenHtml = children
    .flat(Infinity)
    .filter((child) => child != null && typeof child !== "boolean")
    .map((child) => {
      if (typeof child === "number") return String(child);
      if (typeof child === "string") {
        // Detect if the string looks like already-rendered HTML
        const tagMatch = child.match(/^<([a-zA-Z][a-zA-Z0-9-]*)/);
        const tagName = tagMatch ? tagMatch[1] : "";
        const looksLikeHtml = child.startsWith("<") && child.endsWith(">");
        const isSelfClosing = /^<[a-zA-Z][^>]*\/>$/.test(child);
        const isKnownSelfClosing = SELF_CLOSING_TAGS.has(tagName) &&
          /^<[a-zA-Z][^>]*>$/.test(child);
        const isNormalElement = /^<[a-zA-Z][^>]*>[\s\S]*<\/[a-zA-Z][^>]*>$/
          .test(
            child,
          );
        const isScriptTag = /^<script\b[^>]*>[\s\S]*<\/script>$/.test(child);

        if (
          looksLikeHtml &&
          (isSelfClosing || isKnownSelfClosing || isNormalElement ||
            isScriptTag)
        ) {
          return child; // Already-rendered HTML (including explicit <script> tags)
        }
        return escape(child); // Plain text content
      }
      return String(child); // Assume already processed JSX
    })
    .join("");

  return `${openTag}${childrenHtml}</${tag}>`;
}

/**
 * Simple CSS helper for inline styles in JSX components
 * Returns a <style> tag with the CSS
 */
export function css(styles: string): JSX.Element {
  return <style>{styles}</style>;
}

/**
 * Render any JSX component to HTML string
 */
export function renderToString(jsx: JSX.Element): string {
  return String(jsx);
}

/**
 * Simple state management using DOM attributes and events
 * Much simpler than the complex pub/sub system
 */
export const state = {
  /**
   * Set state value in DOM
   */
  set(key: string, value: any): void {
    if (typeof document === "undefined") return;

    // Store in document root for SSR consistency
    document.documentElement.setAttribute(
      `data-state-${key}`,
      JSON.stringify(value),
    );

    // Dispatch custom event for reactive updates
    document.dispatchEvent(
      new CustomEvent(`state:${key}`, {
        detail: { value },
      }),
    );
  },

  /**
   * Get state value from DOM
   */
  get(key: string): any {
    if (typeof document === "undefined") return undefined;

    const attr = document.documentElement.getAttribute(`data-state-${key}`);
    if (attr === null) return undefined;

    try {
      return JSON.parse(attr);
    } catch {
      return attr;
    }
  },

  /**
   * Subscribe to state changes
   */
  subscribe(key: string, callback: (value: any) => void): () => void {
    if (typeof document === "undefined") return () => {};

    const handler = (event: CustomEvent) => callback(event.detail.value);
    document.addEventListener(`state:${key}`, handler as EventListener);

    // Return unsubscribe function
    return () =>
      document.removeEventListener(`state:${key}`, handler as EventListener);
  },

  /**
   * Bind form input to state (two-way binding)
   */
  bindInput(input: HTMLInputElement, key: string): void {
    // Set initial value
    const initialValue = this.get(key);
    if (initialValue !== undefined) {
      input.value = String(initialValue);
    }

    // Listen for state changes
    const unsubscribe = this.subscribe(key, (value) => {
      if (input.value !== String(value)) {
        input.value = String(value);
      }
    });

    // Listen for input changes
    const updateState = () => {
      this.set(key, input.value);
    };

    input.addEventListener("input", updateState);
    input.addEventListener("change", updateState);

    // Cleanup on element removal (if MutationObserver is available)
    if (typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (
              node === input ||
              (node instanceof Element && node.contains(input))
            ) {
              unsubscribe();
              input.removeEventListener("input", updateState);
              input.removeEventListener("change", updateState);
              observer.disconnect();
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  },
};

/**
 * Initialize state bindings for elements with data-bind attributes
 */
export function initStateBindings(root: Element = document.body): void {
  if (typeof document === "undefined") return;

  // Bind inputs with data-bind attribute
  root.querySelectorAll<HTMLInputElement>("input[data-bind]").forEach(
    (input) => {
      const key = input.getAttribute("data-bind");
      if (key) {
        state.bindInput(input, key);
      }
    },
  );

  // Update text elements with data-text-bind attribute
  root.querySelectorAll("[data-text-bind]").forEach((element) => {
    const key = element.getAttribute("data-text-bind");
    if (key) {
      const unsubscribe = state.subscribe(key, (value) => {
        element.textContent = String(value);
      });

      // Set initial value
      const initialValue = state.get(key);
      if (initialValue !== undefined) {
        element.textContent = String(initialValue);
      }
    }
  });
}

// Auto-initialize on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initStateBindings());
  } else {
    initStateBindings();
  }
}

// Export for external use
export { h as jsx, h as jsxs };
