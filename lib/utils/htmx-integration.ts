import { hxVals as buildHxVals } from "../dom-helpers.ts";

// HTMX Integration Utilities - Enhanced HTMX helper functions
// Extracted from showcase HTMX usage patterns

/**
 * HTMX request options
 */
export interface HTMXRequestOptions {
  readonly method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  readonly target?: string;
  readonly swap?:
    | "innerHTML"
    | "outerHTML"
    | "beforebegin"
    | "afterbegin"
    | "beforeend"
    | "afterend";
  readonly trigger?: string;
  readonly headers?: Record<string, string>;
  readonly values?: Record<string, unknown>;
}

/**
 * HTMX utility class
 */
export class HTMXUtil {
  /**
   * Check if HTMX is loaded
   */
  static isLoaded(): boolean {
    return typeof window !== "undefined" && "htmx" in window;
  }

  /**
   * Make an HTMX AJAX request
   */
  static ajax(url: string, options: HTMXRequestOptions = {}): void {
    if (!this.isLoaded()) {
      console.warn("HTMX not loaded, cannot make AJAX request");
      return;
    }

    const {
      method = "GET",
      target,
      swap = "innerHTML",
      headers,
      values,
    } = options;

    (window as any).htmx.ajax(method, url, {
      target,
      swap,
      headers,
      values,
    });
  }

  /**
   * Process new content with HTMX
   */
  static process(element: Element | string): void {
    if (!this.isLoaded()) return;

    const el = typeof element === "string"
      ? document.querySelector(element)
      : element;

    if (el) {
      (window as any).htmx.process(el);
    }
  }

  /**
   * Trigger HTMX event on element
   */
  static trigger(element: Element | string, eventName: string): void {
    if (!this.isLoaded()) return;

    const el = typeof element === "string"
      ? document.querySelector(element)
      : element;

    if (el) {
      (window as any).htmx.trigger(el, eventName);
    }
  }

  /**
   * Remove HTMX from element
   */
  static remove(element: Element | string): void {
    if (!this.isLoaded()) return;

    const el = typeof element === "string"
      ? document.querySelector(element)
      : element;

    if (el) {
      (window as any).htmx.remove(el);
    }
  }

  /**
   * Get HTMX config
   */
  static getConfig(): any {
    if (!this.isLoaded()) return {};
    return (window as any).htmx.config;
  }

  /**
   * Set HTMX config
   */
  static setConfig(config: Record<string, unknown>): void {
    if (!this.isLoaded()) return;
    Object.assign((window as any).htmx.config, config);
  }
}

/**
 * HTMX attribute builders
 */
