// CSS Bundling and Performance Optimization System
// Provides intelligent CSS bundling, deduplication, and critical CSS extraction

import { generateLayerDeclaration, CSS_RESET, UTILITY_CLASSES } from './css-layers.ts';
import { generateTokenCSS } from './design-tokens.ts';
import { generateComponentCSS } from './component-system.ts';

/**
 * CSS Bundle Configuration
 */
export interface CSSBundleConfig {
  readonly includeReset?: boolean;
  readonly includeTokens?: boolean;
  readonly includeUtilities?: boolean;
  readonly includeComponents?: string[] | 'all';
  readonly minify?: boolean;
  readonly sourcemap?: boolean;
  readonly criticalCSS?: boolean;
}

/**
 * CSS Bundle Result
 */
export interface CSSBundle {
  readonly css: string;
  readonly criticalCSS?: string;
  readonly stats: {
    readonly totalSize: number;
    readonly gzippedSize: number;
    readonly layers: Record<string, number>;
    readonly components: string[];
  };
}

/**
 * CSS Bundler Class
 */
export class CSSBundler {
  private static componentCache = new Map<string, string>();
  private static deduplicationCache = new Set<string>();

  /**
   * Create a complete CSS bundle
   */
  static createBundle(config: CSSBundleConfig = {}): CSSBundle {
    const {
      includeReset = true,
      includeTokens = true,
      includeUtilities = true,
      includeComponents = 'all',
      minify = false,
      criticalCSS = false,
    } = config;

    const cssChunks: string[] = [];

    // 1. Layer declaration (must be first)
    cssChunks.push(generateLayerDeclaration());

    // 2. Reset layer
    if (includeReset) {
      cssChunks.push(CSS_RESET);
    }

    // 3. Tokens layer
    if (includeTokens) {
      cssChunks.push(generateTokenCSS());
    }

    // 4. Utilities layer
    if (includeUtilities) {
      cssChunks.push(UTILITY_CLASSES);
    }

    // 5. Components layer
    if (includeComponents) {
      const componentCSS = this.getComponentCSS(includeComponents);
      if (componentCSS) {
        cssChunks.push(componentCSS);
      }
    }

    // Combine and optimize
    const combinedCSS = cssChunks.join('\n\n');
    const optimizedCSS = this.optimizeCSS(combinedCSS);
    const finalCSS = minify ? this.minifyCSS(optimizedCSS) : optimizedCSS;

    // Extract critical CSS if requested
    let criticalCSSResult: string | undefined;
    if (criticalCSS) {
      criticalCSSResult = this.extractCriticalCSS(finalCSS);
    }

    // Generate stats
    const stats = this.generateStats(finalCSS, includeComponents);

    return {
      css: finalCSS,
      criticalCSS: criticalCSSResult,
      stats,
    };
  }

  /**
   * Get component CSS based on selection
   */
  private static getComponentCSS(selection: string[] | 'all'): string {
    if (selection === 'all') {
      return generateComponentCSS();
    }

    // Generate only selected components
    const selectedCSS: string[] = [];
    for (const componentName of selection) {
      const cached = this.componentCache.get(componentName);
      if (cached) {
        selectedCSS.push(cached);
      } else {
        // Generate component CSS on demand
        const css = this.generateSingleComponentCSS(componentName);
        if (css) {
          this.componentCache.set(componentName, css);
          selectedCSS.push(css);
        }
      }
    }

    return selectedCSS.join('\n\n');
  }

  /**
   * Generate CSS for a single component
   */
  private static generateSingleComponentCSS(componentName: string): string {
    // This would integrate with the component system to generate individual component CSS
    // For now, return empty string as placeholder
    return '';
  }

  /**
   * Optimize CSS by removing duplicates and dead code
   */
  private static optimizeCSS(css: string): string {
    // Remove duplicate rules
    const rules = css.split('}').filter(rule => rule.trim());
    const uniqueRules = new Set<string>();
    const optimizedRules: string[] = [];

    for (const rule of rules) {
      const normalizedRule = this.normalizeRule(rule);
      if (!uniqueRules.has(normalizedRule)) {
        uniqueRules.add(normalizedRule);
        optimizedRules.push(rule + '}');
      }
    }

    return optimizedRules.join('\n');
  }

