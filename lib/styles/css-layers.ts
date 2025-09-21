// Modern CSS cascade layers architecture for ui-lib
// Implements a sophisticated layered CSS system with clear API boundaries

/**
 * CSS Cascade Layers Strategy
 *
 * 1. reset - Minimal, orthogonal browser normalization
 * 2. tokens - Design tokens as CSS custom properties (public but non-breaking)
 * 3. utilities - Private .u-* prefixed layout primitives (internal use only)
 * 4. components - Public semantic classes (.card, .alert, etc.)
 * 5. overrides - Consumer escape hatch for customization
 */

export type CSSLayer = 'reset' | 'tokens' | 'utilities' | 'components' | 'overrides';

export interface LayerConfig {
  readonly name: CSSLayer;
  readonly order: number;
  readonly description: string;
  readonly isPublicAPI: boolean;
}

export const CSS_LAYERS: Record<CSSLayer, LayerConfig> = {
  reset: {
    name: 'reset',
    order: 1,
    description: 'Minimal, orthogonal browser normalization',
    isPublicAPI: false,
  },
  tokens: {
    name: 'tokens',
    order: 2,
    description: 'Design tokens as CSS custom properties',
    isPublicAPI: true,
  },
  utilities: {
    name: 'utilities',
    order: 3,
    description: 'Private .u-* prefixed layout primitives',
    isPublicAPI: false,
  },
  components: {
    name: 'components',
    order: 4,
    description: 'Public semantic component classes',
    isPublicAPI: true,
  },
  overrides: {
    name: 'overrides',
    order: 5,
    description: 'Consumer escape hatch for customization',
    isPublicAPI: true,
  },
} as const;

/**
 * Generate CSS layer declaration
 */
export function generateLayerDeclaration(): string {
  const layerNames = Object.values(CSS_LAYERS)
    .sort((a, b) => a.order - b.order)
    .map(layer => layer.name)
    .join(', ');

  return `@layer ${layerNames};`;
}

/**
 * Wrap CSS rules in appropriate layer
 */
export function wrapInLayer(layer: CSSLayer, css: string): string {
  if (!css.trim()) return '';

  return `@layer ${layer} {
  ${css}
}`;
}

/**
 * Create utility class with proper naming and zero specificity
 */
export function createUtility(name: string, styles: string): string {
  const className = name.startsWith('u-') ? name : `u-${name}`;

  return wrapInLayer('utilities', `:where(.${className}) {
  ${styles}
}`);
}

/**
 * Create component styles with semantic class names
 */
export function createComponent(name: string, styles: string): string {
  return wrapInLayer('components', `.${name} {
  ${styles}
}`);
}

/**
 * Reset layer - minimal orthogonal normalization
 */
export const CSS_RESET = wrapInLayer('reset', `
/* Modern CSS Reset - Minimal orthogonal normalization */
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

#root, #__next {
  isolation: isolate;
}

/* Focus-visible for better keyboard navigation */
:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`);

/**
 * Utility classes - Layout primitives with zero specificity
 */
export const UTILITY_CLASSES = [
  createUtility('stack', `
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: var(--space-4, 1rem);
  `),

  createUtility('cluster', `
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4, 1rem);
    justify-content: flex-start;
    align-items: center;
  `),

  createUtility('center', `
    box-sizing: content-box;
    margin-inline: auto;
    max-inline-size: var(--measure, 60ch);
    padding-inline-start: var(--space-4, 1rem);
    padding-inline-end: var(--space-4, 1rem);
  `),

  createUtility('sidebar', `
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4, 1rem);
    align-items: stretch;
  `),

  createUtility('sidebar > :first-child', `
    flex-basis: var(--sidebar-width, 20rem);
    flex-grow: 1;
  `),

  createUtility('sidebar > :last-child', `
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: var(--sidebar-content-min, 50%);
  `),

  createUtility('switcher', `
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4, 1rem);
    align-items: stretch;
  `),

  createUtility('switcher > *', `
    flex-grow: 1;
    flex-basis: calc((var(--switcher-target, 30rem) - 100%) * 999);
  `),

  createUtility('cover', `
    display: flex;
    flex-direction: column;
    min-block-size: var(--cover-height, 100vh);
    padding: var(--space-4, 1rem);
  `),

  createUtility('cover > *', `
    margin-block: var(--space-4, 1rem);
  `),

  createUtility('cover > :first-child:not(.centered)', `
    margin-block-start: 0;
  `),

  createUtility('cover > :last-child:not(.centered)', `
    margin-block-end: 0;
  `),

  createUtility('cover > .centered', `
    margin-block: auto;
  `),

  createUtility('grid', `
    display: grid;
    gap: var(--space-4, 1rem);
    grid-template-columns: repeat(
      auto-fit,
      minmax(var(--grid-min, 16rem), 1fr)
    );
  `),

  createUtility('visually-hidden', `
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  `),
].join('\n\n');