// Modern CSS Architecture - Main Integration
// Provides a unified API for the modernized CSS system

export * from './css-layers.ts';
export * from './design-tokens.ts';
export * from './modern-css-system.ts';
export * from './component-system.ts';
export * from './css-bundler.ts';
export * from './css-migration.ts';

import { CSSBundler, bundlePresets } from './css-bundler.ts';
import { CSSMigration } from './css-migration.ts';
import { modernCSS, responsiveComponent } from './modern-css-system.ts';
import { token, generateTokenCSS } from './design-tokens.ts';
import { generateLayerDeclaration, CSS_RESET, UTILITY_CLASSES } from './css-layers.ts';
import { generateComponentCSS } from './component-system.ts';

/**
 * Modern CSS Architecture API
 * Provides a simple, high-level interface for the entire CSS system
 */
export class ModernCSS {
  private static initialized = false;
  private static developmentMode = false;

  /**
   * Initialize the modern CSS system
   */
  static initialize(options: {
    developmentMode?: boolean;
    autoMigrate?: boolean;
    enableWarnings?: boolean;
  } = {}): void {
    const {
      developmentMode = false,
      autoMigrate = true,
      enableWarnings = developmentMode,
    } = options;

    this.developmentMode = developmentMode;

    // Configure migration settings
    if (autoMigrate) {
      CSSMigration.configure({
        preserveClassNames: true,
        addDeprecationWarnings: enableWarnings,
        enableLegacySupport: true,
      });
    }

    this.initialized = true;

    if (developmentMode) {
      console.log('🎨 Modern CSS Architecture initialized in development mode');
    }
  }

  /**
   * Get the complete CSS bundle for the application
   */
  static getBundle(preset: 'minimal' | 'complete' | 'development' | 'production' = 'complete'): string {
    if (!this.initialized) {
      this.initialize();
    }

    const bundle = bundlePresets[preset]();
    return bundle.css;
  }

  /**
   * Get critical CSS for above-the-fold content
   */
  static getCriticalCSS(): string {
    const bundle = bundlePresets.production();
    return bundle.criticalCSS || '';
  }

  /**
   * Create component styles using the modern system
   */
  static createComponentStyles(
    name: string,
    styles: Parameters<typeof modernCSS>[0]['styles'],
    options: {
      useContainer?: boolean;
      layer?: 'components' | 'utilities';
    } = {}
  ): { classMap: Record<string, string>; css: string } {
    const { useContainer = true, layer = 'components' } = options;

    return modernCSS({
      layer,
      container: useContainer ? { name, type: 'inline-size' } : undefined,
      styles,
    });
  }

  /**
   * Create responsive component with container queries
   */
  static createResponsiveComponent(
    name: string,
    styles: Parameters<typeof responsiveComponent>[1]
  ): { classMap: Record<string, string>; css: string } {
    return responsiveComponent(name, styles);
  }

  /**
   * Get design token value
   */
  static getToken(category: string, key: string): string {
    return token(category as any, key);
  }

  /**
   * Migrate legacy styles to modern system
   */
  static migrateLegacyStyles(
    componentName: string,
    legacyStyles: any
  ): {
    styles: { classMap: Record<string, string>; css: string };
    report: any;
  } {
    const styles = CSSMigration.migrateLegacyStyles(legacyStyles, componentName);
    const report = CSSMigration.generateMigrationReport(componentName, legacyStyles);

    return { styles, report };
  }

  /**
   * Generate development stylesheet with all features
   */
  static generateDevStylesheet(): string {
    const parts = [
      generateLayerDeclaration(),
      CSS_RESET,
      generateTokenCSS(),
      UTILITY_CLASSES,
      generateComponentCSS(),
    ];

    return parts.join('\n\n');
  }

  /**
   * Generate production stylesheet with optimizations
   */
  static generateProdStylesheet(): string {
    const bundle = CSSBundler.createProdBundle();
    return bundle.css;
  }

  /**
   * Get bundle statistics for performance monitoring
   */
  static getBundleStats(preset: 'minimal' | 'complete' | 'development' | 'production' = 'production'): {
    totalSize: number;
    gzippedSize: number;
    layers: Record<string, number>;
    components: string[];
  } {
    const bundle = bundlePresets[preset]();
    return bundle.stats;
  }

  /**
   * Enable development features
   */
  static enableDevFeatures(): void {
    this.developmentMode = true;

    // Add CSS debugging utilities
    if (typeof document !== 'undefined') {
      this.addCSSDebugging();
    }
  }

  /**
   * Add CSS debugging utilities to the page
   */
  private static addCSSDebugging(): void {
    const debugCSS = `
/* CSS Architecture Debug Utilities */
[data-css-debug] * {
  outline: 1px solid rgba(255, 0, 0, 0.3) !important;
}

[data-css-debug] *:hover {
  outline: 2px solid rgba(255, 0, 0, 0.8) !important;
  background: rgba(255, 0, 0, 0.1) !important;
}

[data-css-debug]::before {
  content: "CSS Debug Mode Active";
  position: fixed;
  top: 0;
  right: 0;
  background: #ff0000;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  z-index: 9999;
}

/* Layer visualization */
@layer utilities {
  [data-css-debug] .u-* {
    outline-color: rgba(0, 255, 0, 0.5) !important;
  }
}

@layer components {
  [data-css-debug] [class*="component"] {
    outline-color: rgba(0, 0, 255, 0.5) !important;
  }
}
`;

    const style = document.createElement('style');
    style.textContent = debugCSS;
    style.id = 'css-debug-utilities';
    document.head.appendChild(style);

    // Add toggle function to window
    (window as any).toggleCSSDebug = () => {
      document.documentElement.toggleAttribute('data-css-debug');
    };

    console.log('🔍 CSS Debug mode enabled. Call toggleCSSDebug() to visualize layout.');
  }
}

/**
 * Convenience exports for common operations
 */
export const css = {
  /**
   * Create modern component styles
   */
  component: ModernCSS.createComponentStyles,

  /**
   * Create responsive component
   */
  responsive: ModernCSS.createResponsiveComponent,

  /**
   * Get design token
   */
  token: ModernCSS.getToken,

  /**
   * Get complete bundle
   */
  bundle: ModernCSS.getBundle,

  /**
   * Get critical CSS
   */
  critical: ModernCSS.getCriticalCSS,

  /**
   * Migrate legacy styles
   */
  migrate: ModernCSS.migrateLegacyStyles,
};

/**
 * Development utilities
 */
export const dev = {
  /**
   * Initialize with development features
   */
  init: () => ModernCSS.initialize({ developmentMode: true }),

  /**
   * Get bundle statistics
   */
  stats: ModernCSS.getBundleStats,

  /**
   * Enable debugging features
   */
  debug: ModernCSS.enableDevFeatures,

  /**
   * Generate full development stylesheet
   */
  stylesheet: ModernCSS.generateDevStylesheet,
};

/**
 * Production utilities
 */
export const prod = {
  /**
   * Initialize for production
   */
  init: () => ModernCSS.initialize({ developmentMode: false }),

  /**
   * Generate optimized stylesheet
   */
  stylesheet: ModernCSS.generateProdStylesheet,

  /**
   * Get bundle with minimal footprint
   */
  minimal: () => bundlePresets.minimal(),

  /**
   * Get production-optimized bundle
   */
  optimized: () => bundlePresets.production(),
};

// Auto-initialize in development if not explicitly initialized
if (typeof Deno !== 'undefined' && Deno.env.get('DENO_ENV') === 'development') {
  dev.init();
} else if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  dev.init();
}