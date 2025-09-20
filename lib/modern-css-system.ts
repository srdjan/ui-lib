// Modern CSS system with container queries, cascade layers, and performance optimizations
// Provides enhanced CSS-in-TS with full modern CSS features

import type { CSSLayer } from './css-layers.ts';
import { wrapInLayer } from './css-layers.ts';
import { token } from './design-tokens.ts';

/**
 * Enhanced CSS Properties with modern features
 */
export interface ModernCSSProperties {
  // Container Queries
  containerType?: 'normal' | 'size' | 'inline-size' | 'block-size';
  containerName?: string;

  // CSS Containment
  contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint' | string;

  // Logical Properties
  inlineSize?: string | number;
  blockSize?: string | number;
  marginInlineStart?: string | number;
  marginInlineEnd?: string | number;
  marginBlockStart?: string | number;
  marginBlockEnd?: string | number;
  paddingInlineStart?: string | number;
  paddingInlineEnd?: string | number;
  paddingBlockStart?: string | number;
  paddingBlockEnd?: string | number;
  borderInlineStartColor?: string;
  borderInlineEndColor?: string;
  borderBlockStartColor?: string;
  borderBlockEndColor?: string;

  // Modern Layout
  aspectRatio?: string | number;
  gap?: string | number;
  rowGap?: string | number;
  columnGap?: string | number;
  placeItems?: string;
  placeContent?: string;
  placeSelf?: string;

  // Advanced Selectors
  '&:focus-visible'?: ModernCSSProperties;
  '&:focus-within'?: ModernCSSProperties;
  '&:has()'?: ModernCSSProperties;
  '&:is()'?: ModernCSSProperties;
  '&:where()'?: ModernCSSProperties;
  '&:not()'?: ModernCSSProperties;

  // Standard CSS properties (extended from existing types)
  [key: string]: any;
}

/**
 * Container Query Support
 */
export interface ContainerQuery {
  condition: string;
  styles: ModernCSSProperties;
}

/**
 * Enhanced Style Object with modern features
 */
export interface ModernStyleObject extends ModernCSSProperties {
  // Container queries
  '@container'?: Record<string, ModernCSSProperties>;

  // Support functions
  '@supports'?: Record<string, ModernCSSProperties>;

  // Existing media queries
  '@media'?: Record<string, ModernCSSProperties>;

  // Nested selectors
  [key: `&${string}`]: ModernCSSProperties | undefined;

  // Child selectors
  [key: ` ${string}`]: ModernCSSProperties | undefined;
}

/**
 * Component Style Definition
 */
export interface ComponentStyleConfig {
  readonly layer?: CSSLayer;
  readonly container?: {
    name?: string;
    type?: 'normal' | 'size' | 'inline-size' | 'block-size';
  };
  readonly styles: Record<string, ModernStyleObject>;
}

/**
 * Enhanced CSS generation with modern features
 */
export class ModernCSSGenerator {
  private static classCounter = 0;
  private static generatedStyles = new Set<string>();

  /**
   * Generate modern CSS with container queries and layers
   */
  static generateStyles(config: ComponentStyleConfig): {
    classMap: Record<string, string>;
    css: string;
  } {
    const { layer = 'components', container, styles } = config;
    const classMap: Record<string, string> = {};
    const cssRules: string[] = [];

    // Generate container setup if specified
    if (container) {
      const containerCSS = this.generateContainerCSS(container);
      if (containerCSS) {
        cssRules.push(containerCSS);
      }
    }

    // Process each style definition
    for (const [key, styleObject] of Object.entries(styles)) {
      const className = this.generateClassName(key);
      classMap[key] = className;

      const css = this.styleObjectToCSS(styleObject, className);
      if (css) {
        cssRules.push(css);
      }
    }

    const combinedCSS = cssRules.join('\n\n');
    const layeredCSS = wrapInLayer(layer, combinedCSS);

    return {
      classMap,
      css: layeredCSS,
    };
  }

  /**
   * Generate container CSS setup
   */
  private static generateContainerCSS(container: NonNullable<ComponentStyleConfig['container']>): string {
    const rules: string[] = [];

    if (container.name) {
      rules.push(`container-name: ${container.name};`);
    }

    if (container.type) {
      rules.push(`container-type: ${container.type};`);
    }

    if (rules.length === 0) return '';

    return `.component-container {
  ${rules.join('\n  ')}
}`;
  }

