import type { PropHelper } from "./prop-helpers.ts";

// Maps a record of PropHelper<T> values to their unwrapped primitive types
export type UnwrapHelpers<T> = {
  [K in keyof T]: T[K] extends PropHelper<infer U> ? U : never;
};

export type PropsOf<T extends Record<string, PropHelper<any>>> = UnwrapHelpers<T>;
