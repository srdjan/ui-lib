// Request-scoped header stack used during SSR rendering

export type HeaderMap = Record<string, string>;

const headerStack: HeaderMap[] = [];

export function runWithRequestHeaders<T>(headers: HeaderMap, fn: () => T): T {
  headerStack.push(headers);
  try {
    return fn();
  } finally {
    headerStack.pop();
  }
}

export function currentRequestHeaders(): HeaderMap {
  return headerStack[headerStack.length - 1] ?? {};
}
