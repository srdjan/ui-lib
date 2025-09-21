// Bundle size optimization utilities for ui-lib
// Provides tree shaking, code splitting, and minimal runtime generation

export interface BundleAnalysis {
  readonly totalSize: number; // Total bundle size in bytes
  readonly gzippedSize: number; // Gzipped size in bytes
  readonly modules: readonly ModuleInfo[];
  readonly unusedExports: readonly string[];
  readonly duplicateCode: readonly DuplicateInfo[];
  readonly recommendations: readonly string[];
}

export interface ModuleInfo {
  readonly path: string;
  readonly size: number;
  readonly gzippedSize: number;
  readonly exports: readonly string[];
  readonly imports: readonly string[];
  readonly usageCount: number;
  readonly isTreeShakable: boolean;
}

export interface DuplicateInfo {
  readonly code: string;
  readonly locations: readonly string[];
  readonly size: number;
  readonly savings: number; // Potential savings by deduplication
}

export interface OptimizationConfig {
  readonly minifyCode: boolean;
  readonly eliminateDeadCode: boolean;
  readonly enableTreeShaking: boolean;
  readonly splitChunks: boolean;
  readonly generateSourceMaps: boolean;
  readonly targetES: "ES2018" | "ES2020" | "ES2022" | "ESNext";
  readonly compressionLevel: 1 | 2 | 3 | 4 | 5; // 1 = fastest, 5 = smallest
}

/**
 * Minimal runtime state type
 */
type MinimalRuntimeState = {
  readonly usedFeatures: ReadonlySet<string>;
  readonly componentRegistry: ReadonlyMap<string, string>;
  readonly cssRegistry: ReadonlySet<string>;
};

/**
 * Create default minimal runtime state
 */
const createDefaultMinimalRuntimeState = (): MinimalRuntimeState => ({
  usedFeatures: new Set(),
  componentRegistry: new Map(),
  cssRegistry: new Set(),
});

/**
 * Pure state update functions
 */
const registerComponent = (
  state: MinimalRuntimeState,
  name: string,
  features: readonly string[],
): MinimalRuntimeState => {
  const newUsedFeatures = new Set(state.usedFeatures);
  features.forEach((feature) => newUsedFeatures.add(feature));

  const newComponentRegistry = new Map(state.componentRegistry);
  newComponentRegistry.set(name, name);

  return {
    ...state,
    usedFeatures: newUsedFeatures,
    componentRegistry: newComponentRegistry,
  };
};

const registerCSS = (
  state: MinimalRuntimeState,
  css: string,
): MinimalRuntimeState => {
  const newCssRegistry = new Set(state.cssRegistry);
  newCssRegistry.add(css);

  return {
    ...state,
    cssRegistry: newCssRegistry,
  };
};

/**
 * Pure runtime generation functions
 */
const generateElementCreator = (): string => {
  return `
// Core element creation
function createElement(tag, props, ...children) {
  const element = document.createElement(tag);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  children.flat().forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  });

  return element;
}`.trim();
};

const generateJSXRuntime = (): string => {
  return `
// JSX Runtime (jsx)
function h(tag, props, ...children) { return createElement(tag, props, ...children); }
const jsx = h; // jsx entry for tooling/tests
const jsxs = h; // multi-children helper alias
const Fragment = ({ children }) => children;`.trim();
};

const generatePropHelpers = (): string => {
  return `
// Prop helpers
const string = (value, defaultValue = '') => value || defaultValue;
const number = (value, defaultValue = 0) => parseInt(value) || defaultValue;
const boolean = (value) => value !== undefined;
const array = (value, defaultValue = []) => {
  try { return JSON.parse(value) || defaultValue; }
  catch { return defaultValue; }
};`.trim();
};

const generateStyleSystem = (): string => {
  return `
// Style system
function injectStyles(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}`.trim();
};

const generateEventSystem = (): string => {
  return `
// Event system
function on(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}`.trim();
};

