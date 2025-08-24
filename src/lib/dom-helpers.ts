// Helper utilities for DOM-native state management

/**
 * Spread HTMX attributes into HTML string format
 * @param attrs - Object containing HTMX attributes
 * @returns Formatted attribute string for HTML
 */
export const spreadAttrs = (attrs: Record<string, unknown> = {}): string => {
  return Object.entries(attrs)
    .map(([key, value]) => `${key}="${String(value).replace(/