/** @jsx h */
/**
 * TodoStats Component
 * Shows todo statistics using the library Stat component in a Grid layout
 */

import { defineComponent, h } from "../../../lib/define-component.ts";
import { renderComponent } from "../../../lib/component-state.ts";
import "../../../lib/components/data-display/stat.ts";
import "../../../lib/components/layout/grid.tsx";
import "../../../lib/components/layout/card.ts";

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

    const statsGrid = renderComponent("grid", { columns: 3, gap: "md" }).replace(
      "{{children}}",
      [
        renderComponent("stat", {
          value: stats.active.toString(),
          label: "active",
          color: "primary"
        }),
        renderComponent("stat", {
          value: stats.completed.toString(),
          label: "completed",
          color: "success"
        }),
        renderComponent("stat", {
          value: stats.total.toString(),
          label: "total",
          color: "default"
        }),
      ].join("")
    );

    return renderComponent("card", { size: "md" }).replace(
      "{{children}}",
      statsGrid
    );
  },
});

export const TodoStats = "todo-stats";