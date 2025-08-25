// Simplified registry entry for DOM-native components
export type SSRRegistryEntry = {
  props?: Record<string, { attribute: string; parse: (v: unknown) => unknown }>;
  css?: string;
  render: (
    props: unknown,
    api?: unknown
  ) => string;
  api?: Record<string, (...args: unknown[]) => Record<string, unknown>>;
};

export type SSRRegistry = Record<string, SSRRegistryEntry>;

export function getRegistry(): SSRRegistry {
  const g = globalThis as Record<string, unknown>;
  (g.__FWC_SSR__ as SSRRegistry | undefined) ??= {} as SSRRegistry;
  return g.__FWC_SSR__ as SSRRegistry;
}

