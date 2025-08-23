import { defineComponent, h, type Action } from "../src/index.ts";

export type TodoState = { readonly text: string; readonly done: boolean };
export type TodoProps = { readonly text: string; readonly done?: boolean };
export type TodoAction = Action & (
  | { readonly type: "TOGGLE" }
  | { readonly type: "SET_TEXT"; readonly payload: { readonly text: string } }
);

const init = (props: Readonly<TodoProps>): Readonly<TodoState> => ({
  text: props.text,
  done: props.done ?? false,
});

const reducer = (
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

const view = (state: Readonly<TodoState>) =>
  h(
    "label",
    { class: state.done ? "todo done" : "todo" },
    h("input", { type: "checkbox", checked: state.done, onChange: () => ({ type: "TOGGLE" }) }),
    h("span", {}, state.text),
  );

defineComponent<TodoState, TodoProps, TodoAction>("f-todo-item", {
  init,
  reducer,
  view,
  props: {
    text: { attribute: "text", parse: (v) => String(v ?? "") },
    done: { attribute: "done", parse: (v) => v != null },
  },
});

