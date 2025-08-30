// Light FP Result type and helpers
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const map = <T, U, E>(r: Result<T, E>, fn: (v: T) => U): Result<U, E> =>
  r.ok ? ok(fn(r.value)) : r;

export const flatMap = <T, U, E>(
  r: Result<T, E>,
  fn: (v: T) => Result<U, E>,
): Result<U, E> => r.ok ? fn(r.value) : r;

export const mapError = <T, E, F>(
  r: Result<T, E>,
  fn: (e: E) => F,
): Result<T, F> => r.ok ? r : err(fn(r.error));
