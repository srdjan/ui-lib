// Modern CSS Architecture Demo
// Shows how to migrate existing components and use the new system

import { css, dev, ModernCSS } from '../lib/modern-css.ts';
import { modernCSS, cssUtils } from '../lib/modern-css-system.ts';
import { token } from '../lib/styles/design-tokens.ts';

// Initialize the modern CSS system
dev.init();

/**
 * Example 1: Migrating the existing Button component
 */
console.log('=== Example 1: Button Component Migration ===');

// Current button styles (from the existing codebase)
const legacyButtonStyles = {
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontWeight: "500",
    fontSize: "0.875rem",
    lineHeight: "1.25",
    borderRadius: "0.375rem",
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "all 250ms cubic-bezier(0, 0, 0.2, 1)",
    textDecoration: "none",
    userSelect: "none",
    whiteSpace: "nowrap",

    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.4)",
    },

    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.6,
    },
  },
};

// Migrate to modern system
const { styles: modernButtonStyles, report } = css.migrate('button', legacyButtonStyles);

console.log('Migration Report:', {
  tokenReplacements: report.tokenReplacementCount,
  modernizationScore: report.modernizationScore,
  warnings: report.warnings,
});

console.log('Modern Button CSS:', modernButtonStyles.css);

/**
 * Example 2: Creating a new component with modern architecture
 */
console.log('\n=== Example 2: Modern Card Component ===');

const modernCardStyles = css.component('card', {
  container: {
    backgroundColor: token('surface', 'background'),
    border: `1px solid ${token('surface', 'border')}`,
    borderRadius: token('radius', 'lg'),
    boxShadow: token('shadow', 'sm'),
    padding: token('space', '6'),
    containerType: 'inline-size',
    contain: 'layout style paint',

    // Modern hover with reduced motion support
    ...cssUtils.reducedMotion(
      {
        transition: `all ${token('animation', 'duration-normal')} ${token('animation', 'ease-out')}`,
        '&:hover': {
          boxShadow: token('shadow', 'md'),
          borderColor: token('surface', 'border-strong'),
        },
      },
      {
        transition: 'none',
      }
    ),

    // Container queries for responsive design
    '@container': {
      '(min-width: 300px)': {
        padding: token('space', '8'),
      },
      '(min-width: 500px)': {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: token('space', '6'),
      },
    },

    // Modern focus management
    ...cssUtils.focusVisible({
      outline: `2px solid ${token('color', 'primary-500')}`,
      outlineOffset: '2px',
    }),
  },

  header: {
    marginBlockEnd: token('space', '4'),

    '@container': {
      '(min-width: 500px)': {
        marginBlockEnd: 0,
      },
    },
  },

  title: {
    fontSize: token('typography', 'text-xl'),
    fontWeight: token('typography', 'weight-bold'),
    lineHeight: token('typography', 'leading-tight'),
    color: token('surface', 'foreground'),
    marginBlockEnd: token('space', '2'),
  },

  description: {
    fontSize: token('typography', 'text-sm'),
    color: token('color', 'gray-600'),
    lineHeight: token('typography', 'leading-normal'),
  },

  content: {
    fontSize: token('typography', 'text-base'),
    lineHeight: token('typography', 'leading-relaxed'),
    color: token('surface', 'foreground'),
  },
});

console.log('Modern Card Component:', {
  classMap: modernCardStyles.classMap,
  cssLength: modernCardStyles.css.length,
});

/**
 * Example 3: Responsive Component with Container Queries
 */
console.log('\n=== Example 3: Responsive Grid Component ===');

const responsiveGridStyles = css.responsive('grid', {
  grid: {
    display: 'grid',
    gap: token('space', '4'),
    containerType: 'inline-size',

    // Base: Single column
    gridTemplateColumns: '1fr',

    // Container query breakpoints
    '@container': {
      '(min-width: 400px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: token('space', '6'),
      },
      '(min-width: 600px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: token('space', '8'),
      },
      '(min-width: 800px)': {
        gridTemplateColumns: 'repeat(4, 1fr)',
      },
    },

    // Support for CSS Grid features with fallback
    '@supports': {
      '(display: subgrid)': {
        '& > .grid-item': {
          display: 'grid',
          gridTemplateRows: 'subgrid',
        },
      },
    },
  },

  item: {
    backgroundColor: token('surface', 'background'),
    border: `1px solid ${token('surface', 'border')}`,
    borderRadius: token('radius', 'md'),
    padding: token('space', '4'),

    // Intrinsic sizing for content-driven layout
    containerType: 'inline-size',
    minHeight: 'fit-content',

    // Modern layout features
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gap: token('space', '3'),

    ...cssUtils.focusVisible({
      outline: `2px solid ${token('color', 'primary-500')}`,
      outlineOffset: '2px',
    }),
  },
});

console.log('Responsive Grid Component:', {
  classMap: responsiveGridStyles.classMap,
  hasContainerQueries: responsiveGridStyles.css.includes('@container'),
});

/**
 * Example 4: Component with Variants and States
 */
console.log('\n=== Example 4: Alert Component with Variants ===');

