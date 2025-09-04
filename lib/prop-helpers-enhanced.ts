// Simplified enhanced prop helpers that work directly with the existing system
// These return the actual values directly, no proxy magic needed

import { isPropHelper, type PropHelper } from "./prop-helpers.ts";

/**
 * Parse props using enhanced prop helpers
 * Automatically extracts values from prop helpers
 */
export function parseEnhancedProps<T extends Record<string, any>>(
  props: T,
  attrs: Record<string, string>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(props)) {
    if (isPropHelper(value)) {
      // Use the prop helper to parse the attribute
      try {
        result[key] = value.parse(attrs, key);
      } catch (error) {
        // Enhance error messages
        if (error instanceof Error) {
          const enhancedMessage = enhanceErrorMessage(error.message, key, attrs);
          throw new Error(enhancedMessage);
        }
        throw error;
      }
    } else {
      // Pass through non-helper values
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Enhance error messages with helpful context
 */
function enhanceErrorMessage(
  originalMessage: string,
  propName: string,
  attrs: Record<string, string>
): string {
  const availableAttrs = Object.keys(attrs);
  const kebabName = propName.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  
  // Check for common mistakes
  const suggestions: string[] = [];
  
  // Check for typos in attribute names
  const similarAttrs = availableAttrs.filter(attr => 
    levenshteinDistance(attr, kebabName) <= 2 ||
    levenshteinDistance(attr, propName) <= 2
  );
  
  if (similarAttrs.length > 0) {
    suggestions.push(`Did you mean: ${similarAttrs.join(", ")}?`);
  }
  
  // Check if prop exists but with wrong casing
  const wrongCase = availableAttrs.find(attr => 
    attr.toLowerCase() === kebabName.toLowerCase() ||
    attr.toLowerCase() === propName.toLowerCase()
  );
  
  if (wrongCase) {
    suggestions.push(`Found '${wrongCase}' - check the casing.`);
  }
  
  // Build enhanced message
  let enhancedMessage = originalMessage;
  
  if (suggestions.length > 0) {
    enhancedMessage += `\n💡 ${suggestions.join(" ")}`;
  }
  
  if (availableAttrs.length > 0) {
    enhancedMessage += `\n📋 Available attributes: ${availableAttrs.slice(0, 5).join(", ")}${
      availableAttrs.length > 5 ? ` (and ${availableAttrs.length - 5} more)` : ""
    }`;
  }
  
  return enhancedMessage;
}

/**
 * Simple Levenshtein distance for typo detection
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Create a render wrapper that automatically parses enhanced props
 */
export function withEnhancedProps<T extends Record<string, any>>(
  render: (props: T) => string
): (rawProps: T, api?: any, classes?: any) => string {
  return (rawProps: T, api?: any, classes?: any) => {
    // Check if any props are PropHelpers
    const hasHelpers = Object.values(rawProps).some(isPropHelper);
    
    if (hasHelpers) {
      // Extract attrs from the raw props (for SSR context)
      const attrs = rawProps as unknown as Record<string, string>;
      const parsedProps = parseEnhancedProps(rawProps, attrs) as T;
      return render(parsedProps);
    }
    
    // No helpers, pass through as-is
    return render(rawProps);
  };
}