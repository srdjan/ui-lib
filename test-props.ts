#!/usr/bin/env deno run --allow-read --allow-net
import { number, string } from './lib/prop-helpers.ts';

// Test prop helper kebab-case conversion
const numberHelper = number(0);
const stringHelper = string("none");

const attrs = {'current-value': '5', 'step': '2', 'last-action': 'test'};

console.log('Testing helper with kebab-case attrs:');
try {
  console.log('currentValue:', numberHelper.parse(attrs, 'currentValue'));
  console.log('step:', numberHelper.parse(attrs, 'step'));
  console.log('lastAction:', stringHelper.parse(attrs, 'lastAction'));
} catch (error) {
  console.error('Error:', error.message);
}