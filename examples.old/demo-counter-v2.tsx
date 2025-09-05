/** @jsx h */
import { router } from "./router.ts";
import { defineComponent, h } from "../index.ts";
import {
  typedBoolean as boolean2,
  typedNumber as number2,
  typedString as string2,
} from "../lib/prop-helpers-v2.ts";

/**
 * 🎯 Enhanced Counter Demo - Zero Type Checking Required!
 *
 * Compare with demo-counter.tsx to see the improvement:
 * - NO MORE: typeof initialCount === "number" ? initialCount : 0
 * - NO MORE: typeof step === "number" ? step : 1
 * - Props are already correctly typed!
 *
 * This showcases the new typed prop helpers that eliminate
 * all manual type checking in render functions.
 */
defineComponent("demo-counter-v2", {
  router,
  autoProps: true,

  styles: {
    container: `{ 
      display: inline-flex; 
      gap: 1rem; 
      padding: 1rem; 
      border: 2px solid var(--color-primary, #007bff); 
      border-radius: 8px;
      align-items: center;
    }`,
    button: `{ 
      padding: 0.5rem 1rem; 
      background: var(--color-primary, #007bff); 
      color: white; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer;
      transition: opacity 0.2s;
      font-weight: bold;
    }`,
    buttonDisabled: `{
      opacity: 0.5;
      cursor: not-allowed;
    }`,
    display: `{ 
      font-size: 1.5rem; 
      min-width: 3rem; 
      text-align: center; 
      font-weight: bold; 
      color: var(--color-primary, #007bff);
    }`,
    label: `{
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }`,
    controls: `{
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }`,
    info: `{
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #888;
    }`,
  },

  render: (
    {
      // Look how clean this is! No type checking needed!
      initialCount = number2(0), // Already a number!
      step = number2(1), // Already a number!
      maxValue = number2(100), // Already a number!
      minValue = number2(0), // Already a number!
      disabled = boolean2(false), // Already a boolean!
      theme = string2("blue"), // Already a string!
      showControls = boolean2(true), // Already a boolean!
      label = string2("Enhanced Counter"), // Already a string!
    },
    _api,
    classes,
  ) => {
    // ✨ Direct usage - no type checking required!
    const atMax = initialCount >= maxValue;
    const atMin = initialCount <= minValue;

    // Set CSS variable for theme
    const themeColor = theme === "red"
      ? "#dc3545"
      : theme === "green"
      ? "#28a745"
      : theme === "purple"
      ? "#6f42c1"
      : "#007bff";

    return (
      <div
        class={classes!.container}
        style={`--color-primary: ${themeColor};`}
        data-count={initialCount}
        data-theme={theme}
      >
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label class={classes!.label}>{label}</label>

          {showControls
            ? (
              <div class={classes!.controls}>
                <button
                  type="button"
                  class={`${classes!.button} ${
                    (atMin || disabled) ? classes!.buttonDisabled : ""
                  }`}
                  onclick={`
                  const container = this.closest('[data-count]');
                  const display = container.querySelector('[data-role="count-display"]');
                  const current = parseInt(container.dataset.count);
                  const newCount = Math.max(${minValue}, current - ${step});
                  container.dataset.count = newCount;
                  display.textContent = newCount;
                  
                  // Update button states
                  const buttons = container.querySelectorAll('button');
                  buttons[0].classList.toggle('${
                    classes!.buttonDisabled
                  }', newCount <= ${minValue});
                  buttons[1].classList.toggle('${
                    classes!.buttonDisabled
                  }', newCount >= ${maxValue});
                `}
                  disabled={atMin || disabled}
                >
                  -{step}
                </button>

                <div
                  data-role="count-display"
                  class={classes!.display}
                >
                  {initialCount}
                </div>

                <button
                  type="button"
                  class={`${classes!.button} ${
                    (atMax || disabled) ? classes!.buttonDisabled : ""
                  }`}
                  onclick={`
                  const container = this.closest('[data-count]');
                  const display = container.querySelector('[data-role="count-display"]');
                  const current = parseInt(container.dataset.count);
                  const newCount = Math.min(${maxValue}, current + ${step});
                  container.dataset.count = newCount;
                  display.textContent = newCount;
                  
                  // Update button states
                  const buttons = container.querySelectorAll('button');
                  buttons[0].classList.toggle('${
                    classes!.buttonDisabled
                  }', newCount <= ${minValue});
                  buttons[1].classList.toggle('${
                    classes!.buttonDisabled
                  }', newCount >= ${maxValue});
                `}
                  disabled={atMax || disabled}
                >
                  +{step}
                </button>
              </div>
            )
            : <div class={classes!.display}>{initialCount}</div>}

          <div class={classes!.info}>
            <div>Range: {minValue}-{maxValue}</div>
            <div>Step: {step}</div>
            <div>Theme: {theme}</div>
          </div>
        </div>
      </div>
    );
  },
});

/**
 * Side-by-side comparison component to demonstrate the improvement
 */
defineComponent("counter-comparison", {
  router,

  styles: {
    grid: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding: 2rem;
      background: #f5f5f5;
      border-radius: 8px;
    }`,
    section: `{
      background: white;
      padding: 1.5rem;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }`,
    title: `{
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #333;
    }`,
    subtitle: `{
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
    }`,
    code: `{
      background: #f0f0f0;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.875rem;
    }`,
  },

  render: (_props, _api, classes) => (
    <div class={classes!.grid}>
      <div class={classes!.section}>
        <h3 class={classes!.title}>❌ Old Way (demo-counter)</h3>
        <p class={classes!.subtitle}>
          Required manual type checking for every prop
        </p>
        <pre class={classes!.code}>{`// Lots of boilerplate!
const currentCount = typeof initialCount === "number"
  ? initialCount : 0;
const stepSize = typeof step === "number"
  ? step : 1;
// ... and so on for every prop`}</pre>
        <div style="margin-top: 1rem;">
          <demo-counter initial-count="5" step="2" theme="red" />
        </div>
      </div>

      <div class={classes!.section}>
        <h3 class={classes!.title}>✅ New Way (demo-counter-v2)</h3>
        <p class={classes!.subtitle}>
          Props are already correctly typed - zero boilerplate!
        </p>
        <pre class={classes!.code}>{`// Just use the props directly!
const atMax = initialCount >= maxValue;
const atMin = initialCount <= minValue;
// That's it! No type checking needed`}</pre>
        <div style="margin-top: 1rem;">
          <demo-counter-v2 initial-count="5" step="2" theme="green" />
        </div>
      </div>
    </div>
  ),
});
