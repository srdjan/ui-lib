// JSX Component Type Generation for ui-lib Components

import { getRegistry } from "./registry.ts";

// Type utilities for extracting prop types from function signatures
export type FuncwcComponentProps<T extends string> = T extends
  keyof ComponentPropsMap ? ComponentPropsMap[T]
  : Record<string, unknown>;

// Component prop mapping - will be populated by component registration
export interface ComponentPropsMap {
  // Dynamic component prop types will be added here
  // Example: "demo-counter": { initialCount?: number; step?: number; ... }
}

// Helper types for JSX prop conversion
export type JSXProps<T> = {
  [K in keyof T]: T[K] extends string ? string | number
    : T[K] extends number ? number | string
    : T[K] extends boolean ? boolean
    : T[K] extends Array<infer U> ? Array<U> | string
    : T[K] extends Record<string, unknown> ? T[K] | string
    : T[K];
};

// Extract component names from registry
export type RegisteredComponents = keyof ComponentPropsMap;

// Helper function to extract prop signature from render function
export function extractPropTypes(renderFn: Function): Record<string, string> {
  const fnString = renderFn.toString();

  // Extract the first parameter destructuring pattern
  const paramMatch = fnString.match(/\(\s*\{\s*([^}]+)\s*\}/);
  if (!paramMatch) return {};

  const paramString = paramMatch[1];
  const props: Record<string, string> = {};

  // Parse each prop with its default value helper
  const propMatches = paramString.matchAll(/(\w+)\s*=\s*(\w+)\([^)]*\)/g);

  for (const match of propMatches) {
    const [, propName, helperName] = match;

    // Map helper names to TypeScript types
    const typeMap: Record<string, string> = {
      string: "string",
      number: "number",
      boolean: "boolean",
      array: "Array<unknown>",
      object: "Record<string, unknown>",
    };

    props[propName] = typeMap[helperName] || "unknown";
  }

  return props;
}

// Generate TypeScript interface for a component
export function generateComponentInterface(
  componentName: string,
  propTypes: Record<string, string>,
): string {
  const propsInterface = Object.entries(propTypes)
    .map(([name, type]) => `  "${name}"?: ${type};`)
    .join("\n");

  return `export interface ${
    pascalCase(componentName)
  }Props {\n${propsInterface}\n}`;
}

// Convert kebab-case to PascalCase
function pascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Runtime component type registration
const componentTypeRegistry = new Map<string, Record<string, string>>();

export function registerComponentTypes(
  componentName: string,
  propTypes: Record<string, string>,
): void {
  componentTypeRegistry.set(componentName, propTypes);
}

export function getComponentTypes(
  componentName: string,
): Record<string, string> | undefined {
  return componentTypeRegistry.get(componentName);
}

// Generate all component type definitions
export function generateAllComponentTypes(): string {
  const registry = getRegistry();
  let output = "// Auto-generated ui-lib component prop types\n\n";

  const interfaceMap: Record<string, string> = {};

  for (const [componentName, entry] of Object.entries(registry)) {
    if (entry.render) {
      const propTypes = extractPropTypes(entry.render);
      registerComponentTypes(componentName, propTypes);

      // Generate interface
      const interfaceName = `${pascalCase(componentName)}Props`;
      const propsInterface = Object.entries(propTypes)
        .map(([name, type]) => `  "${name}"?: ${type};`)
        .join("\n");

      output += `export interface ${interfaceName} {\n${propsInterface}\n}\n\n`;

      // Add to component mapping
      interfaceMap[componentName] = interfaceName;
    }
  }

  // Generate the ComponentPropsMap
  output += "// Component props mapping for JSX\n";
  output += "export interface ComponentPropsMap {\n";

  for (const [componentName, interfaceName] of Object.entries(interfaceMap)) {
    output += `  "${componentName}": ${interfaceName};\n`;
  }

  output += "}\n";

  return output;
}

// Helper to validate JSX props at runtime (optional)
export function validateComponentProps(
  componentName: string,
  props: Record<string, unknown>,
): { valid: boolean; errors: string[] } {
  const propTypes = getComponentTypes(componentName);
  if (!propTypes) {
    return { valid: true, errors: [] };
  }

  const errors: string[] = [];

  for (const [propName, expectedType] of Object.entries(propTypes)) {
    const value = props[propName];

    if (value === undefined) continue; // Optional props

    // Basic type checking
    if (expectedType === "string" && typeof value !== "string") {
      errors.push(
        `Property "${propName}" should be a string, got ${typeof value}`,
      );
    } else if (expectedType === "number" && typeof value !== "number") {
      // Allow string representations of numbers
      if (typeof value === "string" && !isNaN(Number(value))) continue;
      errors.push(
        `Property "${propName}" should be a number, got ${typeof value}`,
      );
    } else if (expectedType === "boolean" && typeof value !== "boolean") {
      errors.push(
        `Property "${propName}" should be a boolean, got ${typeof value}`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}
