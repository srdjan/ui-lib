// Typography system for ui-lib
// Provides font loading, utility classes, and typography presets

/**
 * Generates @font-face declarations for variable fonts
 * Uses Google Fonts CDN for Inter (supports variable font)
 *
 * Note: Cal Sans is a premium font - would need to be self-hosted
 * For now, we'll use Inter for both sans and display
 */
export function getFontFaceCSS(): string {
  return `/* Variable Font Loading - Optimized for Performance */

/* Inter Variable Font - Primary Typeface */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 900;
  font-display: swap;
  src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300..900&display=swap');
  /* Variable font reduces file size significantly vs loading individual weights */
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* JetBrains Mono - Monospace Font for Code */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300..800&display=swap');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Preload hint for critical fonts */
/* Note: This should be added to <head> in HTML, but we document it here */
/*
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
*/`;
}

/**
 * Typography utility classes for common text styles
 * These provide semantic, ready-to-use text formatting
 */
export function getTypographyUtilities(): string {
  return `
/* Typography Utility Classes */

/* Semantic text sizes with fluid scaling */
.text-xs { font-size: var(--typography-text-xs); }
.text-sm { font-size: var(--typography-text-sm); }
.text-base { font-size: var(--typography-text-base); }
.text-lg { font-size: var(--typography-text-lg); }
.text-xl { font-size: var(--typography-text-xl); }
.text-2xl { font-size: var(--typography-text-2xl); }
.text-3xl { font-size: var(--typography-text-3xl); }
.text-4xl { font-size: var(--typography-text-4xl); }
.text-5xl { font-size: var(--typography-text-5xl); }

/* Font weights */
.font-light { font-weight: var(--typography-weight-light); }
.font-normal { font-weight: var(--typography-weight-normal); }
.font-medium { font-weight: var(--typography-weight-medium); }
.font-semibold { font-weight: var(--typography-weight-semibold); }
.font-bold { font-weight: var(--typography-weight-bold); }
.font-extrabold { font-weight: var(--typography-weight-extrabold); }
.font-black { font-weight: var(--typography-weight-black); }

/* Line heights */
.leading-none { line-height: 1; }
.leading-tight { line-height: var(--typography-line-height-tight); }
.leading-normal { line-height: var(--typography-line-height-normal); }
.leading-relaxed { line-height: var(--typography-line-height-relaxed); }

/* Letter spacing */
.tracking-tighter { letter-spacing: var(--typography-letter-spacing-tighter); }
.tracking-tight { letter-spacing: var(--typography-letter-spacing-tight); }
.tracking-normal { letter-spacing: var(--typography-letter-spacing-normal); }
.tracking-wide { letter-spacing: var(--typography-letter-spacing-wide); }
.tracking-wider { letter-spacing: var(--typography-letter-spacing-wider); }
.tracking-widest { letter-spacing: var(--typography-letter-spacing-widest); }

/* Font families */
.font-sans { font-family: var(--typography-font-sans); }
.font-display { font-family: var(--typography-font-display); }
.font-mono { font-family: var(--typography-font-mono); }

/* Text alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }

/* Text transform */
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }
.normal-case { text-transform: none; }

/* Text decoration */
.underline { text-decoration: underline; }
.line-through { text-decoration: line-through; }
.no-underline { text-decoration: none; }

/* Text overflow */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

/* Text colors */
.text-primary { color: var(--color-primary); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }
.text-muted { color: var(--color-on-surface-variant); }
.text-disabled { color: var(--color-disabled); }`;
}

/**
 * Semantic typography presets for common use cases
 * These combine multiple properties for complete text styling
 */
