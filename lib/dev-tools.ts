// Development tools and debugging utilities for ui-lib
// Provides component inspection, performance monitoring, and debugging aids

import { getRegistry } from "./registry.ts";

/**
 * Development mode configuration
 */
export interface DevConfig {
  enabled: boolean;
  componentInspection: boolean;
  performanceMonitoring: boolean;
  propValidation: boolean;
  accessibilityWarnings: boolean;
  renderTracking: boolean;
  verbose: boolean;
}

/**
 * Component render information for debugging
 */
export interface ComponentRenderInfo {
  name: string;
  renderTime: number;
  propsReceived: Record<string, unknown>;
  propsProcessed: Record<string, unknown>;
  cssGenerated: boolean;
  apiEndpoints: string[];
  htmlSize: number;
  renderCount: number;
  lastRendered: Date;
  warnings: string[];
}

/**
 * Dev tools state type
 */
type DevToolsState = {
  readonly config: DevConfig;
  readonly renderStats: ReadonlyMap<string, ComponentRenderInfo>;
  readonly renderHistory: readonly {
    readonly component: string;
    readonly timestamp: Date;
    readonly duration: number;
  }[];
};

/**
 * Default dev tools state
 */
const createDefaultDevToolsState = (): DevToolsState => ({
  config: {
    enabled: false,
    componentInspection: false,
    performanceMonitoring: false,
    propValidation: false,
    accessibilityWarnings: false,
    renderTracking: false,
    verbose: false,
  },
  renderStats: new Map(),
  renderHistory: [],
});

/**
 * Pure state update functions
 */
const updateConfig = (
  state: DevToolsState,
  configUpdate: Partial<DevConfig>,
): DevToolsState => ({
  ...state,
  config: { ...state.config, ...configUpdate },
});

const getConfig = (state: DevToolsState): DevConfig => ({ ...state.config });

const extractApiEndpoints = (html: string): string[] => {
  const endpoints: string[] = [];
  const hxAttributes = [
    "hx-get",
    "hx-post",
    "hx-put",
    "hx-patch",
    "hx-delete",
  ];

  hxAttributes.forEach((attr) => {
    const regex = new RegExp(`${attr}="([^"]+)"`, "g");
    let match;
    while ((match = regex.exec(html)) !== null) {
      endpoints.push(`${attr.replace("hx-", "").toUpperCase()} ${match[1]}`);
    }
  });

  return [...new Set(endpoints)];
};

const trackRender = (
  state: DevToolsState,
  componentName: string,
  renderTime: number,
  propsReceived: Record<string, unknown>,
  propsProcessed: Record<string, unknown>,
  htmlOutput: string,
  warnings: string[] = [],
): DevToolsState => {
  if (!state.config.enabled || !state.config.renderTracking) return state;

  const existing = state.renderStats.get(componentName);
  const info: ComponentRenderInfo = {
    name: componentName,
    renderTime,
    propsReceived: { ...propsReceived },
    propsProcessed: { ...propsProcessed },
    cssGenerated: htmlOutput.includes("<style>"),
    apiEndpoints: extractApiEndpoints(htmlOutput),
    htmlSize: htmlOutput.length,
    renderCount: (existing?.renderCount || 0) + 1,
    lastRendered: new Date(),
    warnings,
  };

  const newRenderStats = new Map(state.renderStats);
  newRenderStats.set(componentName, info);

  let newRenderHistory = state.renderHistory;
  if (state.config.performanceMonitoring) {
    const historyEntry = {
      component: componentName,
      timestamp: new Date(),
      duration: renderTime,
    };

    newRenderHistory = [...state.renderHistory, historyEntry];

    // Keep last 1000 renders
    if (newRenderHistory.length > 1000) {
      newRenderHistory = newRenderHistory.slice(-1000);
    }
  }

  // Side effects (logging) - kept separate from state updates
  if (state.config.verbose) {
    console.log(
      `🔧 [DevTools] Rendered ${componentName} in ${renderTime.toFixed(2)}ms`,
      info,
    );
  }

  if (warnings.length > 0 && state.config.verbose) {
    console.warn(`⚠️ [DevTools] Warnings for ${componentName}:`, warnings);
  }

  return {
    ...state,
    renderStats: newRenderStats,
    renderHistory: newRenderHistory,
  };
};