const generateReactiveSystem = (): string => {
  return `
// Reactive system
const state = new Map();
const subscribers = new Map();

function reactive(key, initialValue) {
  if (!state.has(key)) {
    state.set(key, initialValue);
    subscribers.set(key, new Set());
  }
  return {
    get: () => state.get(key),
    set: (value) => {
      state.set(key, value);
      subscribers.get(key).forEach(fn => fn(value));
    },
    subscribe: (fn) => {
      subscribers.get(key).add(fn);
      return () => subscribers.get(key).delete(fn);
    }
  };
}`.trim();
};

const generateComponentRegistry = (
  componentRegistry: ReadonlyMap<string, string>,
): string => {
  const components = Array.from(componentRegistry.keys()).map((name) =>
    `'${name}': true`
  ).join(", ");
  return `
// Component registry
const components = { ${components} };
function isRegistered(name) { return components[name] || false; }`.trim();
};

const wrapRuntime = (runtimeCode: string): string => {
  return `
(function() {
  'use strict';

  ${runtimeCode}

  // Export to global scope
  if (typeof window !== 'undefined') {
    window.uiLib = { createElement, h, jsx, jsxs, Fragment, string, number, boolean, array };
  }
})();`.trim();
};

const generateRuntime = (state: MinimalRuntimeState): string => {
  const runtimeParts: string[] = [];

  // Core element creation (always needed)
  runtimeParts.push(generateElementCreator());

  // Add only used features
  if (state.usedFeatures.has("jsx")) {
    runtimeParts.push(generateJSXRuntime());
  }

  if (state.usedFeatures.has("props")) {
    runtimeParts.push(generatePropHelpers());
  }

  if (state.usedFeatures.has("styles")) {
    runtimeParts.push(generateStyleSystem());
  }

  if (state.usedFeatures.has("events")) {
    runtimeParts.push(generateEventSystem());
  }

  if (state.usedFeatures.has("reactive")) {
    runtimeParts.push(generateReactiveSystem());
  }

  // Component registry (only if components are used)
  if (state.componentRegistry.size > 0) {
    runtimeParts.push(generateComponentRegistry(state.componentRegistry));
  }

  return wrapRuntime(runtimeParts.join("\n\n"));
};

const generateComponentCode = (componentName: string): string => {
  // Placeholder for component code generation
  return `// Component: ${componentName}`;
};

const generateTreeShakenBundle = (
  state: MinimalRuntimeState,
  usedComponents: readonly string[],
): string => {
  const bundle: string[] = [];

  // Add minimal runtime
  bundle.push(generateRuntime(state));

  // Add only used components
  for (const componentName of usedComponents) {
    if (state.componentRegistry.has(componentName)) {
      bundle.push(generateComponentCode(componentName));
    }
  }

  // Add used CSS
  const usedCSS = Array.from(state.cssRegistry).join("\n");
  if (usedCSS) {
    bundle.push(
      `// Styles\nconst styles = \`${usedCSS}\`;\nif (typeof document !== 'undefined') { const style = document.createElement('style'); style.textContent = styles; document.head.appendChild(style); }`,
    );
  }

  return bundle.join("\n\n");
};

type BundleSizeEstimate = {
  readonly uncompressed: number;
  readonly gzippedEstimate: number;
  readonly breakdown: Record<string, number>;
};

const getBundleSizeEstimate = (
  state: MinimalRuntimeState,
  usedComponents: readonly string[] = [],
): BundleSizeEstimate => {
  const parts = {
    runtime: generateRuntime(state),
    components: usedComponents.map((name) => generateComponentCode(name)).join(
      "\n",
    ),
    styles: Array.from(state.cssRegistry).join("\n"),
  };

  const breakdown: Record<string, number> = {};
  let totalSize = 0;

  for (const [name, code] of Object.entries(parts)) {
    const size = new TextEncoder().encode(code).length;
    breakdown[name] = size;
    totalSize += size;
  }

  // Rough gzip estimate (typically 70-80% compression for JS)
  const gzippedEstimate = Math.round(totalSize * 0.3);

  return {
    uncompressed: totalSize,
    gzippedEstimate,
    breakdown,
  };
};

