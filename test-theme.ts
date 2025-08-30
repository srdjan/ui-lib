#!/usr/bin/env deno run --allow-read --allow-net
import { parseRenderParameters } from './lib/render-parameter-parser.ts';
import { string } from './lib/prop-helpers.ts';
import { h } from './lib/jsx-runtime.ts';

// Test the theme-controller render function
const testRenderFunction = ({ currentTheme = string("light") }, api, classes) => (
  h('div', { class: classes.container },
    h('h3', {}, '🎨 Global Theme Controller'),
    h('button', { 
      class: classes.button,
      onclick: `
        const newTheme = '${currentTheme}' === 'light' ? 'dark' : 'light';
      `,
    }, `Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Theme`),
  )
);

console.log('Testing theme-controller render parameter parsing:');
const result = parseRenderParameters(testRenderFunction);
console.log('Result:', result);
console.log('Has props:', result.hasProps);
console.log('Prop helpers keys:', Object.keys(result.propHelpers));