const getComponentStats = (
  state: DevToolsState,
  componentName?: string,
): ComponentRenderInfo[] => {
  if (componentName) {
    const stats = state.renderStats.get(componentName);
    return stats ? [stats] : [];
  }
  return Array.from(state.renderStats.values());
};

const getRenderHistory = (
  state: DevToolsState,
): readonly {
  readonly component: string;
  readonly timestamp: Date;
  readonly duration: number;
}[] => [...state.renderHistory];

const getPerformanceReport = (
  state: DevToolsState,
): {
  totalRenders: number;
  averageRenderTime: number;
  slowestComponent: { name: string; time: number } | null;
  fastestComponent: { name: string; time: number } | null;
  componentsWithWarnings: string[];
} => {
  const stats = Array.from(state.renderStats.values());
  const totalRenders = stats.reduce((sum, stat) => sum + stat.renderCount, 0);
  const averageRenderTime = stats.length > 0
    ? stats.reduce((sum, stat) => sum + stat.renderTime, 0) / stats.length
    : 0;

  let slowest: { name: string; time: number } | null = null;
  let fastest: { name: string; time: number } | null = null;
  const componentsWithWarnings: string[] = [];

  stats.forEach((stat) => {
    if (!slowest || stat.renderTime > slowest.time) {
      slowest = { name: stat.name, time: stat.renderTime };
    }
    if (!fastest || stat.renderTime < fastest.time) {
      fastest = { name: stat.name, time: stat.renderTime };
    }
    if (stat.warnings.length > 0) {
      componentsWithWarnings.push(stat.name);
    }
  });

  return {
    totalRenders,
    averageRenderTime,
    slowestComponent: slowest,
    fastestComponent: fastest,
    componentsWithWarnings,
  };
};

const clearStats = (state: DevToolsState): DevToolsState => ({
  ...state,
  renderStats: new Map(),
  renderHistory: [],
});

const injectDevToolsScript = (state: DevToolsState): void => {
  if (typeof document === "undefined") return;

  // Avoid double injection
  if (document.getElementById("ui-lib-devtools")) return;

  const script = document.createElement("script");
  script.id = "ui-lib-devtools";
  script.innerHTML = `
    window.__UI_LIB_DEVTOOLS__ = {
      getStats: () => (${
    JSON.stringify(Array.from(state.renderStats.entries()))
  }),
      getConfig: () => (${JSON.stringify(state.config)}),
      inspect: (componentName) => {
        const components = document.querySelectorAll(\`[data-component="\${componentName}"]\`);
        console.log(\`Found \${components.length} instances of \${componentName}\`, components);
        components.forEach((el, i) => {
          console.log(\`Instance \${i + 1}:\`, el);
          console.log('Props:', el.dataset);
          console.log('Computed styles:', getComputedStyle(el));
        });
      },
      highlight: (componentName) => {
        document.querySelectorAll('[data-ui-lib-highlight]').forEach(el => {
          el.removeAttribute('data-ui-lib-highlight');
          el.style.outline = '';
        });

        const components = document.querySelectorAll(\`[data-component="\${componentName}"]\`);
        components.forEach(el => {
          el.setAttribute('data-ui-lib-highlight', '');
          el.style.outline = '2px solid var(--danger)';
        });
      },
      clearHighlights: () => {
        document.querySelectorAll('[data-ui-lib-highlight]').forEach(el => {
          el.removeAttribute('data-ui-lib-highlight');
          el.style.outline = '';
        });
      }
    };

    console.log('🛠️ ui-lib DevTools loaded! Try:');
    console.log('  __UI_LIB_DEVTOOLS__.inspect("component-name")');
    console.log('  __UI_LIB_DEVTOOLS__.highlight("component-name")');
    console.log('  __UI_LIB_DEVTOOLS__.getStats()');
  `;

  document.head.appendChild(script);
};