// Functional MinimalRuntime interface
export interface IMinimalRuntime {
  registerComponent(name: string, features: readonly string[]): void;
  registerCSS(css: string): void;
  generateRuntime(): string;
  generateTreeShakenBundle(usedComponents: readonly string[]): string;
  getBundleSizeEstimate(usedComponents?: readonly string[]): BundleSizeEstimate;
}

// Functional MinimalRuntime implementation
export const createMinimalRuntime = (): IMinimalRuntime => {
  let state = createDefaultMinimalRuntimeState();

  return {
    registerComponent(name: string, features: readonly string[]): void {
      state = registerComponent(state, name, features);
    },

    registerCSS(css: string): void {
      state = registerCSS(state, css);
    },

    generateRuntime(): string {
      return generateRuntime(state);
    },

    generateTreeShakenBundle(usedComponents: readonly string[]): string {
      return generateTreeShakenBundle(state, usedComponents);
    },

    getBundleSizeEstimate(
      usedComponents: readonly string[] = [],
    ): BundleSizeEstimate {
      return getBundleSizeEstimate(state, usedComponents);
    },
  };
};

// Backward compatibility - MinimalRuntime class that uses functional implementation
export class MinimalRuntime {
  private runtime: IMinimalRuntime;

  constructor() {
    this.runtime = createMinimalRuntime();
  }

  registerComponent(name: string, features: readonly string[]): void {
    this.runtime.registerComponent(name, features);
  }

  registerCSS(css: string): void {
    this.runtime.registerCSS(css);
  }

  generateRuntime(): string {
    return this.runtime.generateRuntime();
  }

  generateTreeShakenBundle(usedComponents: readonly string[]): string {
    return this.runtime.generateTreeShakenBundle(usedComponents);
  }

  getBundleSizeEstimate(
    usedComponents: readonly string[] = [],
  ): BundleSizeEstimate {
    return this.runtime.getBundleSizeEstimate(usedComponents);
  }
}

/**
 * Pure bundle analysis functions
 */
const estimateGzipSize = (code: string): number => {
  // Simple estimation - real implementation would use actual compression
  // Text typically compresses to 25-35% of original size
  const baseCompression = 0.3;
  const repetitiveCodeBonus = countRepetitivePatterns(code) * 0.05;
  const finalRatio = Math.max(0.15, baseCompression - repetitiveCodeBonus);
  return Math.round(code.length * finalRatio);
};

const countRepetitivePatterns = (code: string): number => {
  const lines = code.split("\n");
  const lineCounts = new Map<string, number>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 20) {
      lineCounts.set(trimmed, (lineCounts.get(trimmed) || 0) + 1);
    }
  }

  let repetitiveLines = 0;
  for (const count of lineCounts.values()) {
    if (count > 1) repetitiveLines += count - 1;
  }

  return Math.min(repetitiveLines / lines.length, 0.5); // Cap at 50%
};

const extractModules = (bundleCode: string): ModuleInfo[] => {
  // Simplified module extraction - real implementation would parse AST
  const modules: ModuleInfo[] = [];

  // Mock modules for demo
  modules.push({
    path: "lib/jsx-runtime.ts",
    size: bundleCode.includes("jsx") ? 800 : 0,
    gzippedSize: bundleCode.includes("jsx") ? 240 : 0,
    exports: ["h", "jsx", "jsxs"],
    imports: [],
    usageCount: bundleCode.includes("jsx") ? 5 : 0,
    isTreeShakable: true,
  });

  modules.push({
    path: "lib/prop-helpers.ts",
    size: bundleCode.includes("string(") ? 600 : 0,
    gzippedSize: bundleCode.includes("string(") ? 180 : 0,
    exports: ["string", "number", "boolean", "array", "object"],
    imports: [],
    usageCount: bundleCode.includes("string(") ? 10 : 0,
    isTreeShakable: true,
  });

  return modules.filter((m) => m.size > 0);
};

const findUnusedExports = (
  bundleCode: string,
  modules: ModuleInfo[],
): string[] => {
  const unusedExports: string[] = [];

  for (const module of modules) {
    for (const exportName of module.exports) {
      if (!bundleCode.includes(exportName)) {
        unusedExports.push(`${module.path}:${exportName}`);
      }
    }
  }

  return unusedExports;
};

