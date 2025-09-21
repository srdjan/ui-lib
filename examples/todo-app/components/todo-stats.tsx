// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoStats Component
 * Shows todo statistics using the library Stat component in a Grid layout
 */

import { h } from "jsx";
import { defineComponent } from "../../../lib/define-component.ts";

export type TodoStatsProps = {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
};

defineComponent<TodoStatsProps>("todo-stats", {
  render: (props) => {
    const { stats } = props;

    return (
      <section class="todo-stats">
        <div class="todo-stats__grid">
          <article class="todo-stat todo-stat--primary">
            <span class="todo-stat__value">{stats.active}</span>
            <span class="todo-stat__label">Active</span>
          </article>
          <article class="todo-stat todo-stat--success">
            <span class="todo-stat__value">{stats.completed}</span>
            <span class="todo-stat__label">Completed</span>
          </article>
          <article class="todo-stat">
            <span class="todo-stat__value">{stats.total}</span>
            <span class="todo-stat__label">Total</span>
          </article>
        </div>
      </section>
    );
  },
});

export const TodoStats = "todo-stats";
