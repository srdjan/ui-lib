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
 * Template compiler state type
 */
type TemplateCompilerState = {
  readonly templates: ReadonlyMap<string, CompiledTemplate>;
  readonly staticStrings: ReadonlySet<string>;
};

/**
 * Create default template compiler state
 */
const createDefaultTemplateCompilerState = (): TemplateCompilerState => ({
  templates: new Map(),
  staticStrings: new Set(),
});

/**
 * Pure template optimization functions
 */
const optimizeTemplate = (templateSource: string): CompiledTemplate => {
  // Simple template optimization - real implementation would parse JSX AST
  const staticParts: string[] = [];
  const dynamicSlots: number[] = [];
  const propUsage: string[] = [];

  // Mock optimization for demo
  const lines = templateSource.split("\n");
  let slotIndex = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes("props.")) {
      // Extract prop usage
      const propMatches = trimmed.match(/props\.(\w+)/g);
      if (propMatches) {
        propMatches.forEach((match) => {
          const propName = match.replace("props.", "");
          if (!propUsage.includes(propName)) {
            propUsage.push(propName);
          }
        });
        dynamicSlots.push(slotIndex++);
      }
    } else if (trimmed && !trimmed.startsWith("//")) {
      staticParts.push(trimmed);
    }
  }

  return {
    source: templateSource,
    compiled: templateSource, // In real implementation, this would be optimized
    staticParts,
    dynamicSlots,
    propUsage,
  };
};

const compileTemplate = (
  state: TemplateCompilerState,
  componentName: string,
  templateSource: string,
): { compiled: CompiledTemplate; newState: TemplateCompilerState } => {
  const existing = state.templates.get(componentName);
  if (existing && existing.source === templateSource) {
    return { compiled: existing, newState: state }; // Already compiled and unchanged
  }

  const compiled = optimizeTemplate(templateSource);

  const newTemplates = new Map(state.templates);
  newTemplates.set(componentName, compiled);

  const newStaticStrings = new Set(state.staticStrings);
  compiled.staticParts.forEach((part) => newStaticStrings.add(part));

  const newState = {
    templates: newTemplates,
    staticStrings: newStaticStrings,
  };

  return { compiled, newState };
};

const generateOptimizedRenderer = (compiled: CompiledTemplate): string => {
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
};

type CompilationStats = {
  readonly templatesCompiled: number;
  readonly staticStringsDeduped: number;
  readonly averageStaticRatio: number;
};

const getCompilationStats = (
  state: TemplateCompilerState,
): CompilationStats => {
  const templates = Array.from(state.templates.values());
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
    staticStringsDeduped: state.staticStrings.size,
    averageStaticRatio: totalParts > 0
      ? Math.round((totalParts / (totalParts + dynamicParts)) * 100)
      : 0,
  };
};

// Functional TemplateCompiler interface
export interface ITemplateCompiler {
  compileTemplate(
    componentName: string,
    templateSource: string,
  ): CompiledTemplate;
  generateOptimizedRenderer(compiled: CompiledTemplate): string;
  getCompilationStats(): CompilationStats;
  clearCache(): void;
}

// Functional TemplateCompiler implementation
export const createTemplateCompiler = (): ITemplateCompiler => {
  let state = createDefaultTemplateCompilerState();

  return {
    compileTemplate(
      componentName: string,
      templateSource: string,
    ): CompiledTemplate {
      const result = compileTemplate(state, componentName, templateSource);
      state = result.newState;
      return result.compiled;
    },

    generateOptimizedRenderer(compiled: CompiledTemplate): string {
      return generateOptimizedRenderer(compiled);
    },

    getCompilationStats(): CompilationStats {
      return getCompilationStats(state);
    },

    clearCache(): void {
      state = createDefaultTemplateCompilerState();
    },
  };
};

// Backward compatibility - TemplateCompiler class that uses functional implementation
export class TemplateCompiler {
  private compiler: ITemplateCompiler;

  constructor() {
    this.compiler = createTemplateCompiler();
  }

  compileTemplate(
    componentName: string,
    templateSource: string,
  ): CompiledTemplate {
    return this.compiler.compileTemplate(componentName, templateSource);
  }

  generateOptimizedRenderer(compiled: CompiledTemplate): string {
    return this.compiler.generateOptimizedRenderer(compiled);
  }

  getCompilationStats(): CompilationStats {
    return this.compiler.getCompilationStats();
  }

