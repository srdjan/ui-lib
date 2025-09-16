import { initStateBindings, state } from "../lib/simple.tsx";

declare global {
  interface Window {
    uiLibState?: typeof state;
  }
}

export function bootstrapUiLib(root?: Element): void {
  if (typeof document === "undefined") return;
  const mountPoint = root ?? document.body ?? undefined;
  if (mountPoint) {
    initStateBindings(mountPoint);
  } else {
    initStateBindings();
  }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.uiLibState = state;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => bootstrapUiLib());
  } else {
    bootstrapUiLib();
  }
}
