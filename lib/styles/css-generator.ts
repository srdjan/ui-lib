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
  font-family: var(--typography-font-sans);
  font-size: var(--typography-text-base);
  line-height: var(--typography-line-height-normal);
  color: var(--color-on-background);
  background-color: var(--color-background);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  margin: 0 0 var(--space-4, 1rem) 0;
  font-weight: var(--typography-weight-semibold);
  line-height: var(--typography-line-height-tight);
  color: var(--color-on-background);
}

h1 { font-size: var(--typography-text-3xl); font-weight: var(--typography-weight-bold); }
h2 { font-size: var(--typography-text-2xl); }
h3 { font-size: var(--typography-text-xl); }
h4 { font-size: var(--typography-text-lg); }

p {
  margin: 0 0 var(--space-4, 1rem) 0;
  color: var(--color-on-surface);
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
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

button {
  cursor: pointer;
  padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
  border: 1px solid transparent;
  border-radius: var(--radius-md, 0.375rem);
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: var(--typography-weight-medium);
  transition: all var(--animation-duration-normal) var(--animation-ease-smooth);
}

button:hover {
  background-color: var(--color-primary-container);
  transform: translateY(-1px);
}

button:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}

label {
  display: block;
  margin-bottom: var(--space-2, 0.5rem);
  font-weight: 500;
  color: var(--color-gray-700, #374151);
}

/* Form Groups */
form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4, 1rem);
}

form > * {
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2, 0.5rem);
}

.form-row {
  display: flex;
  gap: var(--space-3, 0.75rem);
  align-items: flex-end;
}

.form-row > * {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: var(--space-3, 0.75rem);
  justify-content: flex-end;
  margin-top: var(--space-4, 1rem);
}

/* Filter Tabs & Navigation */
.filter-tabs {
  display: flex;
  gap: var(--space-2, 0.5rem);
  border-bottom: 2px solid var(--surface-border, #e5e7eb);
  margin-bottom: var(--space-6, 1.5rem);
}

.filter-tab {
  padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-gray-600, #4b5563);
  font-weight: var(--typography-weight-medium, 500);
  cursor: pointer;
  transition: all var(--animation-duration-fast, 150ms) var(--animation-ease-smooth, ease);
  margin-bottom: -2px;
}

.filter-tab:hover {
  color: var(--color-primary, #6366f1);
  background-color: var(--color-primary-50, #eef2ff);
}

.filter-tab.active {
  color: var(--color-primary, #6366f1);
  border-bottom-color: var(--color-primary, #6366f1);
}

/* App Header */
.app-header {
  text-align: center;
  padding: var(--space-8, 2rem) 0 var(--space-6, 1.5rem);
}

.app-title {
  margin: 0;
  color: var(--color-primary, #6366f1);
  font-size: var(--typography-text-4xl, 2.25rem);
  font-weight: var(--typography-weight-bold, 700);
}

.app-subtitle {
  margin: 0;
  color: var(--color-gray-600, #4b5563);
  font-size: var(--typography-text-lg, 1.125rem);
}

/* Section Headers */
.section-header {
  margin: 0;
  font-size: var(--typography-text-lg, 1.125rem);
  font-weight: var(--typography-weight-semibold, 600);
}

/* Stack Component */
.stack {
  display: flex;
}

.stack--vertical {
  flex-direction: column;
}

.stack--horizontal {
  flex-direction: row;
}

.stack--gap-xs { gap: var(--space-1, 0.25rem); }
.stack--gap-sm { gap: var(--space-2, 0.5rem); }
.stack--gap-md { gap: var(--space-4, 1rem); }
.stack--gap-lg { gap: var(--space-6, 1.5rem); }
.stack--gap-xl { gap: var(--space-8, 2rem); }

.stack--align-center { align-items: center; }
.stack--align-start { align-items: flex-start; }
.stack--align-end { align-items: flex-end; }

.stack--justify-center { justify-content: center; }
.stack--justify-start { justify-content: flex-start; }
.stack--justify-end { justify-content: flex-end; }
.stack--justify-between { justify-content: space-between; }

/* Todo List */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3, 0.75rem);
}

.empty-state {
  padding: var(--space-8, 2rem);
  text-align: center;
  color: var(--color-gray-500, #6b7280);
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

/* Card Component - Enhanced with modern interactions */
.card {
  background-color: var(--surface-background, #ffffff);
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: var(--radius-lg, 0.5rem);
  padding: var(--space-6, 1.5rem);
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
  margin-bottom: var(--space-4, 1rem);
  transition: all var(--animation-duration-normal, 250ms) var(--animation-ease-smooth, ease),
              transform var(--animation-duration-fast, 150ms) var(--animation-ease-spring, ease);
  position: relative;
  overflow: hidden;
}

.card__header {
  margin-bottom: var(--space-4, 1rem);
}

.card__title {
  font-size: var(--typography-text-lg, 1.25rem);
  font-weight: 600;
  color: var(--color-gray-900, #111827);
  margin-top: 0;
  margin-bottom: var(--space-2, 0.5rem);
}

.card__subtitle {
  font-size: var(--typography-text-sm, 0.875rem);
  color: var(--color-gray-600, #6b7280);
  margin: 0;
}

.card__content {
  color: var(--color-gray-700, #374151);
}

/* Card Variants */
.card--elevated {
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  border: none;
}

.card--elevated:hover {
  box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  transform: translateY(-2px);
}

.card--outlined {
  background-color: transparent;
  border: 2px solid var(--surface-border, #e5e7eb);
  box-shadow: none;
}

.card--filled {
  background-color: var(--color-gray-50, #f9fafb);
  border: none;
  box-shadow: none;
}

/* Interactive Cards */
.card--interactive {
  cursor: pointer;
  user-select: none;
}

.card--interactive::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, var(--color-primary-50, #eef2ff) 100%);
  opacity: 0;
  transition: opacity var(--animation-duration-normal, 250ms) var(--animation-ease-out, ease);
  pointer-events: none;
}

.card--interactive:hover {
  border-color: var(--color-primary-200, #c7d2fe);
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  transform: translateY(-2px);
}

.card--interactive:hover::before {
  opacity: 0.3;
}

.card--interactive:active {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.card--interactive:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus, 0 0 0 3px rgba(99, 102, 241, 0.12));
  border-color: var(--color-primary-500, #6366f1);
}

/* Card Sizes */
.card--sm {
  padding: var(--space-4, 1rem);
}

.card--md {
  padding: var(--space-6, 1.5rem);
}

.card--lg {
  padding: var(--space-8, 2rem);
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

/* Container Component */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4, 1rem);
  padding-right: var(--space-4, 1rem);
}

.container[data-size="sm"] { max-width: var(--container-sm, 640px); }
.container[data-size="md"] { max-width: var(--container-md, 768px); }
.container[data-size="lg"] { max-width: var(--container-lg, 1024px); }
.container[data-size="xl"] { max-width: var(--container-xl, 1280px); }
.container[data-size="2xl"] { max-width: var(--container-2xl, 1536px); }
.container[data-size="full"] { max-width: 100%; }

/* Container class-based sizes */
.container--sm { max-width: var(--container-sm, 640px); }
.container--md { max-width: 80vw; }
.container--lg { max-width: var(--container-lg, 1024px); }
.container--xl { max-width: var(--container-xl, 1280px); }
.container--2xl { max-width: var(--container-2xl, 1536px); }
.container--full { max-width: 100%; }

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
