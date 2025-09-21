/** @jsx h */
/**
 * Header Component - Page/section header with title hierarchy
 * Provides semantic header structure with proper heading levels
 */

import { defineComponent, h } from "../../define-component.ts";
import type { HeaderProps } from "./types.ts";

defineComponent<HeaderProps>("header", {
  render: (props) => {
    const {
      title,
      subtitle = "",
      description = "",
      level = 1,
      centered = false,
      className = "",
      id = "",
      role = "",
      ariaLabel = "",
    } = props;

    const classes = ["header"];
    if (centered) classes.push("header--centered");
    if (className) classes.push(className);

    return (
      <header
        class={classes.join(' ')}
        id={id || undefined}
        role={role || undefined}
        aria-label={ariaLabel || undefined}
      >
        <div
          class="header__title"
          dangerouslySetInnerHTML={{ __html: `<h${level}>${title}</h${level}>` }}
        />
        {subtitle && (
          <p class="header__subtitle" dangerouslySetInnerHTML={{ __html: subtitle }} />
        )}
        {description && (
          <p class="header__description" dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </header>
    );
  },
});

export const Header = "header";