/**
 * Stat Component - Display key statistics and metrics
 * Provides consistent styling for numerical data display
 */

import { defineComponent } from "../../internal.ts";

export type StatProps = {
  readonly value: string | number;
  readonly label: string;
  readonly description?: string;
  readonly variant?: "default" | "large" | "small";
  readonly color?: "default" | "primary" | "success" | "warning" | "danger";
  readonly className?: string;
  readonly id?: string;
};

defineComponent<StatProps>("stat", {
  render: (props) => {
    const {
      value,
      label,
      description = "",
      variant = "default",
      color = "default",
      className = "",
      id = "",
    } = props;

    const classes = ["stat"];
    classes.push(`stat--${variant}`);
    classes.push(`stat--${color}`);
    if (className) classes.push(className);

    const attributes = [
      `class="${classes.join(" ")}"`,
      id ? `id="${id}"` : "",
    ].filter(Boolean);

    return `
      <div ${attributes.join(" ")}>
        <span class="stat__value">${value}</span>
        <span class="stat__label">${label}</span>
        ${
      description ? `<span class="stat__description">${description}</span>` : ""
    }
      </div>
    `;
  },
});

export const Stat = "stat";
