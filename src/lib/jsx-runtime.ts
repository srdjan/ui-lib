// Wrapper around mono-jsx runtime to intercept event handlers and dispatch actions
// Import the actual runtime from the npm spec to avoid import map recursion
import * as Actual from "npm:mono-jsx@0.6.11/jsx-runtime";

let currentDispatch: ((action: unknown) => void) | null = null;
export const setCurrentDispatch = (fn: ((action: unknown) => void) | null) => {
  currentDispatch = fn;
};

const ACTION_FLAG = Symbol("__wrapped_event_handler");

const wrapHandlers = (props: Record<string, unknown> | null | undefined) => {
  if (!props) return props as any;
  const out: Record<string, unknown> = { ...props };
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === "function" && k.startsWith("on")) {
      const fn = v as any;
      if ((fn as any)[ACTION_FLAG]) continue;
      const wrapped = ((ev: Event) => {
        const result = fn(ev);
        if (
          currentDispatch && result && typeof result === "object" &&
          "type" in result
        ) {
          currentDispatch(result);
        }
      }) as EventListener;
      (wrapped as any)[ACTION_FLAG] = true;
      out[k] = wrapped;
    }
  }
  return out as any;
};

export const jsx = (type: any, props: any, key?: any) =>
  (Actual as any).jsx(type, wrapHandlers(props), key);
export const jsxs = (type: any, props: any, key?: any) =>
  (Actual as any).jsxs(type, wrapHandlers(props), key);
export const Fragment = (Actual as any).Fragment;
