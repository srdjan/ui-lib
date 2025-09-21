/** @jsx h */
/**
 * TodoForm Component
 * Simple form for adding new todos using library Card component
 */

import { defineComponent, h } from "../../../lib/define-component.ts";

export type TodoFormProps = {
  action?: string;
  method?: "get" | "post" | "dialog";
};

defineComponent<TodoFormProps>("todo-form", {
  render: (props) => {
    const { action = "/api/todos", method = "post" } = props;

    return (
      <section class="todo-form">
        <header class="todo-form__header">
          <h2>Add New Todo</h2>
          <p>Capture tasks with priority for the active demo user.</p>
        </header>
        <form method={method} action={action} class="todo-form__body">
          <div class="form-field">
            <label for="text">What needs to be done?</label>
            <input
              type="text"
              name="text"
              id="text"
              placeholder="Enter todo text..."
              required
            />
          </div>
          <div class="form-field">
            <label for="priority">Priority</label>
            <select name="priority" id="priority" required>
              <option value="">Select priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit">Add Todo</button>
          </div>
        </form>
      </section>
    );
  },
});

export const TodoForm = "todo-form";

