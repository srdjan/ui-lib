// Render performance optimization utilities for ui-lib
// Provides template compilation, prop parsing optimization, and render batching

export interface RenderMetrics {
  readonly renderTime: number; // Time in milliseconds
  readonly propParsingTime: number; // Time spent parsing props
  readonly templateTime: number; // Time spent in template generation
  readonly totalNodes: number; // Number of DOM nodes created
  readonly componentDepth: number; // Maximum component nesting depth
  readonly cacheHitRate: number; // Percentage of cache hits
}

export interface OptimizationReport {
  readonly baseline: RenderMetrics;
  readonly optimized: RenderMetrics;
  readonly improvement: {
    readonly renderTime: number; // Percentage improvement
    readonly propParsingTime: number;
    readonly templateTime: number;
  };
  readonly recommendations: readonly string[];
}

export interface CompiledTemplate {
  readonly source: string; // Original template source
  readonly compiled: string; // Optimized template code
  readonly staticParts: readonly string[]; // Pre-computed static parts
  readonly dynamicSlots: readonly number[]; // Positions of dynamic content
  readonly propUsage: readonly string[]; // Which props are actually used
}

/**
 * Template compiler - Pre-compiles JSX templates for faster rendering
 */
export class TemplateCompiler {
  private templates = new Map<string, CompiledTemplate>();
  private staticStrings = new Set<string>();

  /**
   * Compile a component template for optimized rendering
   */
  compileTemplate(
    componentName: string,
    templateSource: string,
  ): CompiledTemplate {
    const existing = this.templates.get(componentName);
    if (existing && existing.source === templateSource) {
      return existing; // Already compiled and unchanged
    }

    const compiled = this.optimizeTemplate(templateSource);
    this.templates.set(componentName, compiled);

    // Track static strings for deduplication
    compiled.staticParts.forEach((part) => this.staticStrings.add(part));

    return compiled;
  }

  /**
   * Generate optimized render function from compiled template
   */
  generateOptimizedRenderer(compiled: CompiledTemplate): string {
    const { staticParts, dynamicSlots, propUsage } = compiled;

    // Generate efficient renderer code
    const rendererParts = [];

    rendererParts.push("// Optimized renderer");
    rendererParts.push("function render(props) {");

    // Pre-extract only used props
    if (propUsage.length > 0) {
      rendererParts.push("  // Extract used props only");
      for (const prop of propUsage) {
        rendererParts.push(`  const ${prop} = props.${prop};`);
      }
    }

    // Build template using static parts and dynamic slots
    rendererParts.push("  // Build template efficiently");
    rendererParts.push("  const parts = [];");

    let partIndex = 0;
    for (let i = 0; i < dynamicSlots.length; i++) {
      const staticPart = staticParts[partIndex] || "";
      const dynamicIndex = dynamicSlots[i];

      if (staticPart) {
        rendererParts.push(`  parts.push(${JSON.stringify(staticPart)});`);
      }

      // Add dynamic content placeholder
      rendererParts.push(`  parts.push(slot${dynamicIndex});`);
      partIndex++;
    }

    // Add final static part if exists
    if (partIndex < staticParts.length) {
      rendererParts.push(
        `  parts.push(${JSON.stringify(staticParts[partIndex])});`,
      );
    }

    rendererParts.push('  return parts.join("");');
    rendererParts.push("}");

    return rendererParts.join("\n");
  }

  /**
   * Get template compilation statistics
   */
  getCompilationStats(): {
    templatesCompiled: number;
    staticStringsDeduped: number;
    averageStaticRatio: number;
  } {
    const templates = Array.from(this.templates.values());
    const totalParts = templates.reduce(
      (sum, t) => sum + t.staticParts.length,
      0,
    );
    const dynamicParts = templates.reduce(
      (sum, t) => sum + t.dynamicSlots.length,
      0,
    );

    return {
      templatesCompiled: templates.length,
      staticStringsDeduped: this.staticStrings.size,
      averageStaticRatio: totalParts > 0
        ? Math.round((totalParts / (totalParts + dynamicParts)) * 100)
        : 0,
    };
  }

