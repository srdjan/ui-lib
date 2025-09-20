// CSS Migration and Integration Helpers
// Provides smooth migration path from current CSS-in-TS to modern architecture

import { modernCSS, type ModernStyleObject } from './modern-css-system.ts';
import { token } from './design-tokens.ts';
import { wrapInLayer } from './css-layers.ts';
import type { CSSProperties, StyleObject } from './css-types.ts';

/**
 * Migration Configuration
 */
export interface MigrationConfig {
  readonly preserveClassNames?: boolean;
  readonly addDeprecationWarnings?: boolean;
  readonly enableLegacySupport?: boolean;
}

/**
 * CSS Migration Helper
 */
export class CSSMigration {
  private static config: MigrationConfig = {
    preserveClassNames: true,
    addDeprecationWarnings: false,
    enableLegacySupport: true,
  };

  /**
   * Set migration configuration
   */
  static configure(config: Partial<MigrationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Migrate legacy CSS-in-TS object to modern system
   */
  static migrateLegacyStyles(
    legacyStyles: Record<string, StyleObject>,
    componentName?: string
  ): { classMap: Record<string, string>; css: string } {
    const modernStyles: Record<string, ModernStyleObject> = {};

    for (const [key, styleObject] of Object.entries(legacyStyles)) {
      modernStyles[key] = this.convertStyleObject(styleObject);
    }

    return modernCSS({
      layer: 'components',
      container: componentName ? { name: componentName, type: 'inline-size' } : undefined,
      styles: modernStyles,
    });
  }

  /**
   * Convert legacy style object to modern format
   */
  private static convertStyleObject(styleObject: StyleObject): ModernStyleObject {
    const modernStyle: ModernStyleObject = {};

    for (const [property, value] of Object.entries(styleObject)) {
      if (property.startsWith('&')) {
        // Handle pseudo-selectors
        modernStyle[property] = this.convertStyleObject(value as StyleObject);
      } else if (property === '@media') {
        // Handle media queries
        const mediaQueries: Record<string, ModernStyleObject> = {};
        for (const [breakpoint, breakpointStyles] of Object.entries(value as Record<string, StyleObject>)) {
          mediaQueries[breakpoint] = this.convertStyleObject(breakpointStyles);
        }
        modernStyle['@media'] = mediaQueries;
      } else {
        // Handle regular CSS properties with token replacement
        modernStyle[property] = this.replaceWithTokens(property, value);
      }
    }

    return modernStyle;
  }

  /**
   * Replace hardcoded values with design tokens where possible
   */
  private static replaceWithTokens(property: string, value: unknown): unknown {
    if (typeof value !== 'string') return value;

    // Color replacements
    const colorReplacements: Record<string, string> = {
      '#ffffff': token('color', 'white'),
      '#000000': token('color', 'black'),
      '#f9fafb': token('color', 'gray-50'),
      '#f3f4f6': token('color', 'gray-100'),
      '#e5e7eb': token('color', 'gray-200'),
      '#d1d5db': token('color', 'gray-300'),
      '#9ca3af': token('color', 'gray-400'),
      '#6b7280': token('color', 'gray-500'),
      '#4b5563': token('color', 'gray-600'),
      '#374151': token('color', 'gray-700'),
      '#1f2937': token('color', 'gray-800'),
      '#111827': token('color', 'gray-900'),
      // Primary colors
      '#3b82f6': token('color', 'primary-500'),
      '#2563eb': token('color', 'primary-600'),
      '#1d4ed8': token('color', 'primary-700'),
      // Success colors
      '#22c55e': token('color', 'success-500'),
      '#16a34a': token('color', 'success-600'),
      // Error colors
      '#ef4444': token('color', 'error-500'),
      '#dc2626': token('color', 'error-600'),
      // Warning colors
      '#f59e0b': token('color', 'warning-500'),
      '#d97706': token('color', 'warning-600'),
    };

    // Spacing replacements
    const spacingReplacements: Record<string, string> = {
      '0': token('space', '0'),
      '1px': token('space', 'px'),
      '0.25rem': token('space', '1'),
      '0.5rem': token('space', '2'),
      '0.75rem': token('space', '3'),
      '1rem': token('space', '4'),
      '1.25rem': token('space', '5'),
      '1.5rem': token('space', '6'),
      '2rem': token('space', '8'),
      '2.5rem': token('space', '10'),
      '3rem': token('space', '12'),
      '4rem': token('space', '16'),
      '5rem': token('space', '20'),
    };

    // Font size replacements
    const fontSizeReplacements: Record<string, string> = {
      '0.75rem': token('typography', 'text-xs'),
      '0.875rem': token('typography', 'text-sm'),
      '1rem': token('typography', 'text-base'),
      '1.125rem': token('typography', 'text-lg'),
      '1.25rem': token('typography', 'text-xl'),
      '1.5rem': token('typography', 'text-2xl'),
      '1.875rem': token('typography', 'text-3xl'),
      '2.25rem': token('typography', 'text-4xl'),
    };

    // Border radius replacements
    const radiusReplacements: Record<string, string> = {
      '0': token('radius', 'none'),
      '0.125rem': token('radius', 'sm'),
      '0.25rem': token('radius', 'base'),
      '0.375rem': token('radius', 'md'),
      '0.5rem': token('radius', 'lg'),
      '0.75rem': token('radius', 'xl'),
      '1rem': token('radius', '2xl'),
      '9999px': token('radius', 'full'),
    };

    // Apply replacements based on property
    const propertyMappings: Record<string, Record<string, string>> = {
      color: colorReplacements,
      backgroundColor: colorReplacements,
      borderColor: colorReplacements,
      padding: spacingReplacements,
      margin: spacingReplacements,
      fontSize: fontSizeReplacements,
      borderRadius: radiusReplacements,
      // Add spacing properties
      paddingTop: spacingReplacements,
      paddingRight: spacingReplacements,
      paddingBottom: spacingReplacements,
      paddingLeft: spacingReplacements,
      marginTop: spacingReplacements,
      marginRight: spacingReplacements,
      marginBottom: spacingReplacements,
      marginLeft: spacingReplacements,
      gap: spacingReplacements,
    };

    const mapping = propertyMappings[property];
    if (mapping && mapping[value]) {
      return mapping[value];
    }

    return value;
  }

  /**
   * Create backward-compatible wrapper for existing css() function
   */
  static createLegacyWrapper() {
    return function css(
      styles: Record<string, StyleObject>,
    ): { classMap: Record<string, string>; css: string } {
      if (CSSMigration.config.addDeprecationWarnings) {
        console.warn(
          'DEPRECATION: Legacy css() function is deprecated. Migrate to modernCSS() for better performance and features.'
        );
      }

      return CSSMigration.migrateLegacyStyles(styles);
    };
  }

  /**
   * Generate migration report for a component
   */
  static generateMigrationReport(
    componentName: string,
    legacyStyles: Record<string, StyleObject>
  ): MigrationReport {
    const replacements: Array<{ property: string; oldValue: string; newValue: string }> = [];
    const warnings: string[] = [];
    let tokenUsage = 0;
    let totalProperties = 0;

    for (const [styleKey, styleObject] of Object.entries(legacyStyles)) {
      for (const [property, value] of Object.entries(styleObject)) {
        if (typeof value === 'string') {
          totalProperties++;
          const tokenValue = this.replaceWithTokens(property, value);
          if (tokenValue !== value) {
            replacements.push({
              property: `${styleKey}.${property}`,
              oldValue: value,
              newValue: tokenValue as string,
            });
            tokenUsage++;
          }
        }
      }
    }

    // Check for deprecated patterns
    if (JSON.stringify(legacyStyles).includes('!important')) {
      warnings.push('Usage of !important detected - consider using cascade layers instead');
    }

    if (JSON.stringify(legacyStyles).includes('px')) {
      warnings.push('Pixel values detected - consider using design tokens for consistency');
    }

    return {
      componentName,
      tokenReplacementCount: tokenUsage,
      totalProperties,
      tokenUsagePercentage: Math.round((tokenUsage / totalProperties) * 100),
      replacements,
      warnings,
      modernizationScore: this.calculateModernizationScore(legacyStyles),
    };
  }

  /**
   * Calculate how "modern" a component's styles are
   */
  private static calculateModernizationScore(styles: Record<string, StyleObject>): number {
    let score = 0;
    let maxScore = 0;

    const styleString = JSON.stringify(styles);

    // Positive points
    if (styleString.includes('var(--')) score += 20; // Uses CSS custom properties
    if (styleString.includes('clamp(')) score += 15; // Uses fluid typography
    if (styleString.includes('@container')) score += 20; // Uses container queries
    if (styleString.includes('logical')) score += 10; // Uses logical properties
    if (styleString.includes(':focus-visible')) score += 10; // Modern focus handling
    if (styleString.includes('@supports')) score += 10; // Progressive enhancement

    // Negative points
    if (styleString.includes('!important')) score -= 15;
    if (styleString.includes('px') && !styleString.includes('1px')) score -= 10; // Hardcoded pixels
    if (styleString.includes('#')) score -= 5; // Hardcoded hex colors

    maxScore = 85; // Maximum possible score

    return Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)));
  }
}

