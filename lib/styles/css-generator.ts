/**
 * CSS Generator Utility
 * Combines design tokens and component styles into a single CSS bundle
 */

import { DESIGN_TOKENS } from "./design-tokens.ts";
import type { DesignTokens } from "./design-tokens.ts";

/**
 * Generate CSS custom properties from design tokens
 */
function generateCSSCustomProperties(tokens: DesignTokens): string {
  const cssProps: string[] = [];

  // Generate space tokens
  Object.entries(tokens.space).forEach(([key, value]) => {
    cssProps.push(`  --space-${key}: ${value};`);
  });

  // Generate color tokens
  Object.entries(tokens.color).forEach(([key, value]) => {
    cssProps.push(`  --color-${key}: ${value};`);
  });

  // Generate surface tokens
  Object.entries(tokens.surface).forEach(([key, value]) => {
    cssProps.push(`  --surface-${key}: ${value};`);
  });

  // Generate typography tokens
  Object.entries(tokens.typography).forEach(([key, value]) => {
    cssProps.push(`  --typography-${key}: ${value};`);
  });

  // Generate radius tokens
  Object.entries(tokens.radius).forEach(([key, value]) => {
    cssProps.push(`  --radius-${key}: ${value};`);
  });

  // Generate shadow tokens
  Object.entries(tokens.shadow).forEach(([key, value]) => {
    cssProps.push(`  --shadow-${key}: ${value};`);
  });

  // Generate animation tokens
  Object.entries(tokens.animation).forEach(([key, value]) => {
    cssProps.push(`  --animation-${key}: ${value};`);
  });

  // Generate size tokens
  Object.entries(tokens.size).forEach(([key, value]) => {
    cssProps.push(`  --size-${key}: ${value};`);
  });

  return `:root {\n${cssProps.join("\n")}\n}`;
}

/**
 * Generate base CSS styles for the application
 */
function generateBaseStyles(): string {
  return `
/* Base Styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  line-height: 1.6;
  color: var(--color-gray-900, #111827);
  background-color: var(--surface-background, #ffffff);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  margin: 0 0 var(--space-4, 1rem) 0;
  font-weight: 600;
  line-height: 1.25;
}

h1 { font-size: var(--typography-text-2xl, 1.875rem); }
h2 { font-size: var(--typography-text-xl, 1.5rem); }
h3 { font-size: var(--typography-text-lg, 1.25rem); }

p {
  margin: 0 0 var(--space-4, 1rem) 0;
}

/* Layout Utilities */
.u-center {
  margin-left: auto;
  margin-right: auto;
}

.u-text-center {
  text-align: center;
}

/* Form Elements */
input, select, textarea, button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

input[type="text"],
input[type="email"],
input[type="password"],
select,
textarea {
  width: 100%;
  padding: var(--space-3, 0.75rem);
  border: 1px solid var(--surface-border, #d1d5db);
  border-radius: var(--radius-md, 0.375rem);
  background-color: var(--surface-background, #ffffff);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-blue-500, #3b82f6);
  box-shadow: 0 0 0 3px var(--color-blue-100, #dbeafe);
}

button {
  cursor: pointer;
  padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
  border: 1px solid transparent;
  border-radius: var(--radius-md, 0.375rem);
  background-color: var(--color-blue-500, #3b82f6);
  color: white;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
}

button:hover {
  background-color: var(--color-blue-600, #2563eb);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-blue-100, #dbeafe);
}

label {
  display: block;
  margin-bottom: var(--space-2, 0.5rem);
  font-weight: 500;
  color: var(--color-gray-700, #374151);
}
`;
}

/**
 * Generate component-specific CSS styles
 */
