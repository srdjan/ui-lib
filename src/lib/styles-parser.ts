// Unified styles parser - extracts class names from CSS selectors or JS style objects
export type UnifiedStyles = Record<string, string | Record<string, string>>;
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
    const className = kebabCase(key);

    if (typeof cssRule === "object" && cssRule !== null) {
      // Object form: serialize to CSS declarations
      classMap[key] = className;
      cssRules.push(`.${className} { ${serializeCssObject(cssRule)} }`);
      continue;
    }

    const cssText = cssRule.trim();
    // New string format: just CSS properties inside braces
    if (cssText.startsWith("{") && cssText.endsWith("}")) {
      classMap[key] = className;
      cssRules.push(`.${className} ${cssText}`);
      continue;
    }

    // Legacy selector format: extract class name
    const classMatch = cssText.match(/\.([a-zA-Z][a-zA-Z0-9-_]*)/);
    if (classMatch) {
      classMap[key] = classMatch[1];
      cssRules.push(cssText);
    } else {
      console.warn(
        `No class selector found in CSS rule for key "${key}": ${cssText}`,
      );
      cssRules.push(cssText);
    }
  }

  return {
    classMap,
    combinedCss: cssRules.join("\n    "),
  };
}

/**
 * Convert camelCase/PascalCase to kebab-case
 */
function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

// Serialize a JS style object { backgroundColor: 'red' } to CSS declarations
function serializeCssObject(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([prop, value]) => `${cssPropToKebab(prop)}: ${value};`)
    .join(" ");
}

function cssPropToKebab(prop: string): string {
  return prop
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/^ms-/, "-ms-")
    .toLowerCase();
}

/**
 * Type guard to check if styles is the new unified format
 */
export function isUnifiedStyles(styles: unknown): styles is UnifiedStyles {
  return (
    typeof styles === "object" &&
    styles !== null &&
    !Array.isArray(styles) &&
    Object.values(styles).every((value) =>
      typeof value === "string" || (typeof value === "object" && value !== null && !Array.isArray(value))
    )
  );
}