/**
 * Migration Report Interface
 */
export interface MigrationReport {
  readonly componentName: string;
  readonly tokenReplacementCount: number;
  readonly totalProperties: number;
  readonly tokenUsagePercentage: number;
  readonly replacements: Array<{
    property: string;
    oldValue: string;
    newValue: string;
  }>;
  readonly warnings: string[];
  readonly modernizationScore: number;
}

/**
 * Component Upgrade Helper
 */
export class ComponentUpgrader {
  /**
   * Upgrade a component to use modern CSS architecture
   */
  static upgradeComponent<TProps = any>(
    name: string,
    currentComponent: {
      styles?: any;
      render: (props: TProps, api?: any, classes?: any) => string;
    },
    options: {
      useModernTokens?: boolean;
      enableContainerQueries?: boolean;
      addAccessibilityFeatures?: boolean;
    } = {}
  ): {
    styles: { classMap: Record<string, string>; css: string };
    render: (props: TProps, api?: any, classes?: any) => string;
    migrationReport?: MigrationReport;
  } {
    const {
      useModernTokens = true,
      enableContainerQueries = true,
      addAccessibilityFeatures = true,
    } = options;

    let upgradedStyles: { classMap: Record<string, string>; css: string };
    let migrationReport: MigrationReport | undefined;

    // Upgrade styles if they exist
    if (currentComponent.styles) {
      if (typeof currentComponent.styles === 'string') {
        // Handle string-based styles
        upgradedStyles = {
          classMap: {},
          css: wrapInLayer('components', currentComponent.styles),
        };
      } else {
        // Handle object-based styles
        upgradedStyles = CSSMigration.migrateLegacyStyles(
          currentComponent.styles,
          enableContainerQueries ? name : undefined
        );
        migrationReport = CSSMigration.generateMigrationReport(name, currentComponent.styles);
      }
    } else {
      upgradedStyles = { classMap: {}, css: '' };
    }

    // Enhance render function with accessibility features
    const enhancedRender = (props: TProps, api?: any, classes?: any): string => {
      const originalHtml = currentComponent.render(props, api, classes || upgradedStyles.classMap);

      if (!addAccessibilityFeatures) {
        return originalHtml;
      }

      // Add basic accessibility enhancements
      return this.enhanceAccessibility(originalHtml, name);
    };

    return {
      styles: upgradedStyles,
      render: enhancedRender,
      migrationReport,
    };
  }

