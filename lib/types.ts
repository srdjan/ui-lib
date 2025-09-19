export type PropsOf<T> = T extends Record<string, infer P>
  ? { [K in keyof T]: P }
  : T;

export type UnwrapHelpers<T> = {
  [K in keyof T]: T[K] extends { _helper: true; _type: infer U } ? U : T[K];
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// Re-export ComponentProps from components/types.ts for backward compatibility
export type { BaseComponentProps as ComponentProps } from "./components/types.ts";
