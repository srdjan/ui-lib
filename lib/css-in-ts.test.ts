import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  composeStyles,
  createTheme,
  css,
  cssHelpers,
  responsive,
} from "./css-in-ts.ts";

Deno.test("css() generates class names and CSS", () => {
  const result = css({
    button: {
      padding: "10px",
      background: "blue",
      color: "white",
    },
    container: {
      display: "flex",
      justifyContent: "center",
    },
  });

  // Check class map generation
  assertEquals(typeof result.classMap.button, "string");
  assertEquals(typeof result.classMap.container, "string");

  // Check CSS generation
  assertStringIncludes(result.css, "padding: 10px;");
  assertStringIncludes(result.css, "background: blue;");
  assertStringIncludes(result.css, "color: white;");
  assertStringIncludes(result.css, "display: flex;");
  assertStringIncludes(result.css, "justify-content: center;");
});

Deno.test("css() handles numeric values with px units", () => {
  const result = css({
    box: {
      width: 100,
      height: 50,
      padding: 20,
      margin: 0,
    },
  });

  assertStringIncludes(result.css, "width: 100px;");
  assertStringIncludes(result.css, "height: 50px;");
  assertStringIncludes(result.css, "padding: 20px;");
  assertStringIncludes(result.css, "margin: 0px;");
});

Deno.test("css() handles unitless properties correctly", () => {
  const result = css({
    flex: {
      opacity: 0.5,
      flexGrow: 1,
      flexShrink: 0,
      zIndex: 10,
      fontWeight: 700,
      lineHeight: 1.5,
    },
  });

  assertStringIncludes(result.css, "opacity: 0.5;");
  assertStringIncludes(result.css, "flex-grow: 1;");
  assertStringIncludes(result.css, "flex-shrink: 0;");
  assertStringIncludes(result.css, "z-index: 10;");
  assertStringIncludes(result.css, "font-weight: 700;");
  assertStringIncludes(result.css, "line-height: 1.5;");
});

Deno.test("css() handles pseudo-selectors", () => {
  const result = css({
    link: {
      color: "blue",
      "&:hover": {
        color: "darkblue",
        textDecoration: "underline",
      },
      "&:active": {
        color: "navy",
      },
    },
  });

  assertStringIncludes(result.css, ":hover");
  assertStringIncludes(result.css, "color: darkblue;");
  assertStringIncludes(result.css, "text-decoration: underline;");
  assertStringIncludes(result.css, ":active");
  assertStringIncludes(result.css, "color: navy;");
});

Deno.test("css() handles media queries", () => {
  const result = css({
    responsive: {
      fontSize: "16px",
      "@media": {
        mobile: {
          fontSize: "14px",
        },
        desktop: {
          fontSize: "18px",
        },
      },
    },
  });

  assertStringIncludes(result.css, "@media (max-width: 640px)");
  assertStringIncludes(result.css, "font-size: 14px;");
  assertStringIncludes(
    result.css,
    "@media (min-width: 1025px) and (max-width: 1440px)",
  );
  assertStringIncludes(result.css, "font-size: 18px;");
});

Deno.test("css() handles CSS custom properties", () => {
  const result = css({
    themed: {
      "--primary-color": "#007bff",
      "--spacing": "1rem",
      color: "var(--primary-color)",
      padding: "var(--spacing)",
    },
  });

  assertStringIncludes(result.css, "--primary-color: #007bff;");
  assertStringIncludes(result.css, "--spacing: 1rem;");
  assertStringIncludes(result.css, "color: var(--primary-color);");
  assertStringIncludes(result.css, "padding: var(--spacing);");
});

Deno.test("createTheme() generates CSS variables and tokens", () => {
  const theme = createTheme({
    colors: {
      primary: "#007bff",
      secondary: "#6c757d",
    },
    space: {
      1: "0.25rem",
      2: "0.5rem",
    },
  });

  const vars = theme.vars();
  assertStringIncludes(vars, ":root");
  assertStringIncludes(vars, "--colors-primary: #007bff;");
  assertStringIncludes(vars, "--colors-secondary: #6c757d;");
  assertStringIncludes(vars, "--space-1: 0.25rem;");
  assertStringIncludes(vars, "--space-2: 0.5rem;");

  assertEquals(theme.token("colors", "primary"), "var(--colors-primary)");
  assertEquals(theme.token("space", 1), "var(--space-1)");
});

Deno.test("cssHelpers provide common patterns", () => {
  const center = cssHelpers.center();
  assertEquals(center.display, "flex");
  assertEquals(center.justifyContent, "center");
  assertEquals(center.alignItems, "center");

  const cover = cssHelpers.cover();
  assertEquals(cover.position, "absolute");
  assertEquals(cover.top, 0);
  assertEquals(cover.right, 0);
  assertEquals(cover.bottom, 0);
  assertEquals(cover.left, 0);

  const truncate = cssHelpers.truncate();
  assertEquals(truncate.overflow, "hidden");
  assertEquals(truncate.textOverflow, "ellipsis");
  assertEquals(truncate.whiteSpace, "nowrap");

  const button = cssHelpers.resetButton();
  assertEquals(button.background, "none");
  assertEquals(button.border, "none");
  assertEquals(button.cursor, "pointer");
});

Deno.test("composeStyles merges multiple style objects", () => {
  const base = { padding: "10px", color: "blue" };
  const hover = { color: "red", background: "yellow" };
  const active = { background: "green" };

  const composed = composeStyles(base, hover, active);

  assertEquals(composed.padding, "10px");
  assertEquals(composed.color, "red"); // hover overrides base
  assertEquals(composed.background, "green"); // active overrides hover
});

Deno.test("composeStyles filters out undefined values", () => {
  const style1 = { padding: "10px" };
  const style2 = undefined;
  const style3 = { margin: "20px" };

  const composed = composeStyles(style1, style2, style3);

  assertEquals(composed.padding, "10px");
  assertEquals(composed.margin, "20px");
  assertEquals(Object.keys(composed).length, 2);
});

Deno.test("responsive() creates media query structure", () => {
  const result = responsive({
    base: {
      fontSize: "16px",
      color: "black",
    },
    mobile: {
      fontSize: "14px",
    },
    desktop: {
      fontSize: "18px",
    },
  });

  assertEquals(result.fontSize, "16px");
  assertEquals(result.color, "black");
  assertEquals(result["@media"]?.mobile?.fontSize, "14px");
  assertEquals(result["@media"]?.desktop?.fontSize, "18px");
});

Deno.test("css() converts camelCase to kebab-case", () => {
  const result = css({
    test: {
      backgroundColor: "red",
      borderTopWidth: "1px",
      marginBottom: "10px",
    },
  });

  assertStringIncludes(result.css, "background-color: red;");
  assertStringIncludes(result.css, "border-top-width: 1px;");
  assertStringIncludes(result.css, "margin-bottom: 10px;");
});

Deno.test("css() generates unique class names", () => {
  const result = css({
    button: { color: "blue" },
    buttonPrimary: { color: "green" },
    buttonSecondary: { color: "red" },
  });

  // All class names should be unique
  const classNames = Object.values(result.classMap);
  const uniqueNames = new Set(classNames);
  assertEquals(classNames.length, uniqueNames.size);

  // Class names should be based on the key
  assertStringIncludes(result.classMap.button, "button");
  assertStringIncludes(result.classMap.buttonPrimary, "button-primary");
  assertStringIncludes(result.classMap.buttonSecondary, "button-secondary");
});