export const htmx = {
  /**
   * Build hx-get attribute
   */
  get: (url: string, options: Partial<HTMXRequestOptions> = {}): string => {
    let attrs = `hx-get="${url}"`;

    if (options.target) attrs += ` hx-target="${options.target}"`;
    if (options.swap) attrs += ` hx-swap="${options.swap}"`;
    if (options.trigger) attrs += ` hx-trigger="${options.trigger}"`;

    return attrs;
  },

  /**
   * Build hx-post attribute
   */
  post: (url: string, options: Partial<HTMXRequestOptions> = {}): string => {
    let attrs = `hx-post="${url}"`;

    if (options.target) attrs += ` hx-target="${options.target}"`;
    if (options.swap) attrs += ` hx-swap="${options.swap}"`;
    if (options.trigger) attrs += ` hx-trigger="${options.trigger}"`;

    return attrs;
  },

  /**
   * Build hx-put attribute
   */
  put: (url: string, options: Partial<HTMXRequestOptions> = {}): string => {
    let attrs = `hx-put="${url}"`;

    if (options.target) attrs += ` hx-target="${options.target}"`;
    if (options.swap) attrs += ` hx-swap="${options.swap}"`;
    if (options.trigger) attrs += ` hx-trigger="${options.trigger}"`;

    return attrs;
  },

  /**
   * Build hx-delete attribute
   */
  delete: (url: string, options: Partial<HTMXRequestOptions> = {}): string => {
    let attrs = `hx-delete="${url}"`;

    if (options.target) attrs += ` hx-target="${options.target}"`;
    if (options.swap) attrs += ` hx-swap="${options.swap}"`;
    if (options.trigger) attrs += ` hx-trigger="${options.trigger}"`;

    return attrs;
  },

  /**
   * Build hx-trigger attribute
   */
  trigger: (trigger: string): string => `hx-trigger="${trigger}"`,

  /**
   * Build hx-target attribute
   */
  target: (target: string): string => `hx-target="${target}"`,

  /**
   * Build hx-swap attribute
   */
  swap: (swap: HTMXRequestOptions["swap"]): string => `hx-swap="${swap}"`,

  /**
   * Build hx-vals attribute
   */
  vals: (values: Record<string, unknown>): string => buildHxVals(values),

  /**
   * Build hx-headers attribute
   */
  headers: (headers: Record<string, string>): string => {
    const encoded = JSON.stringify(headers).replace(/"/g, "&quot;");
    return `hx-headers='${encoded}'`;
  },

  /**
   * Build hx-ext attribute
   */
  ext: (extensions: string[]): string => `hx-ext="${extensions.join(",")}"`,
};

/**
 * Common HTMX patterns
 */
export const htmxPatterns = {
  /**
   * Load content on page load
   */
  loadOnLoad: (url: string, target: string): string => {
    return htmx.get(url, { target, trigger: "load" });
  },

  /**
   * Load content when element becomes visible
   */
  loadOnVisible: (url: string, target: string): string => {
    return htmx.get(url, { target, trigger: "intersect" });
  },

  /**
   * Infinite scroll pattern
   */
  infiniteScroll: (url: string, target: string): string => {
    return htmx.get(url, {
      target,
      swap: "beforeend",
      trigger: "intersect",
    });
  },

  /**
   * Auto-refresh pattern
   */
  autoRefresh: (url: string, target: string, interval: string): string => {
    return htmx.get(url, { target, trigger: `every ${interval}` });
  },

  /**
   * Search with debounce
   */
  searchWithDebounce: (
    url: string,
    target: string,
    delay = "300ms",
  ): string => {
    return htmx.get(url, {
      target,
      trigger: `keyup changed delay:${delay}, search`,
    });
  },
};

/**
 * Generate JavaScript code for HTMX utilities
 */
export const createHTMXScript = (): string => {
  return `
// ui-lib HTMX Integration - Enhanced HTMX helper functions
window.uiLibHTMX = {
  // Check if HTMX is loaded
  isLoaded() {
    return typeof htmx !== 'undefined';
  },

  // Make HTMX AJAX request
  ajax(url, options = {}) {
    if (!this.isLoaded()) {
      console.warn('HTMX not loaded, cannot make AJAX request');
      return;
    }

    const {
      method = 'GET',
      target,
      swap = 'innerHTML',
      headers,
      values
    } = options;

    htmx.ajax(method, url, {
      target,
      swap,
      headers,
      values
    });
  },

  // Process element with HTMX
  process(element) {
    if (!this.isLoaded()) return;

    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
      htmx.process(el);
    }
  },

  // Trigger HTMX event
  trigger(element, eventName) {
    if (!this.isLoaded()) return;

    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
      htmx.trigger(el, eventName);
    }
  },

  // Common patterns
  patterns: {
    // Load content on page load
    loadOnLoad(url, target) {
      const element = document.querySelector(target);
      if (!element) return;

      element.setAttribute('hx-get', url);
      element.setAttribute('hx-trigger', 'load');
      element.setAttribute('hx-target', target);

      if (window.uiLibHTMX.isLoaded()) {
        htmx.process(element);
      }
    },

    // Load content when visible
    loadOnVisible(url, target) {
      const element = document.querySelector(target);
      if (!element) return;

      element.setAttribute('hx-get', url);
      element.setAttribute('hx-trigger', 'intersect');
      element.setAttribute('hx-target', target);

      if (window.uiLibHTMX.isLoaded()) {
        htmx.process(element);
      }
    },

    // Auto-refresh content
    autoRefresh(url, target, interval) {
      const element = document.querySelector(target);
      if (!element) return;

      element.setAttribute('hx-get', url);
      element.setAttribute('hx-trigger', \`every \${interval}\`);
      element.setAttribute('hx-target', target);

      if (window.uiLibHTMX.isLoaded()) {
        htmx.process(element);
      }
    }
  }
};

// Global convenience functions
window.htmxAjax = window.uiLibHTMX.ajax;
window.htmxProcess = window.uiLibHTMX.process;
`.trim();
};
