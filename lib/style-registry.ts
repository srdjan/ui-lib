// Style registry for per-render (per-request) CSS injection deduplication

const styleStack: Array<Set<string>> = [];

export function pushStyleContext(): void {
  styleStack.push(new Set());
}

export function popStyleContext(): void {
  styleStack.pop();
}

/**
 * Returns true if the style for the given key should be injected in the current context.
 * Marks the key as injected for the remainder of the context.
 * If no context is active, always returns true (no dedup).
 */
export function shouldInjectStyle(key: string): boolean {
  const top = styleStack[styleStack.length - 1];
  if (!top) return true;
  if (top.has(key)) return false;
  top.add(key);
  return true;
}

