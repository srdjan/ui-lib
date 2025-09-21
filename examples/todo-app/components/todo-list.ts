/**
 * TodoList Component
 * Renders a list of todos using the library Stack layout component
 */

import { defineComponent } from "../../../lib/define-component.ts";
import { renderComponent } from "../../../lib/component-state.ts";
import "../../../lib/components/layout/stack.ts";
import type { Todo } from "../api/types.ts";
import { todoToItem } from "./todo-item.ts";

export type TodoListProps = {
  todos: readonly Todo[];
  emptyMessage?: string;
};

defineComponent<TodoListProps>("todo-list", {
  render: (props) => {
    const { todos, emptyMessage = "No todos yet. Add a todo above to get started!" } = props;

    if (todos.length === 0) {
      return renderComponent("card", { size: "lg" }).replace(
        "{{children}}",
        `<p>${emptyMessage}</p>`
      );
    }

    // Convert todos to items using the todo-item component
    const todoItems = todos.map(todoToItem);

    return renderComponent("stack", { spacing: "md" }).replace(
      "{{children}}",
      todoItems.join("")
    );
  },
});

export const TodoList = "todo-list";