// Minimal fine-grained reactivity (signals) inspired by SolidJS
// Pure computations; side effects limited to DOM adapter usage
import { freezeOnDev } from "./immutability.ts";

export type ReadSignal<T> = () => Readonly<T>;
export type WriteSignal<T> = (value: Readonly<T> | ((prev: Readonly<T>) => Readonly<T>)) => void;
export type Signal<T> = readonly [ReadSignal<T>, WriteSignal<T>];

type EffectRecord = {
  readonly fn: () => void;
  deps: Set<SignalState<unknown>>;
  scheduled: boolean;
};

type SignalState<T> = {
  value: Readonly<T>;
  subs: Set<EffectRecord>;
};

let CURRENT_EFFECT: EffectRecord | null = null;

const schedule = (eff: EffectRecord) => {
  if (eff.scheduled) return;
  eff.scheduled = true;
  queueMicrotask(() => {
    eff.scheduled = false;
    runEffect(eff);
  });
};

const runEffect = (eff: EffectRecord) => {
  // Clear dependencies; re-track
  for (const dep of eff.deps) dep.subs.delete(eff);
  eff.deps.clear();
  const prev = CURRENT_EFFECT;
  CURRENT_EFFECT = eff;
  try {
    eff.fn();
  } finally {
    CURRENT_EFFECT = prev;
  }
};

export const createSignal = <T>(initial: Readonly<T>): Signal<T> => {
  const state: SignalState<T> = {
    value: freezeOnDev(initial),
    subs: new Set(),
  };
  const read: ReadSignal<T> = () => {
    if (CURRENT_EFFECT) {
      state.subs.add(CURRENT_EFFECT);
      CURRENT_EFFECT.deps.add(state as SignalState<unknown>);
    }
    return state.value;
  };
  const write: WriteSignal<T> = (value) => {
    const next = typeof value === "function"
      ? (value as (prev: Readonly<T>) => Readonly<T>)(state.value)
      : (value as Readonly<T>);
    if (Object.is(next, state.value)) return;
    state.value = freezeOnDev(next);
    for (const eff of state.subs) schedule(eff);
  };
  return [read, write] as const;
};

export const createEffect = (fn: () => void): void => {
  const eff: EffectRecord = { fn, deps: new Set(), scheduled: false };
  runEffect(eff);
};

export const createMemo = <T>(calc: () => Readonly<T>): ReadSignal<T> => {
  const [get, set] = createSignal<T>(undefined as unknown as T);
  createEffect(() => set(calc()));
  return get;
};

