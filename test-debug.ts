#!/usr/bin/env deno run --allow-read --allow-net
import { number, string } from "./lib/prop-helpers.ts";

// Test render parameter parsing on the api-counter render function
const testRenderFunction = (
  {
    currentValue: _currentValue = number(0),
    step: _step = number(1),
    lastAction: _lastAction = string("none"),
  },
  _api,
  _classes,
) => "test";

console.log("Function string:");
console.log(testRenderFunction.toString());
console.log("\n--- End function string ---\n");

// Test the regex match
const funcStr = testRenderFunction.toString();
const paramMatch = funcStr.match(
  /^\s*(?:async\s+)?(?:\w+\s*=>|\(([^)]*)\)\s*=>|function[^(]*\(([^)]*)\))/,
);
console.log("Param match:", paramMatch);
if (paramMatch) {
  const paramList = paramMatch[1] || paramMatch[2] || "";
  console.log("Param list:", paramList);
  const firstParam = paramList.split(",")[0]?.trim();
  console.log("First param:", firstParam);
}
