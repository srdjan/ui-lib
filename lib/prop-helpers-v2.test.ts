import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  typedString,
  typedNumber,
  typedBoolean,
  typedArray,
  typedObject,
  isTypedPropHelper,
} from "./prop-helpers-v2.ts";

Deno.test("typedString returns correctly typed string values", () => {
  const helper = typedString("default");
  
  // Test default value
  assertEquals(helper.defaultValue, "default");
  assertEquals(helper.type, "string");
  assertEquals(helper.required, false);
  
  // Test parsing
  const attrs = { "test-prop": "hello" };
  const value = helper.parse(attrs, "testProp");
  assertEquals(value, "hello");
  
  // Test missing with default
  const value2 = helper.parse({}, "testProp");
  assertEquals(value2, "default");
});

Deno.test("typedString throws for missing required prop", () => {
  const helper = typedString(); // No default = required
  
  assertEquals(helper.required, true);
  
  assertThrows(
    () => helper.parse({}, "testProp"),
    Error,
    "Required string prop 'testProp' is missing"
  );
});

Deno.test("typedNumber returns correctly typed number values", () => {
  const helper = typedNumber(42);
  
  // Test default value
  assertEquals(helper.defaultValue, 42);
  assertEquals(helper.type, "number");
  assertEquals(helper.required, false);
  
  // Test parsing
  const attrs = { "test-prop": "123" };
  const value = helper.parse(attrs, "testProp");
  assertEquals(value, 123);
  
  // Test missing with default
  const value2 = helper.parse({}, "testProp");
  assertEquals(value2, 42);
});

Deno.test("typedNumber provides helpful error for invalid values", () => {
  const helper = typedNumber();
  
  assertThrows(
    () => helper.parse({ "test-prop": "not-a-number" }, "testProp"),
    Error,
    "Invalid number value for prop 'testProp': not-a-number. Expected a valid number but got \"not-a-number\"."
  );
});

Deno.test("typedBoolean returns correctly typed boolean values", () => {
  const helper = typedBoolean(true);
  
  // Test default value
  assertEquals(helper.defaultValue, true);
  assertEquals(helper.type, "boolean");
  assertEquals(helper.required, false);
  
  // Test parsing - presence based
  const attrs = { "is-active": "" };
  const value = helper.parse(attrs, "isActive");
  assertEquals(value, true);
  
  // Test missing with default
  const value2 = helper.parse({}, "isActive");
  assertEquals(value2, true);
  
  // Test absence
  const helper2 = typedBoolean(false);
  const value3 = helper2.parse({}, "isActive");
  assertEquals(value3, false);
});

Deno.test("typedArray returns correctly typed array values", () => {
  const helper = typedArray<string>(["default"]);
  
  // Test default value
  assertEquals(helper.defaultValue, ["default"]);
  assertEquals(helper.type, "array");
  assertEquals(helper.required, false);
  
  // Test parsing
  const attrs = { items: '["a","b","c"]' };
  const value = helper.parse(attrs, "items");
  assertEquals(value, ["a", "b", "c"]);
  
  // Test missing with default
  const value2 = helper.parse({}, "items");
  assertEquals(value2, ["default"]);
});

Deno.test("typedArray provides helpful error for invalid JSON", () => {
  const helper = typedArray();
  
  assertThrows(
    () => helper.parse({ items: "not-json" }, "items"),
    Error,
    "Invalid JSON array for prop 'items': not-json"
  );
});

Deno.test("typedArray provides helpful error for non-array JSON", () => {
  const helper = typedArray();
  
  assertThrows(
    () => helper.parse({ items: '{"not":"array"}' }, "items"),
    Error,
    "Prop 'items' must be a valid JSON array. Got object instead."
  );
});

Deno.test("typedObject returns correctly typed object values", () => {
  const helper = typedObject({ theme: "dark" });
  
  // Test default value
  assertEquals(helper.defaultValue, { theme: "dark" });
  assertEquals(helper.type, "object");
  assertEquals(helper.required, false);
  
  // Test parsing
  const attrs = { config: '{"theme":"light","size":10}' };
  const value = helper.parse(attrs, "config");
  assertEquals(value, { theme: "light", size: 10 } as any);
  
  // Test missing with default
  const value2 = helper.parse({}, "config");
  assertEquals(value2, { theme: "dark" });
});

Deno.test("typedObject provides helpful error for arrays", () => {
  const helper = typedObject();
  
  assertThrows(
    () => helper.parse({ config: '["not","object"]' }, "config"),
    Error,
    "Prop 'config' must be a valid JSON object. Got array instead."
  );
});

Deno.test("isTypedPropHelper correctly identifies typed helpers", () => {
  const stringHelper = typedString("test");
  const numberHelper = typedNumber(42);
  const booleanHelper = typedBoolean(true);
  const arrayHelper = typedArray([]);
  const objectHelper = typedObject({});
  
  // All typed helpers should be identified
  assertEquals(isTypedPropHelper(stringHelper), true);
  assertEquals(isTypedPropHelper(numberHelper), true);
  assertEquals(isTypedPropHelper(booleanHelper), true);
  assertEquals(isTypedPropHelper(arrayHelper), true);
  assertEquals(isTypedPropHelper(objectHelper), true);
  
  // Non-helpers should not be identified
  assertEquals(isTypedPropHelper("string"), false);
  assertEquals(isTypedPropHelper(42), false);
  assertEquals(isTypedPropHelper(true), false);
  assertEquals(isTypedPropHelper([]), false);
  assertEquals(isTypedPropHelper({}), false);
  assertEquals(isTypedPropHelper(null), false);
  assertEquals(isTypedPropHelper(undefined), false);
});

Deno.test("camelCase to kebab-case conversion works correctly", () => {
  const helper = typedString("test");
  
  // Test camelCase prop name
  const attrs = { "my-prop-name": "value" };
  const value = helper.parse(attrs, "myPropName");
  assertEquals(value, "value");
  
  // Test direct match also works
  const attrs2 = { "directMatch": "value2" };
  const value2 = helper.parse(attrs2, "directMatch");
  assertEquals(value2, "value2");
});

Deno.test("typed helpers maintain backward compatibility", async () => {
  // Import using compatibility exports
  const { string2, number2, boolean2, array2, object2 } = await import("./prop-helpers-v2.ts");
  
  // Test that they work the same way
  const s = string2("test");
  assertEquals(s.defaultValue, "test");
  
  const n = number2(42);
  assertEquals(n.defaultValue, 42);
  
  const b = boolean2(true);
  assertEquals(b.defaultValue, true);
  
  const a = array2([1, 2, 3]);
  assertEquals(a.defaultValue, [1, 2, 3]);
  
  const o = object2({ key: "value" });
  assertEquals(o.defaultValue, { key: "value" });
});