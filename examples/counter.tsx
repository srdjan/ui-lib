/** @jsxImportSource https://esm.sh/mono-jsx */
import { type Action, defineComponent } from "../src/index.ts";

export type CounterState = { readonly count: number };
export type CounterProps = { readonly step?: number };
export type CounterAction =
  & Action
  & (
    | { readonly type: "INC"; readonly payload?: { readonly step?: number } }
    | { readonly type: "DEC"; readonly payload?: { readonly step?: number } }
  );

const init = (_props: Readonly<CounterProps>): Readonly<CounterState> => ({
  count: 0,
});

const update = (
  state: Readonly<CounterState>,
  action: Readonly<CounterAction>,
): Readonly<CounterState> => {
  switch (action.type) {
    case "INC": {
      const step = action.payload?.step ?? 1;
      return { count: state.count + step };
    }
    case "DEC": {
      const step = action.payload?.step ?? 1;
      return { count: state.count - step };
    }
    default:
      return state;
  }
};

const View = (
  state: Readonly<CounterState>,
  props: Readonly<
    CounterProps & { readonly emit: (n: string, d?: unknown) => void }
  >,
): Node =>
  (
    <div class="counter">
      <button
        onClick={() => ({ type: "DEC", payload: { step: props.step ?? 1 } })}
      >
        -
      </button>
      <span>{String(state.count)}</span>
      <button
        onClick={() => ({ type: "INC", payload: { step: props.step ?? 1 } })}
      >
        +
      </button>
    </div>
  ) as unknown as Node;

// Define component

defineComponent<CounterState, CounterProps, CounterAction>("f-counter-jsx", {
  init,
  update,
  view: View,
  props: {
    step: {
      attribute: "step",
      parse: (v) => (v == null ? undefined : Number(v)),
    },
  },
});