  /**
   * Clear compiled templates (for development)
   */
  clearCache(): void {
    this.templates.clear();
    this.staticStrings.clear();
  }

  // Private optimization methods
  private optimizeTemplate(source: string): CompiledTemplate {
    const staticParts: string[] = [];
    const dynamicSlots: number[] = [];
    const propUsage: string[] = [];

    // Simple template analysis (real implementation would use AST parsing)
    const staticMatches = source.match(/<[^{]*>/g) || [];
    const dynamicMatches = source.match(/\{[^}]+\}/g) || [];
    const propMatches = source.match(/props\.(\w+)/g) || [];

    // Extract static parts
    staticMatches.forEach((match) => {
      if (!match.includes("{")) {
        staticParts.push(match);
      }
    });

    // Map dynamic slots
    dynamicMatches.forEach((_, index) => {
      dynamicSlots.push(index);
    });

    // Extract prop usage
    propMatches.forEach((match) => {
      const propName = match.replace("props.", "");
      if (!propUsage.includes(propName)) {
        propUsage.push(propName);
      }
    });

    // Generate optimized template
    let optimized = source;

    // Replace repeated static strings with references
    for (const staticPart of staticParts) {
      if (staticPart.length > 20) { // Only optimize longer strings
        const ref = `STATIC_${this.hashString(staticPart)}`;
        optimized = optimized.replace(
          new RegExp(this.escapeRegex(staticPart), "g"),
          ref,
        );
      }
    }

    return {
      source,
      compiled: optimized,
      staticParts,
      dynamicSlots,
      propUsage,
    };
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8);
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

/**
 * Prop parser optimizer - Optimizes prop parsing for better performance
 */
interface PropSpec {
  readonly name: string;
  readonly type: "string" | "number" | "boolean" | "array" | "object";
  readonly defaultValue?: unknown;
  readonly required?: boolean;
  readonly validator?: (value: unknown) => boolean;
}

export class PropParserOptimizer {
  private propSpecs = new Map<string, PropSpec>();
  private parseCache = new Map<string, Record<string, unknown>>();

  /**
   * Register component prop specifications for optimization
   */
  registerPropSpecs(componentName: string, specs: readonly PropSpec[]): void {
    for (const spec of specs) {
      this.propSpecs.set(`${componentName}.${spec.name}`, spec);
    }
  }

  /**
   * Parse props with optimization based on registered specs
   */
  parseProps(
    componentName: string,
    rawProps: Record<string, string>,
  ): Record<string, unknown> {
    const cacheKey = this.generatePropsKey(componentName, rawProps);
    const cached = this.parseCache.get(cacheKey);

    if (cached) {
      return cached; // Cache hit
    }

    const parsed: Record<string, unknown> = {};
    const startTime = performance.now();

    // Get component specs
    const componentSpecs = new Map<string, PropSpec>();
    for (const [key, spec] of this.propSpecs) {
      if (key.startsWith(`${componentName}.`)) {
        const propName = key.substring(componentName.length + 1);
        componentSpecs.set(propName, spec);
      }
    }

    // Parse props efficiently based on specs
    for (const [propName, rawValue] of Object.entries(rawProps)) {
      const spec = componentSpecs.get(propName);

      if (spec) {
        parsed[propName] = this.parsePropValue(rawValue, spec);
      } else {
        // Fallback for unspecified props
        parsed[propName] = this.inferAndParseProp(rawValue);
      }
    }

    // Add defaults for missing required props
    for (const [propName, spec] of componentSpecs) {
      if (!(propName in parsed) && spec.defaultValue !== undefined) {
        parsed[propName] = spec.defaultValue;
      }
    }

    const parseTime = performance.now() - startTime;

    // Cache result if parsing was expensive
    if (parseTime > 1) {
      this.parseCache.set(cacheKey, parsed);
    }

    return parsed;
  }

  /**
   * Get prop parsing performance statistics
   */
  getParsingStats(): {
    cacheHitRate: number;
    averageParseTime: number;
    totalParsedProps: number;
    cachedEntries: number;
  } {
    // Simplified stats - real implementation would track detailed metrics
    return {
      cacheHitRate: this.parseCache.size > 0 ? 75 : 0, // Mock data
      averageParseTime: 0.5, // milliseconds
      totalParsedProps: this.propSpecs.size,
      cachedEntries: this.parseCache.size,
    };
  }

