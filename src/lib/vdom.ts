import type { VNode } from "./types.ts";

export const text = (value: string): VNode => ({ type: "text", text: value });

export const h = (
  tag: string,
  props?: Readonly<Record<string, unknown>>,
  ...children: readonly (VNode | string | null | undefined)[]
): VNode => ({
  type: "element",
  tag,
  props,
  children: children
    .filter((c): c is VNode | string => c !== null && c !== undefined)
    .map((c) => (typeof c === "string" ? text(c) : c)),
});

// Basic equality to help shouldRender decisions for props
export const shallowEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) return false;
  const ak = Object.keys(a as Record<string, unknown>);
  const bk = Object.keys(b as Record<string, unknown>);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (!(b as Record<string, unknown>).hasOwnProperty(k)) return false;
    if (!Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
  }
  return true;
};

