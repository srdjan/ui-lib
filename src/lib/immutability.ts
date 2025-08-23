// Dev-time immutability helpers
export const deepFreeze = <T>(obj: T): T => {
  if (obj && typeof obj === "object") {
    Object.freeze(obj as object);
    for (const key of Object.getOwnPropertyNames(obj as object)) {
      const value = (obj as Record<string, unknown>)[key];
      if (value && typeof value === "object" && !Object.isFrozen(value)) {
        deepFreeze(value);
      }
    }
  }
  return obj;
};

const isProduction = (): boolean => {
  const g: any = globalThis as any;
  const denoEnv = g?.Deno?.env?.get?.("NODE_ENV");
  const nodeEnv = g?.process?.env?.NODE_ENV;
  const globalEnv = g?.NODE_ENV;
  const env = denoEnv ?? nodeEnv ?? globalEnv;
  return env === "production";
};

export const freezeOnDev = <T>(obj: T): T => {
  if (!isProduction()) {
    return deepFreeze(obj);
  }
  return obj;
};
