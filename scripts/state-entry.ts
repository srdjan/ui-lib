import { initStateBindings, state } from "../lib/simple.tsx";

export function bootstrapUiLib(root?: Element): void {
  if (typeof document === "undefined") return;
  const mountPoint = root ?? document.body ?? undefined;
  if (mountPoint) {
    initStateBindings(mountPoint);
  } else {
    initStateBindings();
  }
}

if (typeof document !== "undefined") {
  const context = globalThis as typeof globalThis & {
    uiLibState?: typeof state;
  };
  context.uiLibState = state;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => bootstrapUiLib());
  } else {
    bootstrapUiLib();
  }
}