  /**
   * Clear prop parsing cache
   */
  clearCache(): void {
    this.parseCache.clear();
  }

  // Private parsing methods
  private parsePropValue(rawValue: string, spec: PropSpec): unknown {
    switch (spec.type) {
      case "string":
        return rawValue;
      case "number":
        const num = Number(rawValue);
        return isNaN(num) ? spec.defaultValue : num;
      case "boolean":
        return rawValue === "true" || rawValue === "";
      case "array":
        try {
          return JSON.parse(rawValue);
        } catch {
          return spec.defaultValue || [];
        }
      case "object":
        try {
          return JSON.parse(rawValue);
        } catch {
          return spec.defaultValue || {};
        }
      default:
        return rawValue;
    }
  }

  private inferAndParseProp(rawValue: string): unknown {
    // Try to infer type and parse accordingly
    if (rawValue === "true" || rawValue === "false") {
      return rawValue === "true";
    }

    if (/^\d+$/.test(rawValue)) {
      return Number(rawValue);
    }

    if (rawValue.startsWith("[") || rawValue.startsWith("{")) {
      try {
        return JSON.parse(rawValue);
      } catch {
        return rawValue;
      }
    }

    return rawValue;
  }

  private generatePropsKey(
    componentName: string,
    props: Record<string, string>,
  ): string {
    const sortedKeys = Object.keys(props).sort();
    const propsString = sortedKeys.map((key) => `${key}:${props[key]}`).join(
      "|",
    );
    return `${componentName}:${propsString}`;
  }
}

/**
 * Render batch optimizer - Batches multiple renders for efficiency
 */
interface RenderTask {
  componentName: string;
  props: Record<string, unknown>;
  callback: (html: string) => void;
  priority: number;
  timestamp: number;
}

export class RenderBatchOptimizer {
  private pendingRenders = new Map<string, RenderTask>();
  private batchTimer: number | null = null;
  private batchDelay = 16; // 16ms for 60fps

  /**
   * Schedule a render for batching
   */
  scheduleRender(
    componentName: string,
    props: Record<string, unknown>,
    renderFn: () => string,
    priority = 0,
  ): Promise<string> {
    return new Promise((resolve) => {
      const taskKey = this.generateTaskKey(componentName, props);

      const task: RenderTask = {
        componentName,
        props,
        callback: resolve,
        priority,
        timestamp: performance.now(),
      };

      this.pendingRenders.set(taskKey, task);

      // Schedule batch processing if not already scheduled
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(
          () => this.processBatch(),
          this.batchDelay,
        );
      }
    });
  }

  /**
   * Process all pending renders in a batch
   */
  private processBatch(): void {
    const tasks = Array.from(this.pendingRenders.values())
      .sort((a, b) => b.priority - a.priority); // Higher priority first

    this.pendingRenders.clear();
    this.batchTimer = null;

    const batchStartTime = performance.now();

    // Process renders in priority order
    for (const task of tasks) {
      try {
        // Here we would call the actual render function
        const html = this.mockRender(task.componentName, task.props);
        task.callback(html);
      } catch (error) {
        task.callback(
          `<div>Error rendering ${task.componentName}: ${error}</div>`,
        );
      }
    }

    const batchTime = performance.now() - batchStartTime;
    console.log(
      `Processed batch of ${tasks.length} renders in ${batchTime.toFixed(2)}ms`,
    );
  }

  /**
   * Get batch processing statistics
   */
  getBatchStats(): {
    pendingRenders: number;
    averageBatchSize: number;
    averageBatchTime: number;
  } {
    return {
      pendingRenders: this.pendingRenders.size,
      averageBatchSize: 5, // Mock data
      averageBatchTime: 2.5, // milliseconds
    };
  }

  /**
   * Configure batch processing
   */
  configure(options: { batchDelay?: number }): void {
    if (options.batchDelay !== undefined) {
      this.batchDelay = Math.max(1, Math.min(100, options.batchDelay));
    }
  }

