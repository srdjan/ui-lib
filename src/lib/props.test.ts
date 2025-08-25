const assertEquals = (a: unknown, b: unknown, msg?: string) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    throw new Error(
      msg ?? `Expected ${JSON.stringify(a)} to equal ${JSON.stringify(b)}`,
    );
  }
};

import { createPropSpec } from "./props.ts";

Deno.test("createPropSpec parses number, boolean, string with optionals", () => {
  const spec = createPropSpec({
    n: "number",
    nb: "number?",
    b: "boolean",
    bs: "boolean?",
    s: "string",
    so: "string?",
  });
  // number
  assertEquals(spec.n.parse("2"), 2);
  assertEquals(spec.nb.parse(undefined), undefined);
  // boolean
  assertEquals(spec.b.parse(""), true);
  assertEquals(spec.b.parse("false"), false);
  assertEquals(spec.bs.parse(undefined), undefined);
  // string
  assertEquals(spec.s.parse(3), "3");
  assertEquals(spec.so.parse(undefined), undefined);
});

Deno.test("boolean attribute parsing follows HTML standards", () => {
  const spec = createPropSpec({
    disabled: "boolean",
    checked: "boolean?",
  });

  // HTML boolean attribute rules: presence = true, "false" = false
  assertEquals(spec.disabled.parse(""), true); // Empty string should be true
  assertEquals(spec.disabled.parse("true"), true);
  assertEquals(spec.disabled.parse("false"), false); // "false" string should be false
  assertEquals(spec.disabled.parse("0"), false); // "0" should be false
  assertEquals(spec.disabled.parse("1"), true);
  assertEquals(spec.disabled.parse("disabled"), true); // Any other string = true
  
  // Optional boolean
  assertEquals(spec.checked.parse(""), true);
  assertEquals(spec.checked.parse(null), undefined);
  assertEquals(spec.checked.parse("false"), false);
});
