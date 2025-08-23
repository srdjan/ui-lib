// Core library types following Light FP rules

export type StateUpdater<S> = (state: Readonly<S>) => Readonly<S>;

export type Updater<S, A> = (
  state: Readonly<S>,
  action: Readonly<A>,
) => Readonly<S>;

// View now returns a real DOM Node (or DocumentFragment) via JSX runtime
export type View<S, P> = (
  state: Readonly<S>,
  props: Readonly<P>,
) => Node | DocumentFragment;

export type Action = {
  readonly type: string;
  readonly payload?: unknown;
  readonly meta?: unknown;
};

export type ComponentSpec<S, P, A extends Action> = {
  readonly init: (props: Readonly<P>) => Readonly<S>;
  readonly update: Updater<S, A>;
  readonly view: View<S, P & ComponentContext>;
  readonly props?: PropSpecMap<P>;
  readonly styles?: readonly (string | CSSStyleSheet)[];
};

export type ComponentContext = {
  readonly emit: (
    name: string,
    detail?: unknown,
    options?: CustomEventInit,
  ) => void;
};

export type PropSpec<V> = {
  readonly attribute?: string | false; // kebab-case or false for property-only
  readonly parse?: (value: unknown) => V;
  readonly reflect?: boolean;
  readonly default?: V;
};

export type PropSpecMap<P> = Readonly<
  {
    readonly [K in keyof P]?: PropSpec<P[K]>;
  }
>;