  /**
   * Add accessibility enhancements to component HTML
   */
  private static enhanceAccessibility(html: string, componentName: string): string {
    let enhanced = html;

    // Add data-component attribute for debugging
    enhanced = enhanced.replace(
      /(<[^>]+class="[^"]*"[^>]*>)/,
      `$1`.replace('>', ` data-component="${componentName}">`)
    );

    // Enhance focus indicators
    enhanced = enhanced.replace(
      /(<button[^>]*>)/g,
      '$1'.replace('>', ' data-focus-visible="">')
    );

    // Add ARIA landmarks where appropriate
    if (componentName === 'toolbar') {
      enhanced = enhanced.replace(
        /(<[^>]+class="[^"]*toolbar[^"]*"[^>]*>)/,
        '$1'.replace('>', ' role="toolbar">')
      );
    }

    if (componentName === 'alert') {
      enhanced = enhanced.replace(
        /(<[^>]+class="[^"]*alert[^"]*"[^>]*>)/,
        '$1'.replace('>', ' role="alert" aria-live="polite">')
      );
    }

    return enhanced;
  }
}

/**
 * Batch Migration Helper
 */
export class BatchMigration {
  /**
   * Migrate multiple components at once
   */
  static migrateComponents(
    components: Record<string, { styles?: any }>,
    options: { generateReport?: boolean } = {}
  ): {
    upgradedComponents: Record<string, { classMap: Record<string, string>; css: string }>;
    reports?: Record<string, MigrationReport>;
  } {
    const upgradedComponents: Record<string, { classMap: Record<string, string>; css: string }> = {};
    const reports: Record<string, MigrationReport> = {};

    for (const [name, component] of Object.entries(components)) {
      if (component.styles && typeof component.styles === 'object') {
        upgradedComponents[name] = CSSMigration.migrateLegacyStyles(component.styles, name);

        if (options.generateReport) {
          reports[name] = CSSMigration.generateMigrationReport(name, component.styles);
        }
      }
    }

    return {
      upgradedComponents,
      reports: options.generateReport ? reports : undefined,
    };
  }

  /**
   * Generate comprehensive migration summary
   */
  static generateSummaryReport(reports: Record<string, MigrationReport>): {
    totalComponents: number;
    averageModernizationScore: number;
    totalTokenReplacements: number;
    mostCommonWarnings: Array<{ warning: string; count: number }>;
    componentsNeedingAttention: string[];
  } {
    const components = Object.values(reports);
    const totalComponents = components.length;

    const averageModernizationScore = Math.round(
      components.reduce((sum, report) => sum + report.modernizationScore, 0) / totalComponents
    );

    const totalTokenReplacements = components.reduce(
      (sum, report) => sum + report.tokenReplacementCount,
      0
    );

    // Count warning frequencies
    const warningCounts: Record<string, number> = {};
    components.forEach(report => {
      report.warnings.forEach(warning => {
        warningCounts[warning] = (warningCounts[warning] || 0) + 1;
      });
    });

    const mostCommonWarnings = Object.entries(warningCounts)
      .map(([warning, count]) => ({ warning, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const componentsNeedingAttention = components
      .filter(report => report.modernizationScore < 50)
      .map(report => report.componentName);

    return {
      totalComponents,
      averageModernizationScore,
      totalTokenReplacements,
      mostCommonWarnings,
      componentsNeedingAttention,
    };
  }
}