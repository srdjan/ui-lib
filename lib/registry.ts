// Simplified registry entry for DOM-native components
export type SSRRegistryEntry = {
  props?: Record<string, { attribute: string; parse: (v: unknown) => unknown }>;
  css?: string;
  // Method syntax gives bivariant parameter checking, allowing consumers to
  // narrow parameter types in their render functions without conflicts.
  render(props: unknown, api?: unknown): string;
  api?: Record<string, (...args: unknown[]) => string>;
  apiMap?: Record<string, unknown>; // ApiRoute or tuple format - keep flexible
};

export type SSRRegistry = Record<string, SSRRegistryEntry>;

export function getRegistry(): SSRRegistry {
  const g = globalThis as Record<string, unknown>;
  (g.__FWC_SSR__ as SSRRegistry | undefined) ??= {} as SSRRegistry;
  return g.__FWC_SSR__ as SSRRegistry;
}

export function registerComponent(name: string, entry: SSRRegistryEntry): void {
  const registry = getRegistry();
  if (registry[name]) {
    console.warn(
      `⚠️  Component "${name}" already exists and will be overwritten!`,
    );
    console.warn(`   Previous: ${Object.keys(registry[name]).join(", ")}`);
    console.warn(`   New: ${Object.keys(entry).join(", ")}`);
  }
  registry[name] = entry;
}

// Test-only utility to clear the SSR registry between tests
export function resetRegistry(): void {
  const g = globalThis as Record<string, unknown>;
  g.__FWC_SSR__ = {} as SSRRegistry;
}
