// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoForm Component
 * Clean form for adding new todos using library components
 */

import { h } from "jsx";
import { defineComponent, post } from "../../../mod.ts";
import "../../../lib/components/input/input.ts";
import "../../../lib/components/input/select.ts";
import "../../../lib/components/button/button.ts";

export type TodoFormProps = {
  // Props for customization if needed
};

defineComponent<TodoFormProps>("todo-form", {
  api: {
    createTodo: post("/api/todos", () => new Response("")),
  },
  render: (_props, api) => {
    return (
      <form {...api!.createTodo()}>
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
