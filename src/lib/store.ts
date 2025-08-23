import type { Reducer, Store, Unsubscribe } from "./types.ts";
import { freezeOnDev } from "./immutability.ts";

export const createStore = <S, A>(initial: Readonly<S>, reducer: Reducer<S, A>): Store<S, A> => {
  let state = freezeOnDev(initial);
  let listeners: Array<() => void> = [];
  const getState = () => state;
  const dispatch = (action: Readonly<A>): void => {
    const next = freezeOnDev(reducer(state, action));
    if (next !== state) {
      state = next;
      // clone snapshot to avoid mutation during notify
      const snapshot = [...listeners];
      for (const l of snapshot) l();
    }
  };
  const subscribe = (listener: () => void): Unsubscribe => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  return { getState, dispatch, subscribe };
};

