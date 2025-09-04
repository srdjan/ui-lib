// Bundle size optimization utilities for ui-lib
// Provides tree shaking, code splitting, and minimal runtime generation

export interface BundleAnalysis {
  readonly totalSize: number;        // Total bundle size in bytes
  readonly gzippedSize: number;      // Gzipped size in bytes
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
  readonly targetES: 'ES2018' | 'ES2020' | 'ES2022' | 'ESNext';
  readonly compressionLevel: 1 | 2 | 3 | 4 | 5; // 1 = fastest, 5 = smallest
}

/**
 * Minimal runtime generator - creates the smallest possible runtime for ui-lib components
 */
export class MinimalRuntime {
  private usedFeatures = new Set<string>();
  private componentRegistry = new Map<string, string>();
  private cssRegistry = new Set<string>();

  /**
   * Register component usage to determine required runtime features
   */
  registerComponent(name: string, features: readonly string[]): void {
    this.componentRegistry.set(name, name);
    features.forEach(feature => this.usedFeatures.add(feature));
  }

  /**
   * Register CSS usage
   */
  registerCSS(css: string): void {
    this.cssRegistry.add(css);
  }

  /**
   * Generate minimal runtime code based on used features
   */
  generateRuntime(): string {
    const runtimeParts: string[] = [];

    // Core element creation (always needed)
    runtimeParts.push(this.generateElementCreator());

    // Add only used features
    if (this.usedFeatures.has('jsx')) {
      runtimeParts.push(this.generateJSXRuntime());
    }

    if (this.usedFeatures.has('props')) {
      runtimeParts.push(this.generatePropHelpers());
    }

    if (this.usedFeatures.has('styles')) {
      runtimeParts.push(this.generateStyleSystem());
    }

    if (this.usedFeatures.has('events')) {
      runtimeParts.push(this.generateEventSystem());
    }

    if (this.usedFeatures.has('reactive')) {
      runtimeParts.push(this.generateReactiveSystem());
    }

    // Component registry (only if components are used)
    if (this.componentRegistry.size > 0) {
      runtimeParts.push(this.generateComponentRegistry());
    }

    return this.wrapRuntime(runtimeParts.join('\n\n'));
  }

  /**
   * Generate tree-shaken bundle with only used components
   */
  generateTreeShakenBundle(usedComponents: readonly string[]): string {
    const bundle: string[] = [];

    // Add minimal runtime
    bundle.push(this.generateRuntime());

    // Add only used components
    for (const componentName of usedComponents) {
      if (this.componentRegistry.has(componentName)) {
        bundle.push(this.generateComponentCode(componentName));
      }
    }

    // Add used CSS
    const usedCSS = Array.from(this.cssRegistry).join('\n');
    if (usedCSS) {
      bundle.push(`// Styles\nconst styles = \`${usedCSS}\`;\nif (typeof document !== 'undefined') { const style = document.createElement('style'); style.textContent = styles; document.head.appendChild(style); }`);
    }

    return bundle.join('\n\n');
  }

