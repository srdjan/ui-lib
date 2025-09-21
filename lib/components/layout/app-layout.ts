/**
 * App Layout Preset - Standard application layout
 * Provides a complete application layout with header, main content, and footer
 */

import { defineComponent } from "../../define-component.ts";
import { renderComponent } from "../../component-state.ts";
import type { LayoutProps } from "./types.ts";

defineComponent<LayoutProps>("app-layout", {
  render: (props) => {
    const {
      preset = "app",
      variant = "default",
      maxWidth = "",
      className = "",
      id = "",
      role = "main",
      ariaLabel = "Application",
    } = props;

    const classes = ["app-layout"];
    classes.push(`app-layout--${preset}`);
    classes.push(`app-layout--${variant}`);
    if (className) classes.push(className);

    const styles = [];
    if (maxWidth) styles.push(`max-width: ${maxWidth};`);

    const attributes = [
      `class="${classes.join(' ')}"`,
      styles.length > 0 ? `style="${styles.join(' ')}"` : "",
      id ? `id="${id}"` : "",
      role ? `role="${role}"` : "",
      ariaLabel ? `aria-label="${ariaLabel}"` : "",
    ].filter(Boolean);

    // Basic app layout structure
    return `
      <div ${attributes.join(" ")}>
        <div class="app-layout__container">
          {{children}}
        </div>
      </div>
    `;
  },
});

export const AppLayout = "app-layout";