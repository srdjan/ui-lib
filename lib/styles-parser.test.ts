import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { isUnifiedStyles, parseUnifiedStyles } from "./styles-parser.ts";

Deno.test("parseUnifiedStyles supports object and string forms", () => {
  const styles = {
    Button: { backgroundColor: "red", fontSize: "14px" },
    Alert: ".alert { color: blue; }",
    Card: "{ padding: 8px; margin: 0; }",
  } as const;

  const { classMap, combinedCss } = parseUnifiedStyles(styles);

  // Object and string keys mapped to kebab-case class names or extracted names
  assertEquals(typeof classMap.Button, "string");
  assertEquals(classMap.Alert, "alert");
  assertEquals(typeof classMap.Card, "string");

  // Combined CSS contains expected selectors
  assert(combinedCss.includes(`.${classMap.Button}`));
  assert(combinedCss.includes(".alert"));
});

Deno.test("isUnifiedStyles identifies unified styles objects", () => {
  assert(isUnifiedStyles({ A: { color: "red" }, B: ".x{y:1}" }));
  assertEquals(isUnifiedStyles(["not", "styles"]), false);
  assertEquals(isUnifiedStyles(null), false);
});
