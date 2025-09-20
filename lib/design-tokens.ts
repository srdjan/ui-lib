// Enhanced design token system with semantic aliases and CSS custom properties
// Provides a comprehensive design system foundation

import { wrapInLayer } from './css-layers.ts';

/**
 * Design Token Categories
 */
export interface DesignTokens {
  readonly space: Record<string, string>;
  readonly color: Record<string, string>;
  readonly surface: Record<string, string>;
  readonly typography: Record<string, string>;
  readonly radius: Record<string, string>;
  readonly shadow: Record<string, string>;
  readonly animation: Record<string, string>;
  readonly size: Record<string, string>;
}

/**
 * Core Design Tokens
 * Based on modern design system principles with semantic naming
 */
export const DESIGN_TOKENS: DesignTokens = {
  // Spatial system using golden ratio and consistent rhythm
  space: {
    '0': '0',
    'px': '1px',
    '1': '0.25rem',   // 4px
    '2': '0.5rem',    // 8px
    '3': '0.75rem',   // 12px
    '4': '1rem',      // 16px
    '5': '1.25rem',   // 20px
    '6': '1.5rem',    // 24px
    '8': '2rem',      // 32px
    '10': '2.5rem',   // 40px
    '12': '3rem',     // 48px
    '16': '4rem',     // 64px
    '20': '5rem',     // 80px
    '24': '6rem',     // 96px
    '32': '8rem',     // 128px
    '40': '10rem',    // 160px
    '48': '12rem',    // 192px
    '56': '14rem',    // 224px
    '64': '16rem',    // 256px
  },

  // Color system with semantic aliases
  color: {
    // Neutral scale
    'white': '#ffffff',
    'gray-50': '#f9fafb',
    'gray-100': '#f3f4f6',
    'gray-200': '#e5e7eb',
    'gray-300': '#d1d5db',
    'gray-400': '#9ca3af',
    'gray-500': '#6b7280',
    'gray-600': '#4b5563',
    'gray-700': '#374151',
    'gray-800': '#1f2937',
    'gray-900': '#111827',
    'gray-950': '#030712',
    'black': '#000000',

    // Brand colors
    'primary-50': '#eff6ff',
    'primary-100': '#dbeafe',
    'primary-200': '#bfdbfe',
    'primary-300': '#93c5fd',
    'primary-400': '#60a5fa',
    'primary-500': '#3b82f6',
    'primary-600': '#2563eb',
    'primary-700': '#1d4ed8',
    'primary-800': '#1e40af',
    'primary-900': '#1e3a8a',
    'primary-950': '#172554',

    // Semantic colors
    'success-50': '#f0fdf4',
    'success-500': '#22c55e',
    'success-600': '#16a34a',
    'success-900': '#14532d',

    'warning-50': '#fffbeb',
    'warning-500': '#f59e0b',
    'warning-600': '#d97706',
    'warning-900': '#92400e',

    'error-50': '#fef2f2',
    'error-500': '#ef4444',
    'error-600': '#dc2626',
    'error-900': '#7f1d1d',

    'info-50': '#f0f9ff',
    'info-500': '#06b6d4',
    'info-600': '#0891b2',
    'info-900': '#164e63',
  },

  // Surface colors for better semantic meaning
  surface: {
    'background': 'var(--color-white)',
    'foreground': 'var(--color-gray-900)',
    'muted': 'var(--color-gray-50)',
    'subtle': 'var(--color-gray-100)',
    'border': 'var(--color-gray-200)',
    'border-strong': 'var(--color-gray-300)',
    'accent': 'var(--color-primary-500)',
    'accent-subtle': 'var(--color-primary-50)',
    'overlay': 'rgba(0, 0, 0, 0.5)',
  },

  // Typography scale with fluid sizing
  typography: {
    'font-sans': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'font-mono': '"SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace',

    'text-xs': 'clamp(0.75rem, 0.7rem + 0.2vw, 0.8rem)',    // 12-13px
    'text-sm': 'clamp(0.875rem, 0.8rem + 0.3vw, 0.95rem)',   // 14-15px
    'text-base': 'clamp(1rem, 0.9rem + 0.4vw, 1.1rem)',      // 16-18px
    'text-lg': 'clamp(1.125rem, 1rem + 0.5vw, 1.25rem)',     // 18-20px
    'text-xl': 'clamp(1.25rem, 1.1rem + 0.6vw, 1.4rem)',     // 20-22px
    'text-2xl': 'clamp(1.5rem, 1.3rem + 0.8vw, 1.75rem)',    // 24-28px
    'text-3xl': 'clamp(1.875rem, 1.6rem + 1vw, 2.2rem)',     // 30-35px
    'text-4xl': 'clamp(2.25rem, 1.9rem + 1.4vw, 2.8rem)',    // 36-45px

    'weight-normal': '400',
    'weight-medium': '500',
    'weight-semibold': '600',
    'weight-bold': '700',

    'leading-none': '1',
    'leading-tight': '1.25',
    'leading-snug': '1.375',
    'leading-normal': '1.5',
    'leading-relaxed': '1.625',
    'leading-loose': '2',

    'tracking-tighter': '-0.05em',
    'tracking-tight': '-0.025em',
    'tracking-normal': '0em',
    'tracking-wide': '0.025em',
    'tracking-wider': '0.05em',
    'tracking-widest': '0.1em',
  },

  // Border radius with semantic names
  radius: {
    'none': '0',
    'sm': '0.125rem',   // 2px
    'base': '0.25rem',  // 4px
    'md': '0.375rem',   // 6px
    'lg': '0.5rem',     // 8px
    'xl': '0.75rem',    // 12px
    '2xl': '1rem',      // 16px
    '3xl': '1.5rem',    // 24px
    'full': '9999px',
  },

  // Elevation system using modern shadows
  shadow: {
    'none': 'none',
    'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    'focus': '0 0 0 3px rgba(59, 130, 246, 0.4)',
  },

  // Animation tokens for consistent timing
  animation: {
    'duration-fast': '150ms',
    'duration-normal': '250ms',
    'duration-slow': '350ms',
    'duration-slower': '500ms',

    'ease-linear': 'linear',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Sizing tokens for consistent component dimensions
  size: {
    'button-xs': '1.5rem',   // 24px
    'button-sm': '2rem',     // 32px
    'button-md': '2.5rem',   // 40px
    'button-lg': '3rem',     // 48px
    'button-xl': '3.5rem',   // 56px

    'input-sm': '2rem',      // 32px
    'input-md': '2.5rem',    // 40px
    'input-lg': '3rem',      // 48px

    'icon-xs': '0.75rem',    // 12px
    'icon-sm': '1rem',       // 16px
    'icon-md': '1.25rem',    // 20px
    'icon-lg': '1.5rem',     // 24px
    'icon-xl': '2rem',       // 32px
  },
} as const;

/**
 * Generate CSS custom properties from design tokens
 */
export function generateTokenCSS(): string {
  const tokenDeclarations: string[] = [];

  Object.entries(DESIGN_TOKENS).forEach(([category, tokens]) => {
    Object.entries(tokens).forEach(([key, value]) => {
      tokenDeclarations.push(`--${category}-${key}: ${value};`);
    });
  });

  const css = `:root {
  ${tokenDeclarations.join('\n  ')}
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --surface-background: var(--color-gray-900);
    --surface-foreground: var(--color-gray-50);
    --surface-muted: var(--color-gray-800);
    --surface-subtle: var(--color-gray-700);
    --surface-border: var(--color-gray-600);
    --surface-border-strong: var(--color-gray-500);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --surface-border: var(--color-gray-900);
    --shadow-focus: 0 0 0 3px var(--color-primary-400);
  }
}`;

  return wrapInLayer('tokens', css);
}

/**
 * Utility function to reference design tokens
 */
export function token(category: keyof DesignTokens, key: string): string {
  return `var(--${category}-${key})`;
}

/**
 * Create semantic aliases for common token combinations
 */
export const SEMANTIC_TOKENS = {
  // Interactive states
  'interactive-bg': token('color', 'primary-500'),
  'interactive-bg-hover': token('color', 'primary-600'),
  'interactive-bg-active': token('color', 'primary-700'),
  'interactive-border': token('color', 'primary-300'),
  'interactive-text': token('color', 'white'),

  // Content hierarchy
  'content-primary': token('surface', 'foreground'),
  'content-secondary': token('color', 'gray-600'),
  'content-tertiary': token('color', 'gray-500'),
  'content-disabled': token('color', 'gray-400'),

  // Feedback states
  'feedback-success': token('color', 'success-500'),
  'feedback-warning': token('color', 'warning-500'),
  'feedback-error': token('color', 'error-500'),
  'feedback-info': token('color', 'info-500'),

  // Layout spacing
  'layout-gap-sm': token('space', '2'),
  'layout-gap-md': token('space', '4'),
  'layout-gap-lg': token('space', '6'),
  'layout-padding-sm': token('space', '3'),
  'layout-padding-md': token('space', '4'),
  'layout-padding-lg': token('space', '6'),
} as const;