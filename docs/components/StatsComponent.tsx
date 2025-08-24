/** @jsx h */
import { h } from "https://deno.land/x/jsx@v0.1.5/mod.ts";
import type { Stats } from "../types.ts";

interface StatsProps {
  stats: Stats;
}

export function StatsComponent({ stats }: StatsProps) {
  return (
    <div class="stats">
      <div class="stat">
        <div class="stat-number">{stats.totalUsers}</div>
        <div>Total Users</div>
      </div>
      <div class="stat">
        <div class="stat-number">{stats.activeUsers}</div>
        <div>Active Users</div>
      </div>
      <div class="stat">
        <div class="stat-number">{stats.totalPosts}</div>
        <div>Total Posts</div>
      </div>
    </div>
  );
}

