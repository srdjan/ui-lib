// Unified styles parser - extracts class names from CSS selectors
export type UnifiedStyles = Record<string, string>;
export type ClassMap = Record<string, string>;

/**
 * Parses unified styles object and extracts class names and combined CSS
 */
export function parseUnifiedStyles(
  styles: UnifiedStyles,
): { classMap: ClassMap; combinedCss: string } {
  const classMap: ClassMap = {};
  const cssRules: string[] = [];

  for (const [key, cssRule] of Object.entries(styles)) {
    // Extract class name from CSS selector (first .class-name found)
    const classMatch = cssRule.match(/\.([a-zA-Z][a-zA-Z0-9-_]*)/);
    
    if (classMatch) {
      const className = classMatch[1];
      classMap[key] = className;
      cssRules.push(cssRule);
    } else {
      // If no class found, still add the CSS rule but warn
      console.warn(`No class selector found in CSS rule for key "${key}": ${cssRule}`);
      cssRules.push(cssRule);
    }
  }

  return {
    classMap,
    combinedCss: cssRules.join('\n    '),
  };
}

/**
 * Type guard to check if styles is the new unified format
 */
export function isUnifiedStyles(styles: unknown): styles is UnifiedStyles {
  return (
    typeof styles === 'object' &&
    styles !== null &&
    !Array.isArray(styles) &&
    Object.values(styles).every(value => typeof value === 'string')
  );
}