// Core library types for Pipeline API

export type Action = {
  readonly type: string;
  readonly payload?: unknown;
  readonly meta?: unknown;
};