  /**
   * Convert style object to CSS with modern features
   */
  private static styleObjectToCSS(styles: ModernStyleObject, selector: string): string {
    const rules: string[] = [];
    const baseStyles: Record<string, string> = {};
    const nestedSelectors: Record<string, ModernStyleObject> = {};
    const containerQueries: Record<string, ModernStyleObject> = {};
    const mediaQueries: Record<string, ModernStyleObject> = {};
    const supportQueries: Record<string, ModernStyleObject> = {};

    // Separate different types of styles
    for (const [key, value] of Object.entries(styles)) {
      if (key.startsWith('&')) {
        nestedSelectors[key] = value as ModernStyleObject;
      } else if (key.startsWith(' ')) {
        nestedSelectors[key] = value as ModernStyleObject;
      } else if (key === '@container') {
        Object.assign(containerQueries, value as Record<string, ModernStyleObject>);
      } else if (key === '@media') {
        Object.assign(mediaQueries, value as Record<string, ModernStyleObject>);
      } else if (key === '@supports') {
        Object.assign(supportQueries, value as Record<string, ModernStyleObject>);
      } else if (value !== undefined) {
        baseStyles[key] = this.formatCSSValue(key, value);
      }
    }

    // Generate base CSS rule
    if (Object.keys(baseStyles).length > 0) {
      const declarations = Object.entries(baseStyles)
        .map(([prop, val]) => `  ${this.kebabCase(prop)}: ${val};`)
        .join('\n');
      rules.push(`.${selector} {\n${declarations}\n}`);
    }

    // Generate nested selectors
    for (const [nestedSelector, nestedStyles] of Object.entries(nestedSelectors)) {
      const fullSelector = nestedSelector.startsWith('&')
        ? nestedSelector.replace('&', `.${selector}`)
        : `.${selector}${nestedSelector}`;

      const nestedCSS = this.styleObjectToCSS(nestedStyles, '');
      if (nestedCSS) {
        // Replace the placeholder selector with the actual nested selector
        const formattedCSS = nestedCSS.replace(/^\.[^{]*/, fullSelector);
        rules.push(formattedCSS);
      }
    }

    // Generate container queries
    for (const [condition, containerStyles] of Object.entries(containerQueries)) {
      const containerCSS = this.styleObjectToCSS(containerStyles, selector);
      if (containerCSS) {
        rules.push(`@container ${condition} {\n  ${containerCSS}\n}`);
      }
    }

    // Generate media queries
    for (const [condition, mediaStyles] of Object.entries(mediaQueries)) {
      const mediaCSS = this.styleObjectToCSS(mediaStyles, selector);
      if (mediaCSS) {
        const mediaQuery = this.getMediaQuery(condition);
        rules.push(`@media ${mediaQuery} {\n  ${mediaCSS}\n}`);
      }
    }

    // Generate support queries
    for (const [condition, supportStyles] of Object.entries(supportQueries)) {
      const supportCSS = this.styleObjectToCSS(supportStyles, selector);
      if (supportCSS) {
        rules.push(`@supports ${condition} {\n  ${supportCSS}\n}`);
      }
    }

    return rules.join('\n\n');
  }

  /**
   * Generate unique, semantic class names
   */
  private static generateClassName(key: string): string {
    const normalized = this.kebabCase(key);
    const hash = this.generateHash(key + this.classCounter++);
    return `${normalized}-${hash}`;
  }

  /**
   * Simple hash function for class names
   */
  private static generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substr(0, 6);
  }

  /**
   * Convert camelCase to kebab-case
   */
  private static kebabCase(str: string): string {
    if (str.startsWith('--')) return str;

    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/^ms-/, '-ms-')
      .toLowerCase();
  }

  /**
   * Format CSS value with proper units and conversions
   */
  private static formatCSSValue(property: string, value: unknown): string {
    if (typeof value === 'number') {
      const unitlessProperties = [
        'opacity', 'flexGrow', 'flexShrink', 'fontWeight', 'lineHeight',
        'order', 'zIndex', 'animationIterationCount', 'aspectRatio'
      ];

      if (unitlessProperties.includes(property)) {
        return String(value);
      }

      return `${value}px`;
    }

    return String(value);
  }

  /**
   * Get media query string for breakpoints
   */
  private static getMediaQuery(breakpoint: string): string {
    const defaultBreakpoints: Record<string, string> = {
      'mobile': '(max-width: 640px)',
      'tablet': '(min-width: 641px) and (max-width: 1024px)',
      'desktop': '(min-width: 1025px)',
      'wide': '(min-width: 1441px)',
      'print': 'print',
      'reduced-motion': '(prefers-reduced-motion: reduce)',
      'dark': '(prefers-color-scheme: dark)',
      'light': '(prefers-color-scheme: light)',
      'high-contrast': '(prefers-contrast: high)',
    };

    if (breakpoint in defaultBreakpoints) {
      return defaultBreakpoints[breakpoint];
    }

    if (breakpoint.startsWith('(') && breakpoint.endsWith(')')) {
      return breakpoint;
    }

    return `(min-width: ${breakpoint})`;
  }
}

/**
 * Convenience function for creating modern component styles
 */
export function modernCSS(config: ComponentStyleConfig): {
  classMap: Record<string, string>;
  css: string;
} {
  return ModernCSSGenerator.generateStyles(config);
}

/**
 * Create responsive component with container queries
 */
export function responsiveComponent(
  name: string,
  styles: Record<string, ModernStyleObject>
): { classMap: Record<string, string>; css: string } {
  return modernCSS({
    layer: 'components',
    container: {
      name: name,
      type: 'inline-size',
    },
    styles,
  });
}

/**
 * Performance-optimized CSS utilities
 */
export const cssUtils = {
  /**
   * Create high-performance animations
   */
  animation: (name: string, keyframes: Record<string, ModernCSSProperties>): string => {
    const keyframeRules = Object.entries(keyframes)
      .map(([percent, styles]) => {
        const declarations = Object.entries(styles)
          .map(([prop, value]) => `  ${ModernCSSGenerator['kebabCase'](prop)}: ${value};`)
          .join('\n');
        return `  ${percent} {\n${declarations}\n  }`;
      })
      .join('\n');

    return `@keyframes ${name} {
${keyframeRules}
}`;
  },

  /**
   * Create focus-visible styles for accessibility
   */
  focusVisible: (styles: ModernCSSProperties): ModernCSSProperties => ({
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: `2px solid ${token('color', 'primary-500')}`,
      outlineOffset: '2px',
      ...styles,
    },
  }),

  /**
   * Create reduced motion variants
   */
  reducedMotion: (normalStyles: ModernCSSProperties, reducedStyles: ModernCSSProperties): ModernCSSProperties => ({
    ...normalStyles,
    '@media': {
      'reduced-motion': reducedStyles,
    },
  }),

  /**
   * Create dark mode variants
   */
  darkMode: (lightStyles: ModernCSSProperties, darkStyles: ModernCSSProperties): ModernCSSProperties => ({
    ...lightStyles,
    '@media': {
      'dark': darkStyles,
    },
  }),
};