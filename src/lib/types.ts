// Core library types following Light FP rules

// VNode for declarative rendering
export type VNode =
  | { readonly type: "text"; readonly text: string }
  | {
    readonly type: "element";
    readonly tag: string;
    readonly key?: string | number;
    readonly props?: Readonly<Record<string, unknown>>;
    readonly children?: readonly VNode[];
  };

export type StateUpdater<S> = (state: Readonly<S>) => Readonly<S>;

export type Reducer<S, A> = (
  state: Readonly<S>,
  action: Readonly<A>,
) => Readonly<S>;

export type View<S, P> = (state: Readonly<S>, props: Readonly<P>) => VNode;

export type Dispatch<A> = (action: Readonly<A>) => void;

export type Unsubscribe = () => void;

export type Store<S, A> = {
  readonly getState: () => Readonly<S>;
  readonly dispatch: Dispatch<A>;
  readonly subscribe: (listener: () => void) => Unsubscribe;
};

export type Action = {
  readonly type: string;
  readonly payload?: unknown;
  readonly meta?: unknown;
};

export type ComponentSpec<S, P, A extends Action> = {
  readonly init: (props: Readonly<P>) => Readonly<S>;
  readonly reducer: Reducer<S, A>;
  readonly view: View<S, P & ComponentContext>;
  readonly props?: PropSpecMap<P>;
  readonly styles?: readonly (string | CSSStyleSheet)[];
  readonly shouldRender?: (
    prevState: Readonly<S>,
    nextState: Readonly<S>,
    prevProps: Readonly<P>,
    nextProps: Readonly<P>,
  ) => boolean;
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