  /**
   * Get bundle size estimate
   */
  getBundleSizeEstimate(usedComponents: readonly string[] = []): {
    uncompressed: number;
    gzippedEstimate: number;
    breakdown: Record<string, number>;
  } {
    const parts = {
      runtime: this.generateRuntime(),
      components: usedComponents.map(name => this.generateComponentCode(name)).join('\n'),
      styles: Array.from(this.cssRegistry).join('\n'),
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
  }

  // Runtime generation methods
  private generateElementCreator(): string {
    return `// Minimal element creator
function h(tag, props, ...children) {
  if (typeof tag === 'function') return tag(props, ...children);
  let html = \`<\${tag}\`;
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value != null && value !== false) {
        html += \` \${key}="\${String(value).replace(/"/g, '&quot;')}"\`;
      }
    }
  }
  html += '>';
  if (children.length) {
    html += children.flat().filter(Boolean).join('');
  }
  if (!['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(tag)) {
    html += \`</\${tag}>\`;
  }
  return html;
}`;
  }

  private generateJSXRuntime(): string {
    if (!this.usedFeatures.has('jsx')) return '';
    return `// JSX runtime
const jsx = h;
const jsxs = h;
const Fragment = (props) => props.children?.join('') || '';`;
  }

  private generatePropHelpers(): string {
    if (!this.usedFeatures.has('props')) return '';
    return `// Minimal prop helpers
const string = (def = '') => (attrs, key) => attrs[key] ?? def;
const number = (def = 0) => (attrs, key) => +(attrs[key] ?? def) || def;
const boolean = (def = false) => (attrs, key) => key in attrs ? attrs[key] !== 'false' : def;
const array = (def = []) => (attrs, key) => attrs[key] ? JSON.parse(attrs[key]) : def;
const object = (def = {}) => (attrs, key) => attrs[key] ? JSON.parse(attrs[key]) : def;`;
  }

  private generateStyleSystem(): string {
    if (!this.usedFeatures.has('styles')) return '';
    return `// Minimal style system
function css(styles) {
  const classes = {};
  const cssRules = [];
  for (const [name, style] of Object.entries(styles)) {
    const className = \`ui-\${Math.random().toString(36).substr(2, 8)}\`;
    classes[name] = className;
    cssRules.push(\`.\${className} \${style}\`);
  }
  return { classMap: classes, css: cssRules.join('\\n') };
}`;
  }

  private generateEventSystem(): string {
    if (!this.usedFeatures.has('events')) return '';
    return `// Minimal event system
function on(event, handler) {
  return { [\`on\${event}\`]: handler };
}`;
  }

  private generateReactiveSystem(): string {
    if (!this.usedFeatures.has('reactive')) return '';
    return `// Minimal reactive system
const reactive = {
  set: (key, value) => typeof window !== 'undefined' && window.localStorage?.setItem(key, JSON.stringify(value)),
  get: (key) => typeof window !== 'undefined' && window.localStorage?.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : null
};`;
  }

  private generateComponentRegistry(): string {
    const components = Array.from(this.componentRegistry.keys());
    return `// Component registry
const registry = new Map([${components.map(name => `['${name}', ${name}]`).join(', ')}]);
function renderComponent(name, props) {
  const component = registry.get(name);
  return component ? component(props) : \`<div>Component '\${name}' not found</div>\`;
}`;
  }

  private generateComponentCode(name: string): string {
    // This would normally generate the actual component code
    // For demo purposes, return a placeholder
    return `// Component: ${name}
function ${name}(props = {}) {
  return h('div', { 'data-component': '${name}' }, 'Component: ${name}');
}`;
  }

  private wrapRuntime(code: string): string {
    return `// ui-lib minimal runtime
(function(global) {
  'use strict';
  
${code.split('\n').map(line => '  ' + line).join('\n')}

  // Export to global or module
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { h, renderComponent };
  } else if (typeof global !== 'undefined') {
    global.UILib = { h, renderComponent };
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);`;
  }
}

/**
 * Bundle analyzer - analyzes ui-lib bundles for optimization opportunities
 */
export class BundleAnalyzer {
  /**
   * Analyze a bundle string for size and optimization opportunities
   */
  analyzeBundle(bundleCode: string): BundleAnalysis {
    const totalSize = new TextEncoder().encode(bundleCode).length;
    const gzippedSize = this.estimateGzipSize(bundleCode);

    const modules = this.extractModules(bundleCode);
    const unusedExports = this.findUnusedExports(bundleCode, modules);
    const duplicateCode = this.findDuplicateCode(bundleCode);
    const recommendations = this.generateRecommendations(modules, unusedExports, duplicateCode, totalSize);

    return {
      totalSize,
      gzippedSize,
      modules,
      unusedExports,
      duplicateCode,
      recommendations,
    };
  }