  clearCache(): void {
    this.compiler.clearCache();
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

/**
 * Prop parser optimizer state type
 */
type PropParserOptimizerState = {
  readonly propSpecs: ReadonlyMap<string, PropSpec>;
  readonly parseCache: ReadonlyMap<string, Record<string, unknown>>;
};

/**
 * Create default prop parser optimizer state
 */
const createDefaultPropParserOptimizerState = (): PropParserOptimizerState => ({
  propSpecs: new Map(),
  parseCache: new Map(),
});

/**
 * Pure prop parsing functions
 */
const generatePropsKey = (
  componentName: string,
  rawProps: Record<string, string>,
): string => {
  const sortedKeys = Object.keys(rawProps).sort();
  const keyParts = [componentName];
  for (const key of sortedKeys) {
    keyParts.push(`${key}:${rawProps[key]}`);
  }
  return keyParts.join("|");
};

const registerPropSpecs = (
  state: PropParserOptimizerState,
  componentName: string,
  specs: readonly PropSpec[],
): PropParserOptimizerState => {
  const newPropSpecs = new Map(state.propSpecs);

  for (const spec of specs) {
    newPropSpecs.set(`${componentName}.${spec.name}`, spec);
  }

  return {
    ...state,
    propSpecs: newPropSpecs,
  };
};

const parseProp = (spec: PropSpec, rawValue: string | undefined): unknown => {
  if (rawValue === undefined) {
    if (spec.required) {
      throw new Error(`Required prop '${spec.name}' is missing`);
    }
    return spec.defaultValue;
  }

  let parsed: unknown;

  switch (spec.type) {
    case "string":
      parsed = rawValue;
      break;
    case "number":
      parsed = parseFloat(rawValue);
      if (isNaN(parsed as number)) {
        parsed = spec.defaultValue ?? 0;
      }
      break;
    case "boolean":
      parsed = rawValue === "true" || rawValue === "" || rawValue === spec.name;
      break;
    case "array":
      try {
        parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) {
          parsed = spec.defaultValue ?? [];
        }
      } catch {
        parsed = spec.defaultValue ?? [];
      }
      break;
    case "object":
      try {
        parsed = JSON.parse(rawValue);
        if (typeof parsed !== "object" || parsed === null) {
          parsed = spec.defaultValue ?? {};
        }
      } catch {
        parsed = spec.defaultValue ?? {};
      }
      break;
    default:
      parsed = rawValue;
  }

  // Run validator if provided
  if (spec.validator && !spec.validator(parsed)) {
    parsed = spec.defaultValue;
  }

  return parsed;
};

const parseProps = (
  state: PropParserOptimizerState,
  componentName: string,
  rawProps: Record<string, string>,
): { parsed: Record<string, unknown>; newState: PropParserOptimizerState } => {
  const cacheKey = generatePropsKey(componentName, rawProps);
  const cached = state.parseCache.get(cacheKey);

  if (cached) {
    return { parsed: cached, newState: state }; // Cache hit
  }

  // Get component specs
  const componentSpecs = new Map<string, PropSpec>();
  for (const [key, spec] of state.propSpecs) {
    if (key.startsWith(`${componentName}.`)) {
      const propName = key.substring(componentName.length + 1);
      componentSpecs.set(propName, spec);
    }
  }

  // Initialize parsed props object
  const parsed: Record<string, unknown> = {};

  // Parse props efficiently based on specs
  for (const [propName, rawValue] of Object.entries(rawProps)) {
    const spec = componentSpecs.get(propName);

    if (spec) {
      parsed[propName] = parseProp(spec, rawValue);
    } else {
      // Fallback for unspecified props - simple inference
      parsed[propName] = inferAndParseProp(rawValue);
    }
  }

  // Add defaults for missing required props
  for (const [propName, spec] of componentSpecs) {
    if (!(propName in parsed) && spec.defaultValue !== undefined) {
      parsed[propName] = spec.defaultValue;
    }
  }

  // Cache result
  const newParseCache = new Map(state.parseCache);
  newParseCache.set(cacheKey, parsed);

  const newState = {
    ...state,
    parseCache: newParseCache,
  };

  return { parsed, newState };
};

const inferAndParseProp = (rawValue: string): unknown => {
  // Simple type inference
  if (rawValue === "true" || rawValue === "false") {
    return rawValue === "true";
  }

  const numValue = parseFloat(rawValue);
  if (!isNaN(numValue) && isFinite(numValue)) {
    return numValue;
  }

  if (rawValue.startsWith("[") || rawValue.startsWith("{")) {
    try {
      return JSON.parse(rawValue);
    } catch {
      return rawValue;
    }
  }

  return rawValue;
};

type ParsingStats = {
  readonly cacheHitRate: number;
  readonly averageParseTime: number;
  readonly totalParsedProps: number;
  readonly cachedEntries: number;
};

const getParsingStats = (state: PropParserOptimizerState): ParsingStats => {
  // Simplified stats - real implementation would track detailed metrics
  return {
    cacheHitRate: 85, // Mock value
    averageParseTime: 0.5, // Mock value in ms
    totalParsedProps: state.propSpecs.size,
    cachedEntries: state.parseCache.size,
  };
};

// Functional PropParserOptimizer interface
export interface IPropParserOptimizer {
  registerPropSpecs(componentName: string, specs: readonly PropSpec[]): void;
  parseProps(
    componentName: string,
    rawProps: Record<string, string>,
  ): Record<string, unknown>;
  getParsingStats(): ParsingStats;
  clearCache(): void;
}

// Functional PropParserOptimizer implementation
export const createPropParserOptimizer = (): IPropParserOptimizer => {
  let state = createDefaultPropParserOptimizerState();

  return {
    registerPropSpecs(componentName: string, specs: readonly PropSpec[]): void {
      state = registerPropSpecs(state, componentName, specs);
    },

    parseProps(
      componentName: string,
      rawProps: Record<string, string>,
    ): Record<string, unknown> {
      const result = parseProps(state, componentName, rawProps);
      state = result.newState;
      return result.parsed;
    },

    getParsingStats(): ParsingStats {
      return getParsingStats(state);
    },

    clearCache(): void {
      state = createDefaultPropParserOptimizerState();
    },
  };
};

// Backward compatibility - PropParserOptimizer class that uses functional implementation
export class PropParserOptimizer {
  private optimizer: IPropParserOptimizer;

