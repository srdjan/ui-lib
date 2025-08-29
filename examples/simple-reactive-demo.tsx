/** @jsx h */
/// <reference path="../src/lib/jsx.d.ts" />
import {
  defineComponent,
  h,
  string,
  number,
} from "../src/index.ts";

// Simple theme controller for demo
defineComponent("theme-controller", {
  styles: {
    container: `{
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: #f8f9fa;
    }`,
    button: `{
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }`
  },
  render: ({}) => (
    <div class="container">
      <span>Theme Demo:</span>
      <button class="button" onclick="document.documentElement.style.setProperty('--theme-bg', '#ffffff')">Light</button>
      <button class="button" onclick="document.documentElement.style.setProperty('--theme-bg', '#333333')">Dark</button>
    </div>
  )
});

// Simple reactive card
defineComponent("reactive-card", {
  styles: {
    card: `{
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: var(--theme-bg, white);
      color: var(--theme-text, black);
      transition: all 0.3s ease;
    }`
  },
  render: ({ title = string("Card") }) => (
    <div class="card">
      <h3>{title}</h3>
      <p>This card responds to CSS custom properties!</p>
    </div>
  )
});