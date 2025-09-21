// ButtonGroup component - Groups buttons with consistent spacing and styling
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { BaseComponentProps, ComponentSize } from "../types.ts";

export type ButtonGroupVariant = "attached" | "spaced";
export type ButtonGroupOrientation = "horizontal" | "vertical";

export type ButtonGroupProps = BaseComponentProps & {
  readonly variant?: ButtonGroupVariant;
  readonly size?: ComponentSize;
  readonly orientation?: ButtonGroupOrientation;
  readonly children?: unknown[];
};

/**
 * ButtonGroup component - Groups buttons with consistent spacing and styling
 *
 * @example
 * ```tsx
 * // Attached buttons (seamless)
 * ButtonGroup({
 *   variant: "attached",
 *   children: [
 *     Button({ children: "Left" }),
 *     Button({ children: "Center" }),
 *     Button({ children: "Right" })
 *   ]
 * })
 *
 * // Spaced buttons
 * ButtonGroup({
 *   variant: "spaced",
 *   size: "lg",
 *   children: [
 *     Button({ variant: "primary", children: "Save" }),
 *     Button({ variant: "outline", children: "Cancel" })
 *   ]
 * })
 * ```
 */
export function ButtonGroup(props: ButtonGroupProps): string {
  const {
    variant = "attached",
    size = "md",
    orientation = "horizontal",
    className = "",
    children = [],
  } = props;

  const styles = css({
    group: {
      display: "flex",
      flexDirection: orientation === "vertical" ? "column" : "row",

      // Attached variant styles
      ...(variant === "attached" && {
        "& > *": {
          margin: 0,
          position: "relative",

          // Horizontal attached buttons
          ...(orientation === "horizontal" && {
            borderRadius: 0,
            "&:first-child": {
              borderTopLeftRadius: componentTokens.radius.md,
              borderBottomLeftRadius: componentTokens.radius.md,
            },
            "&:last-child": {
              borderTopRightRadius: componentTokens.radius.md,
              borderBottomRightRadius: componentTokens.radius.md,
            },
            "&:not(:last-child)": {
              borderRightWidth: 0,
              marginRight: "-1px",
            },
            "&:hover": {
              zIndex: 1,
            },
            "&:focus": {
              zIndex: 2,
            },
          }),

          // Vertical attached buttons
          ...(orientation === "vertical" && {
            borderRadius: 0,
            "&:first-child": {
              borderTopLeftRadius: componentTokens.radius.md,
              borderTopRightRadius: componentTokens.radius.md,
            },
            "&:last-child": {
              borderBottomLeftRadius: componentTokens.radius.md,
              borderBottomRightRadius: componentTokens.radius.md,
            },
            "&:not(:last-child)": {
              borderBottomWidth: 0,
              marginBottom: "-1px",
            },
            "&:hover": {
              zIndex: 1,
            },
            "&:focus": {
              zIndex: 2,
            },
          }),
        },
      }),

      // Spaced variant styles
      ...(variant === "spaced" && {
        gap: getSizeGap(size),

        "& > *": {
          // Preserve individual button styles
        },
      }),
    },
  });

  const attributeString = [
    `class="${styles.classMap.group} ${className}".trim()`,
    `role="group"`,
    `aria-label="Button group"`,
  ].join(" ");

  // Join children (assuming they're already rendered strings)
  const childrenString = Array.isArray(children)
    ? children.filter(Boolean).join("")
    : String(children || "");

  return `<div ${attributeString}>${childrenString}</div>`;
}

/**
 * Get spacing gap based on size
 */
function getSizeGap(size: ComponentSize): string {
  const sizeMap: Record<ComponentSize, string> = {
    xs: componentTokens.spacing[1], // 4px
    sm: componentTokens.spacing[1.5], // 6px
    md: componentTokens.spacing[2], // 8px
    lg: componentTokens.spacing[3], // 12px
    xl: componentTokens.spacing[4], // 16px
  };

  return sizeMap[size] || sizeMap.md;
}
