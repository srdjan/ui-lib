// Tests for token-based Button component
import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Button } from "./token-button.ts";

Deno.test("Button renders with default tokens", () => {
  const html = Button({ children: "Click me" });

  assertStringIncludes(html, "ui-button");
  assertStringIncludes(html, "ui-button--primary");
  assertStringIncludes(html, "ui-button--md");
  assertStringIncludes(html, "Click me");
});

Deno.test("Button applies size variants", () => {
  const small = Button({ size: "sm", children: "Small" });
  assertStringIncludes(small, "ui-button--sm");

  const large = Button({ size: "lg", children: "Large" });
  assertStringIncludes(large, "ui-button--lg");
});

Deno.test("Button applies style variants", () => {
  const secondary = Button({ variant: "secondary", children: "Secondary" });
  assertStringIncludes(secondary, "ui-button--secondary");

  const outline = Button({ variant: "outline", children: "Outline" });
  assertStringIncludes(outline, "ui-button--outline");

  const ghost = Button({ variant: "ghost", children: "Ghost" });
  assertStringIncludes(ghost, "ui-button--ghost");

  const destructive = Button({ variant: "destructive", children: "Delete" });
  assertStringIncludes(destructive, "ui-button--destructive");
});

Deno.test("Button handles disabled state", () => {
  const disabled = Button({ disabled: true, children: "Disabled" });
  assertStringIncludes(disabled, 'disabled="true"');
  assertStringIncludes(disabled, 'aria-disabled="true"');
});

Deno.test("Button handles loading state", () => {
  const loading = Button({
    loading: true,
    loadingText: "Saving...",
    children: "Save",
  });
  assertStringIncludes(loading, "ui-button__content--loading");
  assertStringIncludes(loading, "ui-button__loading--visible");
  assertStringIncludes(loading, "Saving...");
  assertStringIncludes(loading, "ui-button__spinner");
});

Deno.test("Button handles icons", () => {
  const withIcons = Button({
    leftIcon: "📁",
    rightIcon: "→",
    children: "File",
  });
  assertStringIncludes(withIcons, "📁");
  assertStringIncludes(withIcons, "→");
  assertStringIncludes(withIcons, "File");
});

Deno.test("Button handles full width", () => {
  const fullWidth = Button({ fullWidth: true, children: "Full Width" });
  assertStringIncludes(fullWidth, "ui-button--fullwidth");
});

Deno.test("Button generates CSS variable definitions", () => {
  const cssVars = Button.cssVarDefinitions;

  // Check for key CSS variables
  assertStringIncludes(cssVars, "--button-base-height");
  assertStringIncludes(cssVars, "--button-primary-background");
  assertStringIncludes(cssVars, "--button-secondary-background");
  assertStringIncludes(cssVars, "--button-disabled-opacity");
});

Deno.test("Button injectStyles generates complete stylesheet", () => {
  const styles = Button.injectStyles();

  // Check for component styles
  assertStringIncludes(styles, "ui-button");
  assertStringIncludes(styles, "var(--button");

  // Check for CSS variable definitions
  assertStringIncludes(styles, ":root");
  assertStringIncludes(styles, "--button-base-height");

  // Check for animations
  assertStringIncludes(styles, "@keyframes ui-button-spin");
});

Deno.test("Button component is sealed (no access to internals)", () => {
  // Button function only exposes specific properties
  assertEquals(typeof Button, "function");
  assertEquals(typeof Button.componentName, "string");
  assertEquals(Button.componentName, "button");
  assertEquals(typeof Button.tokenContract, "object");
  assertEquals(typeof Button.injectStyles, "function");

  // No access to internal css function or other utilities
  assertEquals((Button as any).css, undefined);
  assertEquals((Button as any).render, undefined);
});
