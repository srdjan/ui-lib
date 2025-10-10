// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoForm Component
 * Clean form for adding new todos using library components
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
          label="Task Description"
          placeholder="What needs to be done?"
          required
        />
        <div class="form-row">
          <input
            type="select"
            name="priority"
            id="priority"
            label="Priority"
            required
            options={[
              { value: "", label: "Select priority" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
          <button type="submit" variant="primary" size="md" fullWidth>
            Add Task
          </button>
        </div>
      </form>
    );
  },
});

export const TodoForm = "todo-form";