const modernAlertStyles = modernCSS({
  layer: 'components',
  styles: {
    alert: {
      position: 'relative',
      padding: token('space', '4'),
      borderRadius: token('radius', 'md'),
      border: '1px solid',
      fontSize: token('typography', 'text-sm'),
      lineHeight: token('typography', 'leading-normal'),
      display: 'flex',
      gap: token('space', '3'),
      alignItems: 'flex-start',

      // Base neutral variant
      backgroundColor: token('color', 'gray-50'),
      borderColor: token('color', 'gray-200'),
      color: token('color', 'gray-900'),

      '& [data-alert-icon]': {
        flexShrink: 0,
        fontSize: token('typography', 'text-lg'),
      },

      '& [data-alert-title]': {
        fontWeight: token('typography', 'weight-semibold'),
        marginBlockEnd: token('space', '1'),
      },
    },

    // Semantic variants using data attributes
    'alert[data-variant="success"]': {
      backgroundColor: token('color', 'success-50'),
      borderColor: token('color', 'success-200'),
      color: token('color', 'success-900'),
    },

    'alert[data-variant="warning"]': {
      backgroundColor: token('color', 'warning-50'),
      borderColor: token('color', 'warning-200'),
      color: token('color', 'warning-900'),
    },

    'alert[data-variant="error"]': {
      backgroundColor: token('color', 'error-50'),
      borderColor: token('color', 'error-200'),
      color: token('color', 'error-900'),
    },

    // Size variants
    'alert[data-size="sm"]': {
      padding: token('space', '3'),
      fontSize: token('typography', 'text-xs'),
    },

    'alert[data-size="lg"]': {
      padding: token('space', '6'),
      fontSize: token('typography', 'text-base'),
    },

    // Interactive states
    'alert[data-closable="true"]': {
      paddingInlineEnd: token('space', '12'), // Make room for close button
    },

    closeButton: {
      position: 'absolute',
      top: token('space', '2'),
      insetInlineEnd: token('space', '2'),
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: token('space', '1'),
      borderRadius: token('radius', 'sm'),
      fontSize: token('typography', 'text-sm'),
      lineHeight: 1,
      color: 'currentColor',
      opacity: 0.7,

      ...cssUtils.focusVisible({
        opacity: 1,
        outline: `2px solid currentColor`,
        outlineOffset: '2px',
      }),

      '&:hover': {
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
});

console.log('Alert Component with Variants:', {
  hasVariants: modernAlertStyles.css.includes('data-variant'),
  hasStates: modernAlertStyles.css.includes('data-closable'),
  supportsRTL: modernAlertStyles.css.includes('inset-inline'),
});

/**
 * Example 5: Performance and Bundle Analysis
 */
console.log('\n=== Example 5: Bundle Analysis ===');

// Get development bundle stats
const devStats = dev.stats('development');
console.log('Development Bundle Stats:', {
  totalSize: `${Math.round(devStats.totalSize / 1024)}KB`,
  gzippedSize: `${Math.round(devStats.gzippedSize / 1024)}KB`,
  layers: devStats.layers,
});

// Get production bundle stats
const prodStats = dev.stats('production');
console.log('Production Bundle Stats:', {
  totalSize: `${Math.round(prodStats.totalSize / 1024)}KB`,
  gzippedSize: `${Math.round(prodStats.gzippedSize / 1024)}KB`,
  compressionRatio: `${Math.round((1 - prodStats.gzippedSize / prodStats.totalSize) * 100)}%`,
});

// Get critical CSS
const criticalCSS = css.critical();
console.log('Critical CSS Size:', `${Math.round(criticalCSS.length / 1024)}KB`);

/**
 * Example 6: Usage in SSR Context
 */
console.log('\n=== Example 6: SSR Integration ===');

// Generate complete stylesheet for SSR
const ssrStylesheet = dev.stylesheet();
console.log('SSR Stylesheet:', {
  size: `${Math.round(ssrStylesheet.length / 1024)}KB`,
  hasLayers: ssrStylesheet.includes('@layer'),
  hasTokens: ssrStylesheet.includes('--color-'),
  hasUtilities: ssrStylesheet.includes('.u-'),
  hasComponents: ssrStylesheet.includes('.alert'),
});

// Example HTML generation with modern CSS
function generateCardHTML(props: { title: string; content: string }): string {
  return `
    <div class="${modernCardStyles.classMap.container}" data-component="card">
      <header class="${modernCardStyles.classMap.header}">
        <h2 class="${modernCardStyles.classMap.title}">${props.title}</h2>
      </header>
      <div class="${modernCardStyles.classMap.content}">
        ${props.content}
      </div>
    </div>
  `;
}

console.log('Generated Card HTML:', generateCardHTML({
  title: 'Modern CSS Card',
  content: 'This card uses container queries, design tokens, and semantic CSS architecture.'
}));

/**
 * Example 7: Development Tools
 */
console.log('\n=== Example 7: Development Features ===');

// Enable debugging features (would add visual debugging in browser)
if (typeof window !== 'undefined') {
  dev.debug();
  console.log('CSS debugging enabled. Call toggleCSSDebug() in the browser console.');
}

// Log the complete modern CSS bundle for inspection
console.log('\n=== Complete Modern CSS Bundle ===');
console.log(css.bundle('development'));

export {
  modernButtonStyles,
  modernCardStyles,
  responsiveGridStyles,
  modernAlertStyles,
  generateCardHTML,
};