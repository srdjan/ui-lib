/** @jsxImportSource https://esm.sh/mono-jsx */
import { component } from "../src/index.ts";

// Pipeline API example
component("f-counter-pipeline")
  .state({ count: 0 })
  .props({ step: "number?" })
  .actions({
    inc: (state, step = 1) => ({ count: state.count + step }),
    dec: (state, step = 1) => ({ count: state.count - step }),
    reset: () => ({ count: 0 }),
  })
  .styles(`
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
  `)
  .view((state, props, { inc, dec, reset }) =>
    (
      <div class="counter">
        <button onClick={() => dec(props.step)}>-</button>
        <span>{state.count}</span>
        <button onClick={() => inc(props.step)}>+</button>
        <button onClick={reset}>Reset</button>
      </div>
    ) as unknown as Node
  );
