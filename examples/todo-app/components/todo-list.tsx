/** @jsx h */
/**
 * TodoList Component
 * Renders a list of todos using the library Stack layout component
 */

import { defineComponent, h } from "../../../lib/define-component.ts";
import type { Todo } from "../api/types.ts";

export type TodoListProps = {
  todos: readonly Todo[];
  emptyMessage?: string;
};

defineComponent<TodoListProps>("todo-list", {
  render: (props) => {
    const {
      todos,
      emptyMessage = "No todos yet. Add a todo above to get started!",
    } = props;

    if (todos.length === 0) {
      return (
        <div class="todo-list todo-list--empty">
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <ul class="todo-list">
        {todos.map((todo) => (
          <li class="todo-list__item">
            <todo-item todo={todo} />
          </li>
        ))}
      </ul>
    );
  },
});

export const TodoList = "todo-list";