  constructor() {
    this.optimizer = createPropParserOptimizer();
  }

  registerPropSpecs(componentName: string, specs: readonly PropSpec[]): void {
    this.optimizer.registerPropSpecs(componentName, specs);
  }

  parseProps(
    componentName: string,
    rawProps: Record<string, string>,
  ): Record<string, unknown> {
    return this.optimizer.parseProps(componentName, rawProps);
  }

  getParsingStats(): ParsingStats {
    return this.optimizer.getParsingStats();
  }

  clearCache(): void {
    this.optimizer.clearCache();
  }
}

/**
 * Render batch optimizer - Batches multiple render operations for better performance
 */
type RenderBatchOptimizerState = {
  readonly pendingRenders: ReadonlyMap<
    string,
    { component: string; props: Record<string, unknown> }
  >;
  readonly batchTimeout: number | null;
  readonly batchSize: number;
  readonly maxBatchDelay: number;
};

const createDefaultRenderBatchOptimizerState =
  (): RenderBatchOptimizerState => ({
    pendingRenders: new Map(),
    batchTimeout: null,
    batchSize: 10,
    maxBatchDelay: 16, // ~60fps
  });

// Functional RenderBatchOptimizer interface
export interface IRenderBatchOptimizer {
  scheduleRender(
    id: string,
    component: string,
    props: Record<string, unknown>,
  ): void;
  flushBatch(): string[];
  setBatchSize(size: number): void;
  setMaxBatchDelay(delay: number): void;
}

// Functional RenderBatchOptimizer implementation
export const createRenderBatchOptimizer = (): IRenderBatchOptimizer => {
  let state = createDefaultRenderBatchOptimizerState();

  return {
    scheduleRender(
      id: string,
      component: string,
      props: Record<string, unknown>,
    ): void {
      const newPendingRenders = new Map(state.pendingRenders);
      newPendingRenders.set(id, { component, props });

      state = {
        ...state,
        pendingRenders: newPendingRenders,
      };
    },

    flushBatch(): string[] {
      const renders = Array.from(state.pendingRenders.entries()).map((
        [id, { component, props }],
      ) => `${component}(${JSON.stringify(props)})`);

      state = {
        ...state,
        pendingRenders: new Map(),
        batchTimeout: null,
      };

      return renders;
    },

    setBatchSize(size: number): void {
      state = { ...state, batchSize: size };
    },

    setMaxBatchDelay(delay: number): void {
      state = { ...state, maxBatchDelay: delay };
    },
  };
};

// Backward compatibility - RenderBatchOptimizer class that uses functional implementation
export class RenderBatchOptimizer {
  private optimizer: IRenderBatchOptimizer;

  constructor() {
    this.optimizer = createRenderBatchOptimizer();
  }

  scheduleRender(
    componentName: string,
    props: Record<string, unknown>,
    renderFn: () => string,
    priority = 0,
  ): Promise<string> {
    this.optimizer.scheduleRender(
      `${componentName}-${Date.now()}`,
      componentName,
      props,
    );
    // Mock implementation - real version would integrate with render function
    return Promise.resolve(renderFn());
  }

  getBatchStats(): {
    pendingRenders: number;
    averageBatchSize: number;
    averageBatchTime: number;
  } {
    return {
      pendingRenders: 0, // Mock data
      averageBatchSize: 5,
      averageBatchTime: 2.5,
    };
  }

  configure(options: { batchDelay?: number }): void {
    if (options.batchDelay !== undefined) {
      this.optimizer.setMaxBatchDelay(options.batchDelay);
    }
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
