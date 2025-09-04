import type { DeepPartial } from "./types.ts";

// Global configuration for the library
export interface FuncwcConfig {
  logging: boolean;
  dev: boolean;
  hx: {
    headers: Record<string, string>;
    swapDefault: string;
    targetDefault: string;
  };
}

const defaultConfig: FuncwcConfig = {
  logging: false,
  dev: false,
  hx: {
    headers: {
      "Accept": "text/html; charset=utf-8",
      "X-Requested-With": "XMLHttpRequest",
    },
    swapDefault: "outerHTML",
    targetDefault: "closest [data-component]",
  },
};

let currentConfig: FuncwcConfig = defaultConfig;

// Deep merge utility
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };
  for (const key in source) {
    const targetValue = (target as any)[key];
    const sourceValue = (source as any)[key];
    if (
      targetValue && typeof targetValue === "object" && sourceValue &&
      typeof sourceValue === "object"
    ) {
      (output as any)[key] = deepMerge(targetValue, sourceValue);
    } else {
      (output as any)[key] = sourceValue;
    }
  }
  return output;
}

export function configure(newConfig: DeepPartial<FuncwcConfig>): void {
  currentConfig = deepMerge(currentConfig, newConfig);
}

export function getConfig(): FuncwcConfig {
  return currentConfig;
}

export function resetConfig(): void {
  currentConfig = defaultConfig;
}