const findDuplicateCode = (bundleCode: string): DuplicateInfo[] => {
  const duplicates: DuplicateInfo[] = [];
  const lines = bundleCode.split("\n");
  const lineCounts = new Map<string, string[]>();

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed && trimmed.length > 30) { // Only check substantial lines
      if (!lineCounts.has(trimmed)) {
        lineCounts.set(trimmed, []);
      }
      lineCounts.get(trimmed)!.push(`Line ${index + 1}`);
    }
  });

  for (const [code, locations] of lineCounts) {
    if (locations.length > 1) {
      duplicates.push({
        code: code.substring(0, 100) + (code.length > 100 ? "..." : ""),
        locations,
        size: code.length * locations.length,
        savings: code.length * (locations.length - 1),
      });
    }
  }

  return duplicates.sort((a, b) => b.savings - a.savings);
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const generateRecommendations = (
  modules: ModuleInfo[],
  unusedExports: string[],
  duplicates: DuplicateInfo[],
  totalSize: number,
): string[] => {
  const recommendations: string[] = [];

  // Size-based recommendations
  if (totalSize > 100000) { // >100KB
    recommendations.push(
      "Bundle is large (>100KB). Consider code splitting or lazy loading.",
    );
  }

  // Unused exports
  if (unusedExports.length > 0) {
    recommendations.push(
      `Remove ${unusedExports.length} unused exports to reduce bundle size.`,
    );
  }

  // Duplicate code
  if (duplicates.length > 0) {
    const totalSavings = duplicates.reduce(
      (sum, dup) => sum + dup.savings,
      0,
    );
    recommendations.push(
      `Remove duplicate code to save ${formatBytes(totalSavings)}.`,
    );
  }

  // Non-tree-shakable modules
  const nonTreeShakable = modules.filter((m) => !m.isTreeShakable);
  if (nonTreeShakable.length > 0) {
    recommendations.push(
      `${nonTreeShakable.length} modules are not tree-shakable. Consider refactoring.`,
    );
  }

  // Large modules
  const largeModules = modules.filter((m) => m.size > totalSize * 0.2);
  if (largeModules.length > 0) {
    recommendations.push(
      `Large modules detected: ${
        largeModules.map((m) => m.path).join(", ")
      }. Consider splitting.`,
    );
  }

  return recommendations;
};

const analyzeBundle = (bundleCode: string): BundleAnalysis => {
  const totalSize = new TextEncoder().encode(bundleCode).length;
  const gzippedSize = estimateGzipSize(bundleCode);

  const modules = extractModules(bundleCode);
  const unusedExports = findUnusedExports(bundleCode, modules);
  const duplicateCode = findDuplicateCode(bundleCode);
  const recommendations = generateRecommendations(
    modules,
    unusedExports,
    duplicateCode,
    totalSize,
  );

  return {
    totalSize,
    gzippedSize,
    modules,
    unusedExports,
    duplicateCode,
    recommendations,
  };
};

const generateSizeReport = (analysis: BundleAnalysis): string => {
  const { totalSize, gzippedSize, modules, recommendations } = analysis;

  const report = [];
  report.push("# Bundle Size Report");
  report.push("");
  report.push(`**Total Size:** ${formatBytes(totalSize)}`);
  report.push(`**Gzipped Size:** ${formatBytes(gzippedSize)}`);
  report.push(
    `**Compression Ratio:** ${
      ((1 - gzippedSize / totalSize) * 100).toFixed(1)
    }%`,
  );
  report.push("");

  // Module breakdown
  report.push("## Module Breakdown");
  const sortedModules = [...modules].sort((a, b) => b.size - a.size);
  for (const module of sortedModules.slice(0, 10)) {
    const percentage = ((module.size / totalSize) * 100).toFixed(1);
    report.push(
      `- **${module.path}**: ${formatBytes(module.size)} (${percentage}%)`,
    );
  }
  report.push("");

  // Recommendations
  if (recommendations.length > 0) {
    report.push("## Optimization Recommendations");
    recommendations.forEach((rec, i) => {
      report.push(`${i + 1}. ${rec}`);
    });
    report.push("");
  }

  return report.join("\n");
};

