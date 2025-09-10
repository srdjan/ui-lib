/** @jsx h */
import { defineComponent, h, object } from "../../../index.ts";
import { showcaseClasses } from "../../../lib/utilities/showcase-utilities.ts";

/**
 * Metrics Bar Component
 * Sticky metrics bar displaying key performance indicators
 * Uses Open Props for consistent styling and animations
 */
defineComponent("showcase-metrics-bar", {
  render: (props) => {
    const metrics = props?.metrics ? JSON.parse(props.metrics) : [
      { label: "Bundle Size:", value: "0kb", id: "bundle-size" },
      { label: "Components:", value: "0", id: "component-count" },
      { label: "Render Time:", value: "0ms", id: "render-time" },
      { label: "Memory:", value: "0MB", id: "memory-usage" },
      { label: "Type Coverage:", value: "100%", id: "type-coverage" },
    ];

    return (
      <div class={showcaseClasses.showcaseMetricsBar}>
        <div class={showcaseClasses.showcaseMetricsContainer}>
          {metrics.map((metric: any) => {
            const valueClass = metric.variant === "warning"
              ? `${showcaseClasses.showcaseMetricValue} warning`
              : metric.variant === "danger"
              ? `${showcaseClasses.showcaseMetricValue} danger`
              : showcaseClasses.showcaseMetricValue;

            return (
              <div class={showcaseClasses.showcaseMetric}>
                <span class={showcaseClasses.showcaseMetricLabel}>
                  {metric.label}
                </span>
                <span class={valueClass} id={metric.id}>
                  {metric.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});