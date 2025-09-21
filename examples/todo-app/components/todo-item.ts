/**
 * TodoItem Component
 * Wraps the library Item component with todo-specific logic
 */

import { defineComponent } from "../../../lib/define-component.ts";
import { renderComponent } from "../../../lib/component-state.ts";
import "../../../lib/components/data-display/item.ts";

// Import types from todo API
import type { Todo } from "../api/types.ts";

// Re-export types for consistency
export type ItemVariant = "default" | "completed" | "selected" | "priority";
export type ItemPriority = "low" | "medium" | "high";
export type BadgeVariant = "primary" | "success" | "warning" | "danger" | "neutral";
export type ActionVariant = "default" | "primary" | "danger";

export type ItemBadge = {
  readonly text: string;
  readonly variant?: BadgeVariant;
};

export type ItemAction = {
  readonly text: string;
  readonly action: string;
  readonly variant?: ActionVariant;
};

export type ItemProps = {
  readonly id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly timestamp?: string;
  readonly badges?: readonly ItemBadge[];
  readonly actions?: readonly ItemAction[];
  readonly variant?: ItemVariant;
  readonly size?: "sm" | "md" | "lg";
  readonly priority?: ItemPriority;
  readonly completed?: boolean;
  readonly selected?: boolean;
};

function getPriorityVariant(priority: string): BadgeVariant {
  switch (priority) {
    case "high": return "danger";
    case "medium": return "warning";
    case "low": return "success";
    default: return "neutral";
  }
}

// Convert Todo objects to generic Item format
export function todoToItem(todo: Todo): string {
  const itemProps: ItemProps = {
    id: todo.id,
    title: todo.text,
    completed: todo.completed,
    priority: todo.priority,
    timestamp: new Date(todo.createdAt).toLocaleDateString(),
    badges: [{ text: todo.priority, variant: getPriorityVariant(todo.priority) }],
    icon: `<input type="checkbox" ${todo.completed ? 'checked' : ''} />`,
    actions: [
      { text: "Edit", action: `editTodo('${todo.id}')` },
      { text: "Delete", variant: "danger", action: `deleteTodo('${todo.id}')` },
    ],
  };
  return renderComponent("item", itemProps);
}

// Define the TodoItem component that accepts todo props directly
defineComponent<{ todo: Todo }>("todo-item", {
  render: (props) => {
    return todoToItem(props.todo);
  },
});

export const TodoItem = "todo-item";