// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoStats Component
 * Shows todo statistics using the library Stat component in a Grid layout
 */

import { h } from "jsx";
import { defineComponent } from "../../../mod.ts";
import "../../../lib/components/data-display/stat.ts";
import "../../../lib/components/layout/grid.ts";

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
      <grid columns="3" gap="md">
        <stat
          value={String(stats.active)}
          label="Active"
          variant="primary"
        />
        <stat
          value={String(stats.completed)}
          label="Completed"
          variant="success"
        />
        <stat
          value={String(stats.total)}
          label="Total"
          variant="default"
        />
      </grid>
    );
  },
});

export const TodoStats = "todo-stats";