// Functional DevTools interface
export interface IDevTools {
  configure(config: Partial<DevConfig>): void;
  getConfig(): DevConfig;
  trackRender(
    componentName: string,
    renderTime: number,
    propsReceived: Record<string, unknown>,
    propsProcessed: Record<string, unknown>,
    htmlOutput: string,
    warnings?: string[],
  ): void;
  getComponentStats(componentName?: string): ComponentRenderInfo[];
  getRenderHistory(): readonly {
    readonly component: string;
    readonly timestamp: Date;
    readonly duration: number;
  }[];
  getPerformanceReport(): {
    totalRenders: number;
    averageRenderTime: number;
    slowestComponent: { name: string; time: number } | null;
    fastestComponent: { name: string; time: number } | null;
    componentsWithWarnings: string[];
  };
  clearStats(): void;
}

// Functional DevTools implementation
export const createDevTools = (): IDevTools => {
  let state = createDefaultDevToolsState();

  return {
    configure(configUpdate: Partial<DevConfig>): void {
      state = updateConfig(state, configUpdate);

      if (state.config.enabled && typeof window !== "undefined") {
        injectDevToolsScript(state);
      }
    },

    getConfig(): DevConfig {
      return getConfig(state);
    },

    trackRender(
      componentName: string,
      renderTime: number,
      propsReceived: Record<string, unknown>,
      propsProcessed: Record<string, unknown>,
      htmlOutput: string,
      warnings: string[] = [],
    ): void {
      state = trackRender(
        state,
        componentName,
        renderTime,
        propsReceived,
        propsProcessed,
        htmlOutput,
        warnings,
      );
    },

    getComponentStats(componentName?: string): ComponentRenderInfo[] {
      return getComponentStats(state, componentName);
    },

    getRenderHistory(): readonly {
      readonly component: string;
      readonly timestamp: Date;
      readonly duration: number;
    }[] {
      return getRenderHistory(state);
    },

    getPerformanceReport(): {
      totalRenders: number;
      averageRenderTime: number;
      slowestComponent: { name: string; time: number } | null;
      fastestComponent: { name: string; time: number } | null;
      componentsWithWarnings: string[];
    } {
      return getPerformanceReport(state);
    },

    clearStats(): void {
      state = clearStats(state);
    },
  };
};

// Global dev tools instance using functional implementation
const devTools = createDevTools();

/**
 * Configure development tools
 */
export function configureDevTools(config: Partial<DevConfig>): void {
  devTools.configure(config);
}

/**
 * Get current dev tools configuration
 */
export function getDevConfig(): DevConfig {
  return devTools.getConfig();
}

/**
 * Track a component render for debugging
 */
export function trackComponentRender(
  componentName: string,
  renderTime: number,
  propsReceived: Record<string, unknown>,
  propsProcessed: Record<string, unknown>,
  htmlOutput: string,
  warnings: string[] = [],
): void {
  devTools.trackRender(
    componentName,
    renderTime,
    propsReceived,
    propsProcessed,
    htmlOutput,
    warnings,
  );
}

/**
 * Get component rendering statistics
 */
export function getComponentStats(
  componentName?: string,
): ComponentRenderInfo[] {
  return devTools.getComponentStats(componentName);
}

/**
 * Get performance report
 */
export function getPerformanceReport(): Record<string, unknown> {
  return devTools.getPerformanceReport();
}

/**
 * Clear all debugging statistics
 */
export function clearDevStats(): void {
  devTools.clearStats();
}

/**
 * Component inspector utilities
 */
