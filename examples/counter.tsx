import { html, raw } from "../src/lib/ssr.ts";
import { component } from "../src/index.ts";

// Reusable view so SSR can import it
type CounterState = { count: number };
type CounterProps = { step?: number };
export function CounterView(
  state: CounterState, 
  props: CounterProps,
  htmxAction?: (action: string, args?: unknown[]) => string
): string {
  const step = props.step ?? 1;
  
  if (!htmxAction) {
    // SSR-only version (no interactivity)
    return html`
      <div class="counter">
        <button type="button" disabled>-</button>
        <span>${state.count}</span>
        <button type="button" disabled>+</button>
        <button type="button" disabled>Reset</button>
        <small style="margin-left:8px;color:#777;">Step: ${step}</small>
      </div>
    `;
  }
  
  // Interactive version with HTMX
  return html`
    <div class="counter">
      <button type="button" ${raw(htmxAction('dec', [step]))}>-</button>
      <span>${state.count}</span>
      <button type="button" ${raw(htmxAction('inc', [step]))}>+</button>
      <button type="button" ${raw(htmxAction('reset'))}>Reset</button>
      <small style="margin-left:8px;color:#777;">Step: ${step}</small>
    </div>
  `;
}

// Pipeline API example
const styles = `
    .counter {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: monospace;
    }
    .counter button {
      padding: 0.25rem 0.5rem;
      border: 1px solid #666;
      border-radius: 2px;
      background: #f0f0f0;
      cursor: pointer;
    }
    .counter button:hover {
      background: #e0e0e0;
    }
    .counter span {
      min-width: 2rem;
      text-align: center;
      font-weight: bold;
    }
  `;

// Register SSR component using the ergonomic builder API
component("f-counter-pipeline")
  .state({ count: 0 })
  .props({ step: "number?" })
  .actions({
    inc: (state, ...args: unknown[]) => {
      const step = (args[0] as number | undefined) ?? 1;
      return { count: (state as any).count + step };
    },
    dec: (state, ...args: unknown[]) => {
      const step = (args[0] as number | undefined) ?? 1;
      return { count: (state as any).count - step };
    },
    reset: () => ({ count: 0 }),
  })
  .styles(styles)
  .view((state, props, actions) => {
    const { htmxAction } = actions as { htmxAction: (action: string, args?: unknown[]) => string };
    return CounterView(state as CounterState, props as CounterProps, htmxAction);
  });
