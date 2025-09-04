// Type-safe CSS property definitions for ui-lib
// Provides full TypeScript support for CSS-in-JS with IntelliSense

export type CSSProperties = {
  // Layout
  display?:
    | "none"
    | "block"
    | "inline"
    | "inline-block"
    | "flex"
    | "inline-flex"
    | "grid"
    | "inline-grid"
    | "table"
    | "table-row"
    | "table-cell"
    | "contents"
    | "list-item"
    | "flow-root"
    | string;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky" | string;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number | string;
  content?: string;

  // Flexbox
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  flexBasis?: string | number;
  flexGrow?: number;
  flexShrink?: number;
  flex?: string | number;
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch";
  alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  alignSelf?:
    | "auto"
    | "flex-start"
    | "flex-end"
    | "center"
    | "baseline"
    | "stretch";
  alignContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "stretch";
  order?: number;

  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridTemplateAreas?: string;
  gridTemplate?: string;
  gridColumnGap?: string | number;
  gridRowGap?: string | number;
  gridGap?: string | number;
  gap?: string | number;
  gridAutoColumns?: string;
  gridAutoRows?: string;
  gridAutoFlow?: "row" | "column" | "row dense" | "column dense";
  grid?: string;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;

  // Box Model
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  paddingBlock?: string | number;
  paddingInline?: string | number;
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginBlock?: string | number;
  marginInline?: string | number;

  // Border
  border?: string | number;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderColor?: string;
  borderStyle?:
    | "none"
    | "hidden"
    | "dotted"
    | "dashed"
    | "solid"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";
  borderWidth?: string | number;
  borderTopWidth?: string | number;
  borderRightWidth?: string | number;
  borderBottomWidth?: string | number;
  borderLeftWidth?: string | number;
  borderRadius?: string | number;
  borderTopLeftRadius?: string | number;
  borderTopRightRadius?: string | number;
  borderBottomLeftRadius?: string | number;
  borderBottomRightRadius?: string | number;

  // Typography
  font?: string;
  fontSize?: string | number;
  fontFamily?: string;
  fontWeight?:
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | "normal"
    | "bold"
    | "lighter"
    | "bolder"
    | string;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
  textDecoration?: string;
  textTransform?:
    | "none"
    | "capitalize"
    | "uppercase"
    | "lowercase"
    | "full-width";
  textOverflow?: "clip" | "ellipsis" | string;
  whiteSpace?:
    | "normal"
    | "nowrap"
    | "pre"
    | "pre-wrap"
    | "pre-line"
    | "break-spaces";
  wordBreak?: "normal" | "break-all" | "keep-all" | "break-word";

  // Color & Background
  color?: string;
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "auto" | "cover" | "contain" | string;
  backgroundPosition?: string;
  backgroundRepeat?:
    | "repeat"
    | "repeat-x"
    | "repeat-y"
    | "no-repeat"
    | "space"
    | "round";
  backgroundClip?: "border-box" | "padding-box" | "content-box" | "text";
  opacity?: number | string;

  // Effects
  boxShadow?: string;
  textShadow?: string;
  filter?: string;
  backdropFilter?: string;

  // Transforms
  transform?: string;
  transformOrigin?: string;
  transformStyle?: "flat" | "preserve-3d";
  perspective?: string | number;
  perspectiveOrigin?: string;

  // Transitions & Animations
  transition?: string;
  transitionProperty?: string;
  transitionDuration?: string;
  transitionTimingFunction?: string;
  transitionDelay?: string;
  animation?: string;
  animationName?: string;
  animationDuration?: string;
  animationTimingFunction?: string;
  animationDelay?: string;
  animationIterationCount?: number | "infinite";
  animationDirection?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  animationFillMode?: "none" | "forwards" | "backwards" | "both";
  animationPlayState?: "paused" | "running";

  // Other
  clip?: string;
  resize?: "none" | "both" | "horizontal" | "vertical" | "block" | "inline";
  overflow?: "visible" | "hidden" | "scroll" | "auto" | "clip";
  overflowX?: "visible" | "hidden" | "scroll" | "auto" | "clip";
  overflowY?: "visible" | "hidden" | "scroll" | "auto" | "clip";
  cursor?:
    | "auto"
    | "default"
    | "none"
    | "context-menu"
    | "help"
    | "pointer"
    | "progress"
    | "wait"
    | "cell"
    | "crosshair"
    | "text"
    | "vertical-text"
    | "alias"
    | "copy"
    | "move"
    | "no-drop"
    | "not-allowed"
    | "grab"
    | "grabbing"
    | string;
  userSelect?: "auto" | "none" | "text" | "all";
  pointerEvents?: "auto" | "none";
  visibility?: "visible" | "hidden" | "collapse";
  outline?: string;
  outlineColor?: string;
  outlineStyle?: string;
  outlineWidth?: string | number;
  outlineOffset?: string | number;

  // CSS Variables (custom properties)
  [key: `--${string}`]: string | number;
};

// Pseudo-selectors and pseudo-elements
export type PseudoSelectors = {
  "&:hover"?: CSSProperties;
  "&:focus"?: CSSProperties;
  "&:active"?: CSSProperties;
  "&:visited"?: CSSProperties;
  "&:disabled"?: CSSProperties;
  "&:checked"?: CSSProperties;
  "&:first-child"?: CSSProperties;
  "&:last-child"?: CSSProperties;
  "&:nth-child(n)"?: CSSProperties;
  "&:before"?: CSSProperties;
  "&:after"?: CSSProperties;
  "&::before"?: CSSProperties;
  "&::after"?: CSSProperties;
  "&::placeholder"?: CSSProperties;
  "&[data-disabled]"?: CSSProperties;
  "&[data-active]"?: CSSProperties;
  [key: `&:${string}`]: CSSProperties | undefined;
  [key: `&[${string}]`]: CSSProperties | undefined;
};

// Media queries for responsive design
export type MediaQueries = {
  "@media"?: {
    mobile?: CSSProperties & PseudoSelectors;
    tablet?: CSSProperties & PseudoSelectors;
    desktop?: CSSProperties & PseudoSelectors;
    wide?: CSSProperties & PseudoSelectors;
    print?: CSSProperties & PseudoSelectors;
    [key: string]: (CSSProperties & PseudoSelectors) | undefined;
  };
};

// Complete style object with all features
export type StyleObject = CSSProperties & PseudoSelectors & MediaQueries;

// Style map for components
export type StyleMap = Record<string, StyleObject>;

// Theme tokens for design system integration
export interface ThemeTokens {
  colors?: Record<string, string>;
  space?: Record<string | number, string>;
  sizes?: Record<string | number, string>;
  fonts?: Record<string, string>;
  fontSizes?: Record<string | number, string>;
  fontWeights?: Record<string | number, string | number>;
  lineHeights?: Record<string | number, string | number>;
  letterSpacing?: Record<string | number, string>;
  radii?: Record<string | number, string>;
  shadows?: Record<string, string>;
  transitions?: Record<string, string>;
  breakpoints?: Record<string, string>;
}

// Default breakpoints for responsive design
export const defaultBreakpoints = {
  mobile: "(max-width: 640px)",
  tablet: "(min-width: 641px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px) and (max-width: 1440px)",
  wide: "(min-width: 1441px)",
  print: "print",
} as const;

// Utility type for extracting CSS variable names
export type CSSVariable<T extends string = string> = `var(--${T})`;

// Helper type for responsive values
export type ResponsiveValue<T> = T | {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
};