export const componentInspector: {
  listComponents: () => string[];
  inspectComponent: (name: string) => {
    registered: boolean;
    hasStyles: boolean;
    hasApi: boolean;
    renderFunction: string;
    stats?: ComponentRenderInfo;
  } | null;
  findComponents: (
    criteria: { hasStyles?: boolean; hasApi?: boolean; namePattern?: string },
  ) => string[];
} = {
  /**
   * List all registered components
   */
  listComponents(): string[] {
    return Object.keys(getRegistry());
  },

  /**
   * Get detailed information about a component
   */
  inspectComponent(name: string): {
    registered: boolean;
    hasStyles: boolean;
    hasApi: boolean;
    renderFunction: string;
    stats?: ComponentRenderInfo;
  } | null {
    const registry = getRegistry();
    const component = registry[name];

    if (!component) {
      return null;
    }

    const stats = devTools.getComponentStats(name)[0];

    return {
      registered: true,
      hasStyles: Boolean(component.css),
      hasApi: Boolean(component.api),
      renderFunction: component.render.toString(),
      stats,
    };
  },

  /**
   * Find components by criteria
   */
  findComponents(criteria: {
    hasStyles?: boolean;
    hasApi?: boolean;
    namePattern?: string;
  }): string[] {
    const registry = getRegistry();
    return Object.keys(registry).filter((name) => {
      const component = registry[name];

      if (
        criteria.hasStyles !== undefined &&
        Boolean(component.css) !== criteria.hasStyles
      ) {
        return false;
      }

      if (
        criteria.hasApi !== undefined &&
        Boolean(component.api) !== criteria.hasApi
      ) {
        return false;
      }

      if (
        criteria.namePattern && !name.match(new RegExp(criteria.namePattern))
      ) {
        return false;
      }

      return true;
    });
  },
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor: {
  start: () => void;
  stop: () => void;
  getTimeline: () => { component: string; timestamp: Date; duration: number }[];
  findSlowComponents: (thresholdMs?: number) => ComponentRenderInfo[];
  getMemoryUsage: () => {
    registrySize: number;
    statsSize: number;
    historySize: number;
    totalComponents: number;
  };
} = {
  /**
   * Start monitoring component renders
   */
  start(): void {
    configureDevTools({
      enabled: true,
      performanceMonitoring: true,
      renderTracking: true,
    });
  },

  /**
   * Stop monitoring
   */
  stop(): void {
    configureDevTools({
      performanceMonitoring: false,
      renderTracking: false,
    });
  },

  /**
   * Get render timeline
   */
  getTimeline(): { component: string; timestamp: Date; duration: number }[] {
    return devTools.getRenderHistory();
  },

  /**
   * Find slow components (above threshold)
   */
  findSlowComponents(thresholdMs: number = 5): ComponentRenderInfo[] {
    return devTools.getComponentStats().filter((stat) =>
      stat.renderTime > thresholdMs
    );
  },

  /**
   * Get memory usage estimation
   */
  getMemoryUsage(): {
    registrySize: number;
    statsSize: number;
    historySize: number;
    totalComponents: number;
  } {
    const registry = getRegistry();
    const stats = devTools.getComponentStats();
    const history = devTools.getRenderHistory();

    return {
      registrySize: Object.keys(registry).length,
      statsSize: stats.length,
      historySize: history.length,
      totalComponents: Object.keys(registry).length,
    };
  },
};

/**
 * Prop validation utilities
 */
export const propValidator: Record<string, unknown> = {
  /**
   * Validate component props against expected types
   */
  validateProps(
    _componentName: string,
    props: Record<string, unknown>,
  ): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for common prop issues
    for (const [key, value] of Object.entries(props)) {
      // Check for undefined values
      if (value === undefined) {
        warnings.push(`Prop '${key}' is undefined`);
      }

      // Check for null values (might be intentional)
      if (value === null) {
        warnings.push(`Prop '${key}' is null`);
      }

      // Check for empty strings (might be intentional)
      if (value === "") {
        warnings.push(`Prop '${key}' is empty string`);
      }

      // Check for very long strings (potential data issues)
      if (typeof value === "string" && value.length > 1000) {
        warnings.push(
          `Prop '${key}' is very long (${value.length} characters)`,
        );
      }

      // Check for large objects
      if (typeof value === "object" && value !== null) {
        try {
          const jsonSize = JSON.stringify(value).length;
          if (jsonSize > 10000) {
            warnings.push(
              `Prop '${key}' is a large object (${jsonSize} characters when serialized)`,
            );
          }
        } catch {
          warnings.push(`Prop '${key}' contains non-serializable data`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  },

  /**
   * Check for missing required props
   */
  checkRequiredProps(
    _componentName: string,
    props: Record<string, unknown>,
    required: string[],
  ): string[] {
    const missing: string[] = [];

    for (const prop of required) {
      if (
        !(prop in props) || props[prop] === undefined || props[prop] === null
      ) {
        missing.push(prop);
      }
    }

    return missing;
  },
};

/**
 * Accessibility checker utilities
 */
export const a11yChecker: Record<string, unknown> = {
  /**
   * Check component HTML for accessibility issues
   */
  checkAccessibility(html: string, componentName: string): {
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for missing alt text on images
    if (html.includes("<img") && !html.match(/<img[^>]+alt=/)) {
      errors.push("Images without alt attributes detected");
    }

    // Check for form labels
    const inputs = html.match(/<input[^>]*>/g) || [];
    inputs.forEach((input) => {
      const id = input.match(/id="([^"]+)"/)?.[1];
      if (id && !html.includes(`for="${id}"`)) {
        warnings.push(`Input with id="${id}" has no associated label`);
      }
    });

    // Check for heading hierarchy
    const headings = html.match(/<h[1-6][^>]*>/g) || [];
    if (headings.length > 1) {
      suggestions.push("Consider heading hierarchy (h1 → h2 → h3, etc.)");
    }

    // Check for button accessibility
    if (html.includes("<button") && !html.match(/aria-label|aria-labelledby/)) {
      const buttons = html.match(/<button[^>]*>([^<]*)<\/button>/g) || [];
      buttons.forEach((button) => {
        const text = button.replace(/<[^>]*>/g, "").trim();
        if (!text) {
          warnings.push("Button without text content or aria-label detected");
        }
      });
    }

    // Check for ARIA attributes
    if (html.includes("role=")) {
      suggestions.push("Good use of ARIA roles detected");
    }

    // Check for semantic HTML
    const semanticElements = [
      "main",
      "nav",
      "header",
      "footer",
      "section",
      "article",
      "aside",
    ];
    const hasSemanticElements = semanticElements.some((element) =>
      html.includes(`<${element}`)
    );

    if (!hasSemanticElements && html.includes("<div")) {
      suggestions.push(
        "Consider using semantic HTML elements (nav, main, section, etc.)",
      );
    }

    return { errors, warnings, suggestions };
  },
};

/**
 * Development mode helpers
 */
export const devHelpers: Record<string, unknown> = {
  /**
   * Enable full development mode
   */
  enableDevMode(verbose: boolean = false): void {
    configureDevTools({
      enabled: true,
      componentInspection: true,
      performanceMonitoring: true,
      propValidation: true,
      accessibilityWarnings: true,
      renderTracking: true,
      verbose,
    });

    console.log("🛠️ ui-lib Development mode enabled");
    if (verbose) {
      console.log("📊 Verbose logging is ON");
    }
  },

  /**
   * Disable development mode
   */
  disableDevMode(): void {
    configureDevTools({
      enabled: false,
      componentInspection: false,
      performanceMonitoring: false,
      propValidation: false,
      accessibilityWarnings: false,
      renderTracking: false,
      verbose: false,
    });

    console.log("🛠️ ui-lib Development mode disabled");
  },

  /**
   * Generate development report
   */
  generateReport(): {
    config: DevConfig;
    performance: ReturnType<typeof getPerformanceReport>;
    components: string[];
    memory: ReturnType<typeof performanceMonitor.getMemoryUsage>;
    timestamp: Date;
  } {
    return {
      config: getDevConfig(),
      performance: getPerformanceReport(),
      components: componentInspector.listComponents(),
      memory: performanceMonitor.getMemoryUsage(),
      timestamp: new Date(),
    };
  },
};

/**
 * Error boundary and debugging utilities
 */
export const errorHandler = {
  /**
   * Wrap component render with error handling
   */
  safeRender<T>(
    _componentName: string,
    renderFn: () => T,
    fallback?: (error: Error) => T,
  ): T {
    try {
      const startTime = performance.now();
      const result = renderFn();
      const renderTime = performance.now() - startTime;

      if (devTools.getConfig().renderTracking) {
        trackComponentRender(
          _componentName,
          renderTime,
          {},
          {},
          String(result),
        );
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.error(`❌ Error rendering component ${_componentName}:`, error);

      if (devTools.getConfig().renderTracking) {
        trackComponentRender(_componentName, 0, {}, {}, "", [
          `Render error: ${errorMessage}`,
        ]);
      }

      if (fallback) {
        return fallback(
          error instanceof Error ? error : new Error(String(error)),
        );
      }

      // Default fallback
      return `<!-- Error rendering ${_componentName}: ${errorMessage} -->` as T;
    }
  },
};

// Export the main dev tools instance for advanced usage
export { devTools as __devToolsInstance };
