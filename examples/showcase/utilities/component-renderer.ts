/**
 * Component renderer utility for extracting styles and HTML from ui-lib components
 * Handles proper style extraction and rendering for showcase demos
 */

/**
 * Extract styles and HTML from component output
 */
export function extractComponentParts(componentHtml: string): {
  html: string;
  styles: string;
} {
  const styleMatch = componentHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
  const styles = styleMatch ? styleMatch.join('\n') : '';
  const html = componentHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '').trim();
  
  return { html, styles };
}

/**
 * Render component with proper style handling
 */
export function renderComponent(componentHtml: string): {
  html: string;
  styles: string;
} {
  return extractComponentParts(componentHtml);
}

/**
 * Create a style tag with component styles
 */
export function createStyleTag(styles: string): string {
  if (!styles) return '';
  return `<style>${styles}</style>`;
}

/**
 * Combined component and style renderer for showcase
 */
export function renderComponentWithStyles(componentHtml: string): string {
  const { html, styles } = renderComponent(componentHtml);
  return `${html}${createStyleTag(styles)}`;
}