  /**
   * Normalize CSS rule for deduplication
   */
  private static normalizeRule(rule: string): string {
    return rule
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/,\s+/g, ',');
  }

  /**
   * Minify CSS
   */
  private static minifyCSS(css: string): string {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove unnecessary whitespace
      .replace(/\s+/g, ' ')
      // Remove space around selectors and braces
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*}/g, '}')
      .replace(/}\s*/g, '}')
      // Remove trailing semicolons
      .replace(/;}/g, '}')
      // Remove space around commas in selectors
      .replace(/,\s+/g, ',')
      .trim();
  }

  /**
   * Extract critical CSS (above-the-fold styles)
   */
  private static extractCriticalCSS(css: string): string {
    // Extract styles for critical components and base layout
    const criticalSelectors = [
      // Reset and base styles
      /^@layer reset/,
      /^@layer tokens.*:root/,
      // Critical layout utilities
      /\.u-stack/,
      /\.u-cluster/,
      /\.u-center/,
      // Essential component base styles
      /\.button[^[]*{/,
      /\.card[^[]*{/,
      /\.alert[^[]*{/,
    ];

    const criticalRules: string[] = [];
    const rules = css.split('\n');

    for (const rule of rules) {
      if (criticalSelectors.some(selector => selector.test(rule))) {
        criticalRules.push(rule);
      }
    }

    return criticalRules.join('\n');
  }

  /**
   * Generate bundle statistics
   */
  private static generateStats(css: string, components: string[] | 'all'): CSSBundle['stats'] {
    const totalSize = new Blob([css]).size;
    const gzippedSize = this.estimateGzipSize(css);

    // Calculate layer sizes
    const layers: Record<string, number> = {};
    const layerRegex = /@layer (\w+)/g;
    let match;

    while ((match = layerRegex.exec(css)) !== null) {
      const layerName = match[1];
      layers[layerName] = (layers[layerName] || 0) + 1;
    }

    const componentList = Array.isArray(components) ? components : ['all'];

    return {
      totalSize,
      gzippedSize,
      layers,
      components: componentList,
    };
  }

  /**
   * Estimate gzipped size (rough approximation)
   */
  private static estimateGzipSize(content: string): number {
    // Rough estimate: gzip typically achieves 60-80% compression on CSS
    return Math.round(content.length * 0.3);
  }

  /**
   * Create development bundle with source maps and debugging info
   */
  static createDevBundle(config: CSSBundleConfig = {}): CSSBundle {
    return this.createBundle({
      ...config,
      minify: false,
      sourcemap: true,
    });
  }

  /**
   * Create production bundle with optimizations
   */
  static createProdBundle(config: CSSBundleConfig = {}): CSSBundle {
    return this.createBundle({
      ...config,
      minify: true,
      criticalCSS: true,
    });
  }

  /**
   * Create component-specific bundle
   */
  static createComponentBundle(components: string[], config: CSSBundleConfig = {}): CSSBundle {
    return this.createBundle({
      ...config,
      includeComponents: components,
    });
  }
}

/**
 * CSS Asset Management
 */
export class CSSAssetManager {
  private static loadedAssets = new Set<string>();

  /**
   * Load CSS bundle and inject into document
   */
  static async loadBundle(bundle: CSSBundle, critical = false): Promise<void> {
    if (typeof document === 'undefined') {
      // SSR environment - return the CSS string
      return;
    }

    const cssId = critical ? 'critical-css' : 'main-css';

    if (this.loadedAssets.has(cssId)) {
      return; // Already loaded
    }

    const style = document.createElement('style');
    style.id = cssId;
    style.textContent = critical ? (bundle.criticalCSS || '') : bundle.css;

    if (critical) {
      // Insert critical CSS at the beginning of head
      document.head.insertBefore(style, document.head.firstChild);
    } else {
      document.head.appendChild(style);
    }

    this.loadedAssets.add(cssId);
  }

  /**
   * Preload CSS bundle
   */
  static preloadBundle(href: string): void {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  }

  /**
   * Get CSS bundle as data URL for inline embedding
   */
  static getBundleDataURL(bundle: CSSBundle): string {
    const cssBlob = new Blob([bundle.css], { type: 'text/css' });
    return URL.createObjectURL(cssBlob);
  }
}

/**
 * CSS Performance Monitoring
 */
export class CSSPerformanceMonitor {
  /**
   * Measure CSS parsing time
   */
  static async measureParsing(css: string): Promise<number> {
    if (typeof performance === 'undefined') return 0;

    const start = performance.now();

    // Create temporary style element to measure parsing
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const end = performance.now();

    // Cleanup
    document.head.removeChild(style);

    return end - start;
  }

  /**
   * Analyze CSS complexity
   */
  static analyzeComplexity(css: string): {
    ruleCount: number;
    selectorCount: number;
    propertyCount: number;
    mediaQueryCount: number;
    complexityScore: number;
  } {
    const ruleCount = (css.match(/[^}]+{[^}]*}/g) || []).length;
    const selectorCount = (css.match(/[^{,]+(?=\s*{)/g) || []).length;
    const propertyCount = (css.match(/[^{}]+:[^{}]+;/g) || []).length;
    const mediaQueryCount = (css.match(/@media[^{]+{/g) || []).length;

    // Simple complexity score calculation
    const complexityScore = (selectorCount * 0.3) + (propertyCount * 0.5) + (mediaQueryCount * 0.2);

    return {
      ruleCount,
      selectorCount,
      propertyCount,
      mediaQueryCount,
      complexityScore,
    };
  }
}

/**
 * Convenience functions for common bundling scenarios
 */
export const bundlePresets = {
  /**
   * Minimal bundle with just essential styles
   */
  minimal: (): CSSBundle => CSSBundler.createBundle({
    includeReset: true,
    includeTokens: true,
    includeUtilities: false,
    includeComponents: ['button', 'card', 'alert'],
    minify: true,
  }),

  /**
   * Full-featured bundle with all components
   */
  complete: (): CSSBundle => CSSBundler.createBundle({
    includeReset: true,
    includeTokens: true,
    includeUtilities: true,
    includeComponents: 'all',
    minify: false,
  }),

  /**
   * Development bundle with debugging features
   */
  development: (): CSSBundle => CSSBundler.createDevBundle({
    includeReset: true,
    includeTokens: true,
    includeUtilities: true,
    includeComponents: 'all',
  }),

  /**
   * Production-optimized bundle
   */
  production: (): CSSBundle => CSSBundler.createProdBundle({
    includeReset: true,
    includeTokens: true,
    includeUtilities: true,
    includeComponents: 'all',
  }),
};