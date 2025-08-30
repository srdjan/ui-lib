#!/usr/bin/env deno run --allow-read --allow-net
import { parseRenderParameters } from './lib/render-parameter-parser.ts';

// Test render parameter parsing on the api-counter render function
const testRenderFunction = ({
  currentValue = number(0),
  step = number(1),
  lastAction = string("none")
}, api, classes) => "test";

console.log('Testing render parameter parsing:');
const result = parseRenderParameters(testRenderFunction);
console.log('Result:', result);
console.log('Has props:', result.hasProps);
console.log('Prop helpers keys:', Object.keys(result.propHelpers));

// Import the helpers to make sure they're available
import { number, string } from './lib/prop-helpers.ts';