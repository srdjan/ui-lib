// Small response helpers to standardize content types and ergonomics

function mergeHeaders(init?: ResponseInit, defaults?: Record<string, string>): Headers {
  const headers = new Headers(defaults);
  if (init?.headers) {
    const given = new Headers(init.headers as any);
    given.forEach((v, k) => headers.set(k, v));
  }
  return headers;
}

export function html(body: BodyInit, init: ResponseInit = {}): Response {
  const headers = mergeHeaders(init, { "Content-Type": "text/html; charset=utf-8" });
  return new Response(body, { ...init, headers });
}

export function text(body: string, init: ResponseInit = {}): Response {
  const headers = mergeHeaders(init, { "Content-Type": "text/plain; charset=utf-8" });
  return new Response(body, { ...init, headers });
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  const body = JSON.stringify(data);
  const headers = mergeHeaders(init, { "Content-Type": "application/json; charset=utf-8" });
  return new Response(body, { ...init, headers });
}

export function error(status: number, message = "Error", init: ResponseInit = {}): Response {
  return text(message, { status, ...init });
}
