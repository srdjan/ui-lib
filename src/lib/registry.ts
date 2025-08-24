export type SSRRegistryEntry = {
  init: () => Record<string, unknown>;
  props?: Record<string, { attribute: string; parse: (v: unknown) => unknown }>;
  css?: string;
  render: (state: unknown, props: unknown) => string;
};

export type SSRRegistry = Record<string, SSRRegistryEntry>;

export function getRegistry(): SSRRegistry {
  const g = globalThis as Record<string, unknown>;
  (g.__FWC_SSR__ as SSRRegistry | undefined) ??= {} as SSRRegistry;
  return g.__FWC_SSR__ as SSRRegistry;
}

