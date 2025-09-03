// JSX Integration Helpers for ui-lib Components

import { registerComponent } from "./registry.ts";
import {
  extractPropTypes,
  generateAllComponentTypes,
  registerComponentTypes,
  validateComponentProps,
} from "./jsx-component-types.ts";
import type { SSRRegistryEntry } from "./registry.ts";

// Enhanced component registration that includes JSX type generation
export function registerComponentWithJSX(
  name: string,
  entry: SSRRegistryEntry,
): void {
  // Register component normally
  registerComponent(name, entry);

  // Extract and register prop types for JSX
  if (entry.render) {
    const propTypes = extractPropTypes(entry.render);
    registerComponentTypes(name, propTypes);
  }

  // Optionally update TypeScript declarations (for development)
  if (
    typeof Deno !== "undefined" && Deno.env.get("NODE_ENV") === "development"
  ) {
    updateTypeDeclarations();
  }
}

// Update TypeScript type declarations file
async function updateTypeDeclarations(): Promise<void> {
  try {
    const typeDefinitions = generateAllComponentTypes();

    // Write to a generated types file
    const typesPath = "./lib/jsx-component-types.generated.ts";
    await Deno.writeTextFile(typesPath, typeDefinitions);

    console.log(`📝 Updated JSX component types: ${typesPath}`);
  } catch (error) {
    console.warn("Failed to update JSX type declarations:", error);
  }
}

// Development helper to generate type definitions file
export async function generateJSXTypes(outputPath?: string): Promise<string> {
  const typeDefinitions = generateAllComponentTypes();

  if (outputPath) {
    try {
      await Deno.writeTextFile(outputPath, typeDefinitions);
      console.log(`✅ Generated JSX types at: ${outputPath}`);
    } catch (error) {
      console.error(`❌ Failed to write JSX types to ${outputPath}:`, error);
    }
  }

  return typeDefinitions;
}

// Runtime prop validation helper
export function validateJSXProps(
  componentName: string,
  props: Record<string, unknown>,
): void {
  const validation = validateComponentProps(componentName, props);

  if (!validation.valid) {
    console.warn(
      `⚠️  JSX prop validation failed for <${componentName}>:`,
      validation.errors,
    );
  }
}

// JSX prop conversion utilities
export function jsxPropsToAttributes(
  props: Record<string, unknown>,
): Record<string, string> {
  const attributes: Record<string, string> = {};

  for (const [key, value] of Object.entries(props)) {
    if (key === "children") continue;

    // Convert camelCase to kebab-case
    const attrName = key.replace(/([A-Z])/g, "-$1").toLowerCase();

    // Convert values to HTML attribute format
    if (value === true) {
      attributes[attrName] = "";
    } else if (value === false || value == null) {
      // Skip false/null values
      continue;
    } else if (typeof value === "object") {
      // Serialize objects/arrays as JSON
      attributes[attrName] = JSON.stringify(value);
    } else {
      attributes[attrName] = String(value);
    }
  }

  return attributes;
}

// Helper to convert HTML attributes back to JSX props (for testing/debugging)
export function attributesToJSXProps(
  attributes: Record<string, string>,
): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(attributes)) {
    // Convert kebab-case to camelCase
    const propName = key.replace(
      /-([a-z])/g,
      (_, letter) => letter.toUpperCase(),
    );

    // Try to parse the value appropriately
    if (value === "") {
      props[propName] = true;
    } else if (value === "false") {
      props[propName] = false;
    } else if (value === "true") {
      props[propName] = true;
    } else if (!isNaN(Number(value))) {
      props[propName] = Number(value);
    } else {
      // Try to parse as JSON, fallback to string
      try {
        props[propName] = JSON.parse(value);
      } catch {
        props[propName] = value;
      }
    }
  }

  return props;
}

// Development utility to inspect component prop types
export function inspectComponentProps(componentName: string): void {
  const propTypes = extractPropTypes;
  console.log(`🔍 Component "${componentName}" prop types:`, propTypes);
}

// Helper to create JSX-friendly component wrappers
export function createJSXWrapper<T extends Record<string, unknown>>(
  componentName: string,
): (props: T & { children?: string }) => string {
  return (props: T & { children?: string }) => {
    const { children, ...componentProps } = props;

    // Validate props in development
    if (
      typeof Deno !== "undefined" && Deno.env.get("NODE_ENV") === "development"
    ) {
      validateJSXProps(componentName, componentProps);
    }

    // Convert JSX props to ui-lib format
    const funcwcProps = jsxPropsToAttributes(componentProps);

    if (children) {
      funcwcProps.children = children;
    }

    // Use the JSX runtime which will detect the component and use renderComponent
    return `<${componentName} ${
      Object.entries(funcwcProps)
        .map(([key, value]) => value === "" ? key : `${key}="${value}"`)
        .join(" ")
    }>${children || ""}</${componentName}>`;
  };
}

// Batch register multiple components with JSX support
export function registerComponentBatch(
  components: Record<string, SSRRegistryEntry>,
): void {
  for (const [name, entry] of Object.entries(components)) {
    registerComponentWithJSX(name, entry);
  }

  console.log(
    `✅ Registered ${
      Object.keys(components).length
    } components with JSX support`,
  );
}

// Export utility for development setup
export const JSXIntegration = {
  register: registerComponentWithJSX,
  registerBatch: registerComponentBatch,
  generateTypes: generateJSXTypes,
  validate: validateJSXProps,
  inspect: inspectComponentProps,
  createWrapper: createJSXWrapper,
};
