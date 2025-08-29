// Request-scoped header stack used during SSR rendering

export type HeaderMap = Record<string, string>;

const headerStack: HeaderMap[] = [];
import { pushStyleContext, popStyleContext } from "./style-registry.ts";

export function runWithRequestHeaders<T>(headers: HeaderMap, fn: () => T): T {
  headerStack.push(headers);
  // Start a per-request style context for CSS deduplication
  pushStyleContext();
  try {
    return fn();
  } finally {
    popStyleContext();
    headerStack.pop();
  }
}

export function currentRequestHeaders(): HeaderMap {
  return headerStack[headerStack.length - 1] ?? {};
}