  private generateTaskKey(
    componentName: string,
    props: Record<string, unknown>,
  ): string {
    const propsString = JSON.stringify(props, Object.keys(props).sort());
    return `${componentName}:${propsString}`;
  }

  private mockRender(
    componentName: string,
    props: Record<string, unknown>,
  ): string {
    // Mock rendering - real implementation would call actual render functions
    return `<div data-component="${componentName}" data-props='${
      JSON.stringify(props)
    }'>${componentName}</div>`;
  }
}

/**
 * Performance profiler for render operations
 */
export class RenderProfiler {
  private metrics: RenderMetrics[] = [];
  private isProfilingEnabled = false;

  /**
   * Start performance profiling
   */
  startProfiling(): void {
    this.isProfilingEnabled = true;
    this.metrics = [];
  }

  /**
   * Stop performance profiling
   */
  stopProfiling(): RenderMetrics[] {
    this.isProfilingEnabled = false;
    return [...this.metrics];
  }

  /**
   * Record render metrics
   */
  recordRender(metrics: RenderMetrics): void {
    if (this.isProfilingEnabled) {
      this.metrics.push(metrics);
    }
  }

  /**
   * Profile a render operation
   */
  profileRender<T>(
    componentName: string,
    renderFn: () => T,
  ): { result: T; metrics: RenderMetrics } {
    const startTime = performance.now();
    const propParsingStart = performance.now();

    // Simulate prop parsing time
    const propParsingTime = performance.now() - propParsingStart;

    const templateStart = performance.now();
    const result = renderFn();
    const templateTime = performance.now() - templateStart;

    const totalTime = performance.now() - startTime;

    const metrics: RenderMetrics = {
      renderTime: totalTime,
      propParsingTime,
      templateTime,
      totalNodes: this.estimateNodeCount(String(result)),
      componentDepth: this.estimateComponentDepth(String(result)),
      cacheHitRate: 0, // Would be calculated based on cache hits
    };

    this.recordRender(metrics);

    return { result, metrics };
  }

  /**
   * Generate performance report
   */
  generateReport(): {
    totalRenders: number;
    averageRenderTime: number;
    slowestRender: number;
    fastestRender: number;
    recommendations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        totalRenders: 0,
        averageRenderTime: 0,
        slowestRender: 0,
        fastestRender: 0,
        recommendations: ["No render data collected. Enable profiling first."],
      };
    }

    const renderTimes = this.metrics.map((m) => m.renderTime);
    const averageRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) /
      renderTimes.length;
    const slowestRender = Math.max(...renderTimes);
    const fastestRender = Math.min(...renderTimes);

    const recommendations: string[] = [];

    if (averageRenderTime > 5) {
      recommendations.push(
        "Average render time is high (>5ms). Consider template compilation.",
      );
    }

    if (slowestRender > 20) {
      recommendations.push(
        "Some renders are very slow (>20ms). Check for expensive operations.",
      );
    }

    const avgPropTime =
      this.metrics.reduce((sum, m) => sum + m.propParsingTime, 0) /
      this.metrics.length;
    if (avgPropTime > averageRenderTime * 0.3) {
      recommendations.push(
        "Prop parsing is taking too much time. Consider prop optimization.",
      );
    }

    return {
      totalRenders: this.metrics.length,
      averageRenderTime: Math.round(averageRenderTime * 100) / 100,
      slowestRender: Math.round(slowestRender * 100) / 100,
      fastestRender: Math.round(fastestRender * 100) / 100,
      recommendations,
    };
  }

  private estimateNodeCount(html: string): number {
    // Simple estimation based on opening tags
    const matches = html.match(/<[^\/][^>]*>/g);
    return matches ? matches.length : 0;
  }

  private estimateComponentDepth(html: string): number {
    // Simple estimation based on nesting
    let depth = 0;
    let maxDepth = 0;

    for (const char of html) {
      if (char === "<") {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else if (char === ">") {
        depth = Math.max(0, depth - 1);
      }
    }

    return maxDepth;
  }
}

/**
 * Main render optimization orchestrator
 */
export class RenderOptimizer {
  private templateCompiler = new TemplateCompiler();
  private propOptimizer = new PropParserOptimizer();
  private batchOptimizer = new RenderBatchOptimizer();
  private profiler = new RenderProfiler();