  /**
   * Generate bundle size report
   */
  generateSizeReport(analysis: BundleAnalysis): string {
    const { totalSize, gzippedSize, modules, recommendations } = analysis;
    
    const report = [];
    report.push('# Bundle Size Report');
    report.push('');
    report.push(`**Total Size:** ${this.formatBytes(totalSize)}`);
    report.push(`**Gzipped Size:** ${this.formatBytes(gzippedSize)}`);
    report.push(`**Compression Ratio:** ${((1 - gzippedSize / totalSize) * 100).toFixed(1)}%`);
    report.push('');

    // Module breakdown
    report.push('## Module Breakdown');
    const sortedModules = [...modules].sort((a, b) => b.size - a.size);
    for (const module of sortedModules.slice(0, 10)) {
      const percentage = ((module.size / totalSize) * 100).toFixed(1);
      report.push(`- **${module.path}**: ${this.formatBytes(module.size)} (${percentage}%)`);
    }
    report.push('');

    // Recommendations
    if (recommendations.length > 0) {
      report.push('## Optimization Recommendations');
      recommendations.forEach((rec, i) => {
        report.push(`${i + 1}. ${rec}`);
      });
      report.push('');
    }

    return report.join('\n');
  }

  /**
   * Find the largest modules for optimization targeting
   */
  findLargestModules(analysis: BundleAnalysis, limit = 5): ModuleInfo[] {
    return [...analysis.modules]
      .sort((a, b) => b.size - a.size)
      .slice(0, limit);
  }

  /**
   * Calculate potential savings from various optimizations
   */
  calculatePotentialSavings(analysis: BundleAnalysis): {
    deadCodeElimination: number;
    duplicateCodeRemoval: number;
    treeShakenUnusedExports: number;
    totalPotentialSavings: number;
  } {
    const deadCodeElimination = analysis.modules
      .filter(m => m.usageCount === 0)
      .reduce((sum, m) => sum + m.size, 0);

    const duplicateCodeRemoval = analysis.duplicateCode
      .reduce((sum, dup) => sum + dup.savings, 0);

    const treeShakenUnusedExports = analysis.unusedExports.length * 50; // Rough estimate

    return {
      deadCodeElimination,
      duplicateCodeRemoval,
      treeShakenUnusedExports,
      totalPotentialSavings: deadCodeElimination + duplicateCodeRemoval + treeShakenUnusedExports,
    };
  }

  // Private analysis methods
  private estimateGzipSize(code: string): number {
    // Simple estimation - real implementation would use actual compression
    // Text typically compresses to 25-35% of original size
    const baseCompression = 0.3;
    const repetitiveCodeBonus = this.countRepetitivePatterns(code) * 0.05;
    const finalRatio = Math.max(0.15, baseCompression - repetitiveCodeBonus);
    return Math.round(code.length * finalRatio);
  }

  private countRepetitivePatterns(code: string): number {
    const lines = code.split('\n');
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
  }

  private extractModules(bundleCode: string): ModuleInfo[] {
    // Simplified module extraction - real implementation would parse AST
    const modules: ModuleInfo[] = [];
    
    // Mock modules for demo
    modules.push({
      path: 'lib/jsx-runtime.ts',
      size: bundleCode.includes('jsx') ? 800 : 0,
      gzippedSize: bundleCode.includes('jsx') ? 240 : 0,
      exports: ['h', 'jsx', 'jsxs'],
      imports: [],
      usageCount: bundleCode.includes('jsx') ? 5 : 0,
      isTreeShakable: true,
    });

    modules.push({
      path: 'lib/prop-helpers.ts',
      size: bundleCode.includes('string(') ? 600 : 0,
      gzippedSize: bundleCode.includes('string(') ? 180 : 0,
      exports: ['string', 'number', 'boolean', 'array', 'object'],
      imports: [],
      usageCount: bundleCode.includes('string(') ? 10 : 0,
      isTreeShakable: true,
    });

    return modules.filter(m => m.size > 0);
  }

