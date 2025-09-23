// Component Factory System
// Creates sealed components that can only be customized via CSS variables

import type { ComponentTokens, TokenSet } from "./component-tokens.ts";
import { generateTokenVarName, tokensToCSS } from "./component-tokens.ts";

// Component definition with token contract
export type TokenComponentConfig<
  TTokens extends Record<string, TokenSet>,
  TProps = any,
> = {
  name: string;
  tokens: ComponentTokens<TTokens>;
  render: (props: TProps, cssVars: TokenVarMap<TTokens>) => string;
  // Optional static styles that use the CSS variables
  styles?: (cssVars: TokenVarMap<TTokens>) => string;
};

// Map token paths to CSS variable names
export type TokenVarMap<T extends Record<string, TokenSet>> = {
  [K in keyof T]: {
    [P in keyof T[K]]: string; // CSS variable name
  };
};

// Generate CSS variable map from token structure
function generateVarMap<T extends Record<string, TokenSet>>(
  component: string,
  tokens: ComponentTokens<T>,
): TokenVarMap<T> {
  const varMap: any = {};

  for (const [section, values] of Object.entries(tokens)) {
    varMap[section] = {};
    for (const [key, _] of Object.entries(values as TokenSet)) {
      varMap[section][key] = `var(${
        generateTokenVarName(component, [section, key])
      })`;
    }
  }

  return varMap as TokenVarMap<T>;
}

// Sealed component type - only exposes render function and token interface
export type SealedComponent<
  TTokens extends Record<string, TokenSet>,
  TProps = any,
> = {
  (props: TProps): string;
  componentName: string;
  tokenContract: ComponentTokens<TTokens>;
  cssVarDefinitions: string;
  injectStyles: () => string;
};

// Factory to create sealed components
export function createTokenComponent<
  TTokens extends Record<string, TokenSet>,
  TProps = any,
>(
  config: TokenComponentConfig<TTokens, TProps>,
): SealedComponent<TTokens, TProps> {
  const { name, tokens, render, styles } = config;

  // Generate CSS variable map
  const cssVars = generateVarMap(name, tokens);

  // Generate CSS variable definitions
  const cssVarDefinitions = tokensToCSS(name, tokens);

  // Generate static styles if provided
  const staticStyles = styles ? styles(cssVars) : "";

  // Create unique class name for component
  const componentClass = `ui-${name}`;

  // Create the sealed component function
  const component: SealedComponent<TTokens, TProps> = (props: TProps) => {
    // Render the component with CSS variables
    const html = render(props, cssVars);

    // Ensure the component root has the component class
    const classPattern = /class="([^"]*)"/;
    const hasClass = classPattern.test(html);

    if (hasClass) {
      return html.replace(
        classPattern,
        (match, existingClasses) =>
          `class="${componentClass} ${existingClasses}"`,
      );
    } else {
      // Add class to first tag
      return html.replace(/^<(\w+)/, `<$1 class="${componentClass}"`);
    }
  };

  // Attach metadata
  component.componentName = name;
  component.tokenContract = tokens;
  component.cssVarDefinitions = cssVarDefinitions;

  // Method to inject component styles into page
  component.injectStyles = () => {
    const styleId = `ui-${name}-styles`;

    // Check if styles already injected
    if (typeof document !== "undefined" && !document.getElementById(styleId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.textContent = `
        /* Component: ${name} */
        :root {
          ${cssVarDefinitions}
        }

        ${staticStyles}
      `;
      document.head.appendChild(styleSheet);
    }

    // Return styles for SSR
    return `
      <style id="${styleId}">
        /* Component: ${name} */
        :root {
          ${cssVarDefinitions}
        }

        ${staticStyles}
      </style>
    `;
  };

  return component;
}

// Utility to apply token overrides at runtime
export function applyTokenOverrides<T extends Record<string, TokenSet>>(
  component: string,
  overrides: Partial<ComponentTokens<T>>,
): string {
  const cssVars: string[] = [];

  function flatten(obj: any, prefix: string[] = []): void {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        flatten(value, [...prefix, key]);
      } else {
        const varName = generateTokenVarName(component, [...prefix, key]);
        cssVars.push(`${varName}: ${value}`);
      }
    }
  }

  flatten(overrides);
  return cssVars.join("; ");
}

// Helper to create scoped token overrides
export function scopedTokens<T extends Record<string, TokenSet>>(
  selector: string,
  component: string,
  overrides: Partial<ComponentTokens<T>>,
): string {
  const cssVars = applyTokenOverrides(component, overrides);
  return `${selector} { ${cssVars}; }`;
}

// Theme application utility
export type ComponentTheme = {
  [component: string]: Record<string, TokenSet>;
};

export function applyTheme(theme: ComponentTheme): string {
  const styles: string[] = [];

  for (const [component, tokens] of Object.entries(theme)) {
    const cssVars = applyTokenOverrides(component, tokens as any);
    styles.push(`:root { ${cssVars}; }`);
  }

  return styles.join("\n");
}

// Component registry for managing all sealed components
class ComponentRegistry {
  private components = new Map<string, SealedComponent<any, any>>();

  register<TTokens extends Record<string, TokenSet>, TProps>(
    component: SealedComponent<TTokens, TProps>,
  ): void {
    this.components.set(component.componentName, component);
  }

  get<TTokens extends Record<string, TokenSet>, TProps>(
    name: string,
  ): SealedComponent<TTokens, TProps> | undefined {
    return this.components.get(name);
  }

  getAllStyles(): string {
    const styles: string[] = [];
    for (const component of this.components.values()) {
      styles.push(component.injectStyles());
    }
    return styles.join("\n");
  }

  applyTheme(theme: ComponentTheme): void {
    const styleId = "ui-theme-overrides";
    if (typeof document !== "undefined") {
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = applyTheme(theme);
    }
  }
}

export const registry = new ComponentRegistry();
