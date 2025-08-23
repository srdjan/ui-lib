import { type Action, defineComponent, h } from "../src/index.ts";

// Types
export type CounterState = { readonly count: number };
export type CounterProps = { readonly step?: number };
export type CounterAction =
  & Action
  & (
    | { readonly type: "INC"; readonly payload?: { readonly step?: number } }
    | { readonly type: "DEC"; readonly payload?: { readonly step?: number } }
  );

// Spec
const init = (_props: Readonly<CounterProps>): Readonly<CounterState> => ({
  count: 0,
});

const reducer = (
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

const view = (
  state: Readonly<CounterState>,
  props: Readonly<
    CounterProps & { readonly emit: (n: string, d?: unknown) => void }
  >,
) =>
  h(
    "div",
    { class: "counter" },
    h("button", {
      onClick: () => ({ type: "DEC", payload: { step: props.step ?? 1 } }),
    }, "-"),
    h("span", {}, String(state.count)),
    h("button", {
      onClick: () => ({ type: "INC", payload: { step: props.step ?? 1 } }),
    }, "+"),
  );

// Define component

defineComponent<CounterState, CounterProps, CounterAction>("f-counter", {
  init,
  reducer,
  view,
  props: {
    step: {
      attribute: "step",
      parse: (v) => (v == null ? undefined : Number(v)),
    },
  },
});