export function getTypographyPresets(): string {
  return `
/* Typography Presets - Ready-to-use Semantic Styles */

/* Display text - Hero headings */
.display-1 {
  font-family: var(--typography-font-display);
  font-size: var(--typography-text-5xl);
  font-weight: var(--typography-weight-black);
  line-height: var(--typography-line-height-tight);
  letter-spacing: var(--typography-letter-spacing-tighter);
}

.display-2 {
  font-family: var(--typography-font-display);
  font-size: var(--typography-text-4xl);
  font-weight: var(--typography-weight-extrabold);
  line-height: var(--typography-line-height-tight);
  letter-spacing: var(--typography-letter-spacing-tight);
}

/* Headings - Standard hierarchy */
.heading-1 {
  font-size: var(--typography-text-3xl);
  font-weight: var(--typography-weight-bold);
  line-height: var(--typography-line-height-tight);
  letter-spacing: var(--typography-letter-spacing-tight);
}

.heading-2 {
  font-size: var(--typography-text-2xl);
  font-weight: var(--typography-weight-semibold);
  line-height: var(--typography-line-height-tight);
}

.heading-3 {
  font-size: var(--typography-text-xl);
  font-weight: var(--typography-weight-semibold);
  line-height: var(--typography-line-height-normal);
}

.heading-4 {
  font-size: var(--typography-text-lg);
  font-weight: var(--typography-weight-medium);
  line-height: var(--typography-line-height-normal);
}

/* Body text variants */
.body-large {
  font-size: var(--typography-text-lg);
  font-weight: var(--typography-weight-normal);
  line-height: var(--typography-line-height-relaxed);
}

.body-base {
  font-size: var(--typography-text-base);
  font-weight: var(--typography-weight-normal);
  line-height: var(--typography-line-height-normal);
}

.body-small {
  font-size: var(--typography-text-sm);
  font-weight: var(--typography-weight-normal);
  line-height: var(--typography-line-height-normal);
}

/* UI text - Interface elements */
.label {
  font-size: var(--typography-text-sm);
  font-weight: var(--typography-weight-medium);
  line-height: var(--typography-line-height-normal);
  letter-spacing: var(--typography-letter-spacing-wide);
}

.caption {
  font-size: var(--typography-text-xs);
  font-weight: var(--typography-weight-normal);
  line-height: var(--typography-line-height-normal);
  color: var(--color-on-surface-variant);
}

.overline {
  font-size: var(--typography-text-xs);
  font-weight: var(--typography-weight-semibold);
  line-height: var(--typography-line-height-normal);
  letter-spacing: var(--typography-letter-spacing-widest);
  text-transform: uppercase;
}

/* Code text */
.code-inline {
  font-family: var(--typography-font-mono);
  font-size: 0.9em;
  padding: 0.125rem 0.25rem;
  background-color: var(--color-surface-variant);
  border-radius: var(--radius-sm);
}

.code-block {
  font-family: var(--typography-font-mono);
  font-size: var(--typography-text-sm);
  line-height: var(--typography-line-height-relaxed);
  padding: var(--space-4);
  background-color: var(--color-surface-variant);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

/* Prose - Optimized for reading */
.prose {
  font-size: var(--typography-text-base);
  line-height: var(--typography-line-height-relaxed);
  max-width: 65ch;
}

.prose h1 { composes: heading-1; margin-top: var(--space-8); margin-bottom: var(--space-4); }
.prose h2 { composes: heading-2; margin-top: var(--space-6); margin-bottom: var(--space-3); }
.prose h3 { composes: heading-3; margin-top: var(--space-5); margin-bottom: var(--space-2); }
.prose h4 { composes: heading-4; margin-top: var(--space-4); margin-bottom: var(--space-2); }

.prose p { margin-bottom: var(--space-4); }
.prose ul, .prose ol { margin-left: var(--space-6); margin-bottom: var(--space-4); }
.prose li { margin-bottom: var(--space-2); }
.prose code { composes: code-inline; }
.prose pre { composes: code-block; margin-bottom: var(--space-4); }

/* Link styles */
.link {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color var(--animation-duration-fast) var(--animation-ease-out);
}

.link:hover {
  text-decoration-color: var(--color-primary);
}

.link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}`;
}

/**
 * Complete typography CSS bundle
 * Includes font loading, utilities, and presets
 */
export function getTypographyCSS(): string {
  return `${getFontFaceCSS()}

${getTypographyUtilities()}

${getTypographyPresets()}`;
}