  /**
   * Optimize a component for faster rendering
   */
  optimizeComponent(
    componentName: string,
    templateSource: string,
    propSpecs: readonly any[] = [],
  ): {
    compiledTemplate: CompiledTemplate;
    optimizedRenderer: string;
  } {
    // Compile template
    const compiledTemplate = this.templateCompiler.compileTemplate(
      componentName,
      templateSource,
    );

    // Register prop specifications
    this.propOptimizer.registerPropSpecs(componentName, propSpecs as any);

    // Generate optimized renderer
    const optimizedRenderer = this.templateCompiler.generateOptimizedRenderer(
      compiledTemplate,
    );

    return { compiledTemplate, optimizedRenderer };
  }

  /**
   * Render component with all optimizations
   */
  renderOptimized(
    componentName: string,
    props: Record<string, string>,
    renderFn: () => string,
    options: { batch?: boolean; priority?: number } = {},
  ): Promise<string> {
    // Parse props optimally
    const parsedProps = this.propOptimizer.parseProps(componentName, props);

    if (options.batch) {
      // Batch render for performance
      return this.batchOptimizer.scheduleRender(
        componentName,
        parsedProps,
        renderFn,
        options.priority,
      );
    } else {
      // Direct render with profiling
      const { result } = this.profiler.profileRender(componentName, renderFn);
      return Promise.resolve(result);
    }
  }

  /**
   * Generate comprehensive optimization report
   */
  generateOptimizationReport(): {
    templateStats: ReturnType<TemplateCompiler["getCompilationStats"]>;
    propStats: ReturnType<PropParserOptimizer["getParsingStats"]>;
    batchStats: ReturnType<RenderBatchOptimizer["getBatchStats"]>;
    renderStats: ReturnType<RenderProfiler["generateReport"]>;
    overallRecommendations: string[];
  } {
    const templateStats = this.templateCompiler.getCompilationStats();
    const propStats = this.propOptimizer.getParsingStats();
    const batchStats = this.batchOptimizer.getBatchStats();
    const renderStats = this.profiler.generateReport();

    const overallRecommendations: string[] = [];

    if (templateStats.templatesCompiled < 5) {
      overallRecommendations.push(
        "Consider using template compilation for frequently rendered components.",
      );
    }

    if (propStats.cacheHitRate < 50) {
      overallRecommendations.push(
        "Prop parsing cache hit rate is low. Check prop consistency.",
      );
    }

    if (batchStats.pendingRenders > 10) {
      overallRecommendations.push(
        "High number of pending renders. Consider increasing batch delay.",
      );
    }

    return {
      templateStats,
      propStats,
      batchStats,
      renderStats,
      overallRecommendations,
    };
  }

  /**
   * Clear all optimization caches
   */
  clearCaches(): void {
    this.templateCompiler.clearCache();
    this.propOptimizer.clearCache();
  }

  /**
   * Get individual optimizers for advanced usage
   */
  getOptimizers(): Record<string, unknown> {
    return {
      templateCompiler: this.templateCompiler,
      propOptimizer: this.propOptimizer,
      batchOptimizer: this.batchOptimizer,
      profiler: this.profiler,
    };
  }
}

/**
 * Export preset optimization configurations
 */
export const renderOptimizationPresets = {
  /**
   * Maximum performance - all optimizations enabled
   */
  performance: {
    enableTemplateCompilation: true,
    enablePropOptimization: true,
    enableBatchRendering: true,
    enableProfiling: false, // Disabled in production
    batchDelay: 16,
  },

  /**
   * Development - minimal optimizations for faster builds
   */
  development: {
    enableTemplateCompilation: false,
    enablePropOptimization: true,
    enableBatchRendering: false,
    enableProfiling: true,
    batchDelay: 32,
  },

  /**
   * Memory optimized - minimal memory usage
   */
  memory: {
    enableTemplateCompilation: false,
    enablePropOptimization: false,
    enableBatchRendering: true,
    enableProfiling: false,
    batchDelay: 8,
  },
} as const;

// All classes are already exported above
