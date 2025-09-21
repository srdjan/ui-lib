/**
 * TodoForm Component
 * Simple form for adding new todos using library Card component
 */

import { defineComponent } from "../../../lib/define-component.ts";
import { renderComponent } from "../../../lib/component-state.ts";
import "../../../lib/components/layout/card.ts";

export type TodoFormProps = {
  action?: string;
  method?: string;
};

defineComponent<TodoFormProps>("todo-form", {
  render: (props) => {
    const { action = "/api/todos", method = "POST" } = props;

    const formHtml = `
      <form method="${method}" action="${action}">
        <div>
          <label for="text">What needs to be done?</label>
          <input
            type="text"
            name="text"
            id="text"
            placeholder="Enter todo text..."
            required
          />
        </div>
        <div>
          <label for="priority">Priority</label>
          <select name="priority" id="priority" required>
            <option value="">Select priority</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <button type="submit">Add Todo</button>
      </form>
    `;

    return renderComponent("card", { title: "Add New Todo", size: "md" }).replace(
      "{{children}}",
      formHtml
    );
  },
});

export const TodoForm = "todo-form";