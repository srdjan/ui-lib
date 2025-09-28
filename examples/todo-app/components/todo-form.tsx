// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoForm Component
 * Simple form for adding new todos using library Card component
 */

import { h } from "jsx";
import { defineComponent } from "../../../mod.ts";
import "../../../lib/components/input/input.ts";
import "../../../lib/components/input/select.ts";
import "../../../lib/components/button/button.ts";

export type TodoFormProps = {
  action?: string;
  method?: "get" | "post" | "dialog";
};

defineComponent<TodoFormProps>("todo-form", {
  render: (props) => {
    const { action = "/api/todos", method = "post" } = props;

    return (
      <form method={method} action={action}>
        <input
          type="text"
          name="text"
          id="text"
          label="What needs to be done?"
          placeholder="Enter todo text..."
          required
        />
        <input
          type="select"
          name="priority"
          id="priority"
          label="Priority"
          required
          options={[
            { value: "", label: "Select priority" },
            { value: "low", label: "Low Priority" },
            { value: "medium", label: "Medium Priority" },
            { value: "high", label: "High Priority" },
          ]}
        />
        <button type="submit" variant="primary">Add Todo</button>
      </form>
    );
  },
});

export const TodoForm = "todo-form";