function generateComponentStyles(): string {
  return `
/* Page Component */
.page {
  min-height: 100vh;
  padding: var(--space-4, 1rem);
}

.page--constrained {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.page--narrow {
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
}

.page--wide {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.page--fluid {
  width: 100%;
}

/* Header Component */
.header {
  text-align: center;
  margin-bottom: var(--space-8, 2rem);
}

.header__title {
  font-size: var(--typography-text-2xl, 1.875rem);
  font-weight: 700;
  color: var(--color-gray-900, #111827);
  margin-bottom: var(--space-2, 0.5rem);
  margin-top: 0;
}

.header__subtitle {
  font-size: var(--typography-text-lg, 1.25rem);
  color: var(--color-gray-600, #4b5563);
  margin-bottom: var(--space-2, 0.5rem);
  margin-top: 0;
}

.header__description {
  font-size: var(--typography-text-base, 1rem);
  color: var(--color-gray-500, #6b7280);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  margin-top: 0;
}

/* Section Component */
.section {
  margin-bottom: var(--space-8, 2rem);
}

.section__title {
  font-size: var(--typography-text-xl, 1.5rem);
  font-weight: 600;
  color: var(--color-gray-900, #111827);
  margin-bottom: var(--space-4, 1rem);
  padding-bottom: var(--space-2, 0.5rem);
  border-bottom: 2px solid var(--surface-border, #e5e7eb);
}

/* Card Component */
.card {
  background-color: var(--surface-background, #ffffff);
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: var(--radius-lg, 0.5rem);
  padding: var(--space-6, 1.5rem);
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
  margin-bottom: var(--space-4, 1rem);
}

.card__title {
  font-size: var(--typography-text-lg, 1.25rem);
  font-weight: 600;
  color: var(--color-gray-900, #111827);
  margin-top: 0;
  margin-bottom: var(--space-4, 1rem);
}

/* Stack Component */
.stack {
  display: flex;
  flex-direction: column;
}

.stack > * + * {
  margin-top: var(--space-4, 1rem);
}

.stack[data-spacing="xs"] > * + * { margin-top: var(--space-1, 0.25rem); }
.stack[data-spacing="sm"] > * + * { margin-top: var(--space-2, 0.5rem); }
.stack[data-spacing="md"] > * + * { margin-top: var(--space-4, 1rem); }
.stack[data-spacing="lg"] > * + * { margin-top: var(--space-6, 1.5rem); }
.stack[data-spacing="xl"] > * + * { margin-top: var(--space-8, 2rem); }
.stack[data-spacing="2xl"] > * + * { margin-top: var(--space-12, 3rem); }

.stack[data-align="start"] { align-items: flex-start; }
.stack[data-align="center"] { align-items: center; }
.stack[data-align="end"] { align-items: flex-end; }
.stack[data-align="baseline"] { align-items: baseline; }

/* Grid Component */
.grid {
  display: grid;
  gap: var(--space-4, 1rem);
}

.grid--1 { grid-template-columns: 1fr; }
.grid--2 { grid-template-columns: repeat(2, 1fr); }
.grid--3 { grid-template-columns: repeat(3, 1fr); }
.grid--4 { grid-template-columns: repeat(4, 1fr); }
.grid--auto { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

.grid[data-gap="xs"] { gap: var(--space-1, 0.25rem); }
.grid[data-gap="sm"] { gap: var(--space-2, 0.5rem); }
.grid[data-gap="md"] { gap: var(--space-4, 1rem); }
.grid[data-gap="lg"] { gap: var(--space-6, 1.5rem); }
.grid[data-gap="xl"] { gap: var(--space-8, 2rem); }

/* Stat Component */
.stat {
  text-align: center;
  padding: var(--space-4, 1rem);
  background-color: var(--surface-background-subtle, #f9fafb);
  border-radius: var(--radius-md, 0.375rem);
  border: 1px solid var(--surface-border, #e5e7eb);
}

.stat__value {
  display: block;
  font-size: var(--typography-text-2xl, 1.875rem);
  font-weight: 700;
  color: var(--color-blue-600, #2563eb);
  line-height: 1;
  margin-bottom: var(--space-1, 0.25rem);
}

.stat__label {
  display: block;
  font-size: var(--typography-text-sm, 0.875rem);
  font-weight: 500;
  color: var(--color-gray-600, #4b5563);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat--primary .stat__value { color: var(--color-blue-600, #2563eb); }
.stat--success .stat__value { color: var(--color-green-600, #059669); }
.stat--warning .stat__value { color: var(--color-yellow-600, #d97706); }
.stat--danger .stat__value { color: var(--color-red-600, #dc2626); }

/* Item Component */
.item {
  display: flex;
  align-items: center;
  padding: var(--space-4, 1rem);
  background-color: var(--surface-background, #ffffff);
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: var(--radius-md, 0.375rem);
  margin-bottom: var(--space-2, 0.5rem);
}

.item__icon {
  margin-right: var(--space-3, 0.75rem);
}

.item__content {
  flex: 1;
}

.item__title {
  font-weight: 500;
  color: var(--color-gray-900, #111827);
  margin: 0 0 var(--space-1, 0.25rem) 0;
}

.item__meta {
  font-size: var(--typography-text-sm, 0.875rem);
  color: var(--color-gray-500, #6b7280);
}

.item__actions {
  display: flex;
  gap: var(--space-2, 0.5rem);
  margin-left: var(--space-4, 1rem);
}

.item__actions button {
  padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
  font-size: var(--typography-text-sm, 0.875rem);
}
`;
}

/**
 * Generate complete CSS bundle
 */
export function generateCSS(): string {
  const customProperties = generateCSSCustomProperties(DESIGN_TOKENS);
  const baseStyles = generateBaseStyles();
  const componentStyles = generateComponentStyles();

  return [
    customProperties,
    baseStyles,
    componentStyles,
  ].join("\n\n");
}
