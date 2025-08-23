/** @jsxImportSource https://esm.sh/mono-jsx */
import { type Action, defineComponent } from "../src/index.ts";

export type TodoState = { readonly text: string; readonly done: boolean };
export type TodoProps = { readonly text: string; readonly done?: boolean };
export type TodoAction =
  & Action
  & (
    | { readonly type: "TOGGLE" }
    | { readonly type: "SET_TEXT"; readonly payload: { readonly text: string } }
  );

const init = (props: Readonly<TodoProps>): Readonly<TodoState> => ({
  text: props.text,
  done: props.done ?? false,
});

const update = (
  state: Readonly<TodoState>,
  action: Readonly<TodoAction>,
): Readonly<TodoState> => {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, done: !state.done };
    case "SET_TEXT":
      return { ...state, text: action.payload.text };
    default:
      return state;
  }
};

const View = (
  state: Readonly<TodoState>,
  _props: Readonly<
    TodoProps & { readonly emit: (n: string, d?: unknown) => void }
  >,
): Node =>
  (
    <label class={state.done ? "todo done" : "todo"}>
      <input
        type="checkbox"
        checked={state.done}
        onChange={() => ({ type: "TOGGLE" })}
      />
      <span>{state.text}</span>
    </label>
  ) as unknown as Node;

defineComponent<TodoState, TodoProps, TodoAction>("f-todo-item-jsx", {
  init,
  update,
  view: View,
  props: {
    text: { attribute: "text", parse: (v) => String(v ?? "") },
    done: { attribute: "done", parse: (v) => v != null },
  },
});