  private findUnusedExports(bundleCode: string, modules: ModuleInfo[]): string[] {
    const unusedExports: string[] = [];
    
    for (const module of modules) {
      for (const exportName of module.exports) {
        if (!bundleCode.includes(exportName)) {
          unusedExports.push(`${module.path}:${exportName}`);
        }
      }
    }
    
    return unusedExports;
  }

  private findDuplicateCode(bundleCode: string): DuplicateInfo[] {
    const duplicates: DuplicateInfo[] = [];
    const lines = bundleCode.split('\n');
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
          code: code.substring(0, 100) + (code.length > 100 ? '...' : ''),
          locations,
          size: code.length * locations.length,
          savings: code.length * (locations.length - 1),
        });
      }
    }
    
    return duplicates.sort((a, b) => b.savings - a.savings);
  }

  private generateRecommendations(
    modules: ModuleInfo[], 
    unusedExports: string[], 
    duplicates: DuplicateInfo[], 
    totalSize: number
  ): string[] {
    const recommendations: string[] = [];
    
    // Size-based recommendations
    if (totalSize > 100000) { // >100KB
      recommendations.push('Bundle is large (>100KB). Consider code splitting or lazy loading.');
    }
    
    // Unused exports
    if (unusedExports.length > 0) {
      recommendations.push(`Remove ${unusedExports.length} unused exports to reduce bundle size.`);
    }
    
    // Duplicate code
    if (duplicates.length > 0) {
      const totalSavings = duplicates.reduce((sum, dup) => sum + dup.savings, 0);
      recommendations.push(`Remove duplicate code to save ${this.formatBytes(totalSavings)}.`);
    }
    
    // Non-tree-shakable modules
    const nonTreeShakable = modules.filter(m => !m.isTreeShakable);
    if (nonTreeShakable.length > 0) {
      recommendations.push(`${nonTreeShakable.length} modules are not tree-shakable. Consider refactoring.`);
    }
    
    // Large modules
    const largeModules = modules.filter(m => m.size > totalSize * 0.2);
    if (largeModules.length > 0) {
      recommendations.push(`Large modules detected: ${largeModules.map(m => m.path).join(', ')}. Consider splitting.`);
    }
    
    return recommendations;
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Tree shaking utilities
 */
export const treeShaking = {
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
        .split(',')
        .map(i => i.trim());
      
      if (imports) {
        for (const importName of imports) {
          // Count usages (excluding the import line itself)
          const usageCount = (componentCode.match(new RegExp(`\\b${importName}\\b`, 'g')) || []).length - 1;
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
      optimized = optimized.replace(new RegExp(`,?\\s*${unused}\\s*,?`, 'g'), '');
      optimized = optimized.replace(/\{\s*,/, '{'); // Clean up leading commas
      optimized = optimized.replace(/,\s*\}/, '}'); // Clean up trailing commas
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
export const codeSplitting = {
  /**
   * Identify components suitable for lazy loading
   */
  identifyLazyCandidates(components: Array<{ name: string; size: number; criticalPath: boolean }>): string[] {
    return components
      .filter(comp => !comp.criticalPath && comp.size > 2000) // >2KB and not critical
      .sort((a, b) => b.size - a.size)
      .map(comp => comp.name);
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
    lazyChunkSize: number
  ): {
    initialBundleReduction: number;
    initialLoadImprovement: number;
    lazyLoadOverhead: number;
  } {
    const initialBundleReduction = originalBundleSize - criticalPathSize;
    const initialLoadImprovement = (initialBundleReduction / originalBundleSize) * 100;
    
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
    targetES: 'ES2020' as const,
    compressionLevel: 5,
  },
  
  development: {
    minifyCode: false,
    eliminateDeadCode: false,
    enableTreeShaking: false,
    splitChunks: false,
    generateSourceMaps: true,
    targetES: 'ESNext' as const,
    compressionLevel: 1,
  },
  
  size_optimized: {
    minifyCode: true,
    eliminateDeadCode: true,
    enableTreeShaking: true,
    splitChunks: true,
    generateSourceMaps: false,
    targetES: 'ES2018' as const,
    compressionLevel: 5,
  },
} as const;