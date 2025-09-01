// Central configuration for funcwc

export type FuncwcConfig = {
  dev?: boolean; // enables verbose logging in development
  logging?: boolean; // master switch for library logs
  hx?: {
    headers?: Record<string, string>;
    swapDefault?: string; // default hx-swap for non-GET
    targetDefault?: string; // default hx-target for non-GET
  };
};

export type ResolvedConfig = {
  dev: boolean;
  logging: boolean;
  hx: {
    headers: Record<string, string>;
    swapDefault: string;
    targetDefault: string;
  };
};

const DEFAULTS: ResolvedConfig = {
  dev: true,
  logging: true,
  hx: {
    headers: {},
    swapDefault: "outerHTML",
    targetDefault: "closest [data-component]",
  },
};

let current: ResolvedConfig = { ...DEFAULTS };

export function configure(partial: FuncwcConfig): void {
  // Normalize partial into fully-resolved shape before merging
  const normalized = deepMerge(
    DEFAULTS,
    partial as unknown as Partial<ResolvedConfig>,
  );
  current = deepMerge(current, normalized);
}

export function getConfig(): ResolvedConfig {
  // Fill any missing fields with defaults
  return deepMerge(DEFAULTS, current) as ResolvedConfig;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge<T extends Record<string, unknown>>(a: T, b: Partial<T>): T {
  const out: Record<string, unknown> = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (v === undefined) continue;
    const prev = (out as Record<string, unknown>)[k];
    if (isObject(prev) && isObject(v)) {
      (out as Record<string, unknown>)[k] = deepMerge(
        prev,
        v as Record<string, unknown>,
      );
    } else {
      (out as Record<string, unknown>)[k] = v as unknown;
    }
  }
  return out as T;
}