const findLargestModules = (
  analysis: BundleAnalysis,
  limit = 5,
): ModuleInfo[] => {
  return [...analysis.modules]
    .sort((a, b) => b.size - a.size)
    .slice(0, limit);
};

type PotentialSavings = {
  readonly deadCodeElimination: number;
  readonly duplicateCodeRemoval: number;
  readonly treeShakenUnusedExports: number;
  readonly totalPotentialSavings: number;
};

const calculatePotentialSavings = (
  analysis: BundleAnalysis,
): PotentialSavings => {
  const deadCodeElimination = analysis.modules
    .filter((m) => m.usageCount === 0)
    .reduce((sum, m) => sum + m.size, 0);

  const duplicateCodeRemoval = analysis.duplicateCode
    .reduce((sum, dup) => sum + dup.savings, 0);

  const treeShakenUnusedExports = analysis.unusedExports.length * 50; // Rough estimate

  return {
    deadCodeElimination,
    duplicateCodeRemoval,
    treeShakenUnusedExports,
    totalPotentialSavings: deadCodeElimination + duplicateCodeRemoval +
      treeShakenUnusedExports,
  };
};

// Functional BundleAnalyzer interface
export interface IBundleAnalyzer {
  analyzeBundle(bundleCode: string): BundleAnalysis;
  generateSizeReport(analysis: BundleAnalysis): string;
  findLargestModules(analysis: BundleAnalysis, limit?: number): ModuleInfo[];
  calculatePotentialSavings(analysis: BundleAnalysis): PotentialSavings;
}

// Functional BundleAnalyzer implementation
export const createBundleAnalyzer = (): IBundleAnalyzer => ({
  analyzeBundle(bundleCode: string): BundleAnalysis {
    return analyzeBundle(bundleCode);
  },

  generateSizeReport(analysis: BundleAnalysis): string {
    return generateSizeReport(analysis);
  },

  findLargestModules(analysis: BundleAnalysis, limit = 5): ModuleInfo[] {
    return findLargestModules(analysis, limit);
  },

  calculatePotentialSavings(analysis: BundleAnalysis): PotentialSavings {
    return calculatePotentialSavings(analysis);
  },
});

// Backward compatibility - BundleAnalyzer class that uses functional implementation
export class BundleAnalyzer {
  private analyzer: IBundleAnalyzer;

  constructor() {
    this.analyzer = createBundleAnalyzer();
  }

  analyzeBundle(bundleCode: string): BundleAnalysis {
    return this.analyzer.analyzeBundle(bundleCode);
  }

  generateSizeReport(analysis: BundleAnalysis): string {
    return this.analyzer.generateSizeReport(analysis);
  }

  findLargestModules(analysis: BundleAnalysis, limit = 5): ModuleInfo[] {
    return this.analyzer.findLargestModules(analysis, limit);
  }

  calculatePotentialSavings(analysis: BundleAnalysis): PotentialSavings {
    return this.analyzer.calculatePotentialSavings(analysis);
  }
}

/**
 * Tree shaking utilities
 */
