import { html, raw } from "../src/lib/ssr.ts";
import { component } from "../src/index.ts";

// JSX-style counter following the documentation exactly
component("f-counter-pipeline")
  .state({ count: 0 })
  .props({ step: "number?" })
  .actions({
    inc: (state, ...args) => ({ count: (state as { count: number }).count + ((args[0] as number) ?? 1) }),
    dec: (state, ...args) => ({ count: (state as { count: number }).count - ((args[0] as number) ?? 1) }),
  })
  .view((state, props, actions) => {
    const count = (state as { count: number }).count;
    const step = (props as { step?: number }).step ?? 1;
    const { htmxAction } = actions as { htmxAction: (action: string, args?: unknown[]) => string };
    
    // HTMX-enabled interactive buttons
    return html`
      <div class="counter">
        <button type="button" ${raw(htmxAction('dec', [step]))}>-</button>
        <span>${count}</span>
        <button type="button" ${raw(htmxAction('inc', [step]))}>+</button>
        <small style="margin-left:8px;color:#777;">Step: ${step}</small>
      </div>
    `;
  });

// Styled counter with more features
component("f-counter-styled")
  .state({ count: 0 })
  .props({ step: "number?", max: "number?" })
  .actions({
    inc: (state, ...args) => ({
      count: Math.min((state as { count: number }).count + ((args[0] as number) ?? 1), 100),
    }),
    dec: (state, ...args) => ({
      count: Math.max((state as { count: number }).count - ((args[0] as number) ?? 1), 0),
    }),
    reset: () => ({ count: 0 }),
  })
  .styles(`
    .counter {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 0.5rem;
      border: 1px solid #666;
      background: #f0f0f0;
      cursor: pointer;
    }
  `)
  .view((state, props, actions) => {
    const count = (state as { count: number }).count;
    const step = (props as { step?: number }).step ?? 1;
    const { htmxAction } = actions as { htmxAction: (action: string, args?: unknown[]) => string };
    
    return html`
      <div class="counter">
        <button type="button" ${raw(htmxAction('dec', [step]))}>-</button>
        <span>${count}</span>
        <button type="button" ${raw(htmxAction('inc', [step]))}>+</button>
        <button type="button" ${raw(htmxAction('reset'))}>Reset</button>
        <small style="margin-left:8px;color:#777;">Step: ${step}</small>
      </div>
    `;
  });