export const treeShaking: {
  findUnusedImports: (componentCode: string) => string[];
  optimizeImports: (componentCode: string) => string;
  calculateTreeShakingSavings: (
    originalSize: number,
    optimizedSize: number,
  ) => { savedBytes: number; savedPercentage: number; isWorthwhile: boolean };
} = {
  /**
   * Identify unused imports in ui-lib components
   */
  findUnusedImports(componentCode: string): string[] {
    const unused: string[] = [];

    // Simple regex-based detection (real implementation would use AST)
    const importMatch = componentCode.match(/import\s*\{([^}]+)\}\s*from/g);
    if (!importMatch) return unused;

    for (const importStatement of importMatch) {
      const imports = importStatement.match(/\{([^}]+)\}/)?.[1]
        .split(",")
        .map((i) => i.trim());

      if (imports) {
        for (const importName of imports) {
          // Count usages (excluding the import line itself)
          const usageCount =
            (componentCode.match(new RegExp(`\\b${importName}\\b`, "g")) || [])
              .length - 1;
          if (usageCount === 0) {
            unused.push(importName);
          }
        }
      }
    }

    return unused;
  },

  /**
   * Generate optimized imports with only used items
   */
  optimizeImports(componentCode: string): string {
    const unusedImports = this.findUnusedImports(componentCode);
    let optimized = componentCode;

    for (const unused of unusedImports) {
      optimized = optimized.replace(
        new RegExp(`,?\\s*${unused}\\s*,?`, "g"),
        "",
      );
      optimized = optimized.replace(/\{\s*,/, "{"); // Clean up leading commas
      optimized = optimized.replace(/,\s*\}/, "}"); // Clean up trailing commas
    }

    return optimized;
  },

  /**
   * Calculate tree shaking savings
   */
  calculateTreeShakingSavings(originalSize: number, optimizedSize: number): {
    savedBytes: number;
    savedPercentage: number;
    isWorthwhile: boolean; // >5% savings
  } {
    const savedBytes = originalSize - optimizedSize;
    const savedPercentage = (savedBytes / originalSize) * 100;

    return {
      savedBytes,
      savedPercentage: Math.round(savedPercentage * 100) / 100,
      isWorthwhile: savedPercentage > 5,
    };
  },
};

/**
 * Code splitting utilities
 */
export const codeSplitting: {
  identifyLazyCandidates: (
    components: Array<{ name: string; size: number; criticalPath: boolean }>,
  ) => string[];
  generateLazyWrapper: (name: string) => string;
  calculateSplitBenefits: (
    originalSize: number,
    criticalSize: number,
    lazySize: number,
  ) => {
    initialBundleReduction: number;
    initialLoadImprovement: number;
    lazyLoadOverhead: number;
  };
} = {
  /**
   * Identify components suitable for lazy loading
   */
  identifyLazyCandidates(
    components: Array<{ name: string; size: number; criticalPath: boolean }>,
  ): string[] {
    return components
      .filter((comp) => !comp.criticalPath && comp.size > 2000) // >2KB and not critical
      .sort((a, b) => b.size - a.size)
      .map((comp) => comp.name);
  },

  /**
   * Generate dynamic import code for lazy components
   */
  generateLazyWrapper(componentName: string): string {
    return `// Lazy wrapper for ${componentName}
const Lazy${componentName} = {
  component: null,
  async load() {
    if (!this.component) {
      const module = await import('./components/${componentName.toLowerCase()}.js');
      this.component = module.default || module.${componentName};
    }
    return this.component;
  },
  async render(props) {
    const Component = await this.load();
    return Component(props);
  }
};`;
  },

  /**
   * Calculate code splitting benefits
   */
  calculateSplitBenefits(
    originalBundleSize: number,
    criticalPathSize: number,
    lazyChunkSize: number,
  ): {
    initialBundleReduction: number;
    initialLoadImprovement: number;
    lazyLoadOverhead: number;
  } {
    const initialBundleReduction = originalBundleSize - criticalPathSize;
    const initialLoadImprovement =
      (initialBundleReduction / originalBundleSize) * 100;

    return {
      initialBundleReduction,
      initialLoadImprovement: Math.round(initialLoadImprovement * 100) / 100,
      lazyLoadOverhead: lazyChunkSize,
    };
  },
};

/**
 * Export preset optimization configurations
 */
export const optimizationPresets = {
  production: {
    minifyCode: true,
    eliminateDeadCode: true,
    enableTreeShaking: true,
    splitChunks: true,
    generateSourceMaps: false,
    targetES: "ES2020" as const,
    compressionLevel: 5,
  },

  development: {
    minifyCode: false,
    eliminateDeadCode: false,
    enableTreeShaking: false,
    splitChunks: false,
    generateSourceMaps: true,
    targetES: "ESNext" as const,
    compressionLevel: 1,
  },

  size_optimized: {
    minifyCode: true,
    eliminateDeadCode: true,
    enableTreeShaking: true,
    splitChunks: true,
    generateSourceMaps: false,
    targetES: "ES2018" as const,
    compressionLevel: 5,
  },
} as const;
