/** @jsx h */
// deno-lint-ignore verbatim-module-syntax
import { boolean, defineComponent, h, number, string } from "../index.ts";

/**
 * 🎯 Interactive Counter Demo - Showcasing Function-Style Props
 *
 * Demonstrates:
 * ✨ Function-style props with smart type helpers
 * 🎨 CSS-only format with auto-generated classes
 * 🔧 DOM-native state management
 * ⚡ CSS property reactivity for theming
 */
defineComponent("demo-counter", {
  autoProps: true,
  // 🎨 CSS-Only Format - Auto-generated class names!
  styles: {
    counterContainer: `{ 
      display: inline-flex; 
      align-items: center; 
      gap: var(--size-4); 
      padding: var(--size-4); 
      border: var(--border-size-2) solid var(--counter-border, var(--brand)); 
      border-radius: var(--radius-3); 
      background: var(--counter-bg, var(--surface-1));
      box-shadow: var(--shadow-2);
      transition: all 0.3s ease;
    }`,

    button: `{ 
      padding: var(--size-2); 
      background: var(--counter-button-bg, var(--brand)); 
      color: var(--counter-button-text, white); 
      border: none; 
      border-radius: var(--radius-2); 
      cursor: pointer; 
      font-size: 1.2rem;
      font-weight: bold;
      min-width: 3rem;
      transition: all 0.2s ease;
    }`,

    buttonHover:
      `{ transform: scale(1.05); background: var(--counter-button-hover, var(--indigo-7)); }`,

    display: `{ 
      font-size: 2rem; 
      font-weight: bold; 
      min-width: 4rem; 
      text-align: center; 
      color: var(--counter-text, var(--brand));
      background: var(--counter-display-bg, var(--surface-1));
      padding: 0.5rem 1rem;
      border-radius: var(--radius-2);
      border: var(--border-size-2) solid var(--counter-display-border, var(--surface-3));
    }`,

    controls: `{ display: flex; flex-direction: column; gap: 0.5rem; }`,

    label: `{ 
      font-size: var(--font-size-0); 
      color: var(--counter-label, var(--text-muted)); 
      font-weight: 500;
    }`,

    disabled: `{ 
      opacity: 0.5; 
      cursor: not-allowed; 
      pointer-events: none; 
    }`,

    maxReached: `{ 
      border-color: var(--counter-warning, var(--red-6)); 
      background: var(--counter-warning-bg, var(--red-0)); 
    }`,
  },

  // ✨ Function-Style Props - Zero duplication!
  render: (
    {
      initialCount = number(0), // Starting count value
      step = number(1), // Increment/decrement step
      maxValue = number(10), // Maximum allowed value
      minValue = number(0), // Minimum allowed value
      disabled = boolean(false), // Disable the counter
      theme = string("blue"), // Color theme
      showControls = boolean(true), // Show increment/decrement controls
      label = string("Counter"), // Counter label
    },
    _api,
    classes,
  ) => {
    const currentCount = typeof initialCount === "number" ? initialCount : 0;
    const stepSize = typeof step === "number" ? step : 1;
    const max = typeof maxValue === "number" ? maxValue : 10;
    const min = typeof minValue === "number" ? minValue : 0;
    const isDisabled = typeof disabled === "boolean" ? disabled : false;
    const counterTheme = typeof theme === "string" ? theme : "blue";
    const showButtons = typeof showControls === "boolean" ? showControls : true;
    const counterLabel = typeof label === "string" ? label : "Counter";

    const atMax = currentCount >= max;
    const atMin = currentCount <= min;

    return (
      <div
        class={`${classes!.counterContainer} ${
          atMax ? classes!.maxReached : ""
        } ${isDisabled ? classes!.disabled : ""}`}
        data-count={currentCount}
        data-theme={counterTheme}
      >
        <div class={classes!.controls}>
          <label class={classes!.label}>{counterLabel}</label>
          {showButtons && (
            <div class="u-flex u-gap-2">
              <button
                type="button"
                class={`${classes!.button} ${atMin ? classes!.disabled : ""}`}
                onclick={`
                  const container = this.closest('[data-count]');
                  const display = container.querySelector('.${
                  classes!.display
                }');
                  const current = parseInt(container.dataset.count);
                  const newCount = Math.max(${min}, current - ${stepSize});
                  container.dataset.count = newCount;
                  display.textContent = newCount;
                  
                  // Update button states
                  const buttons = container.querySelectorAll('button');
                  buttons[0].classList.toggle('${
                  classes!.disabled
                }', newCount <= ${min});
                  buttons[1].classList.toggle('${
                  classes!.disabled
                }', newCount >= ${max});
                  // Keep disabled attribute in sync for real clickability
                  buttons[0].disabled = (newCount <= ${min});
                  buttons[1].disabled = (newCount >= ${max});
                  
                  // Update container state
                  container.classList.toggle('${
                  classes!.maxReached
                }', newCount >= ${max});
                `}
                disabled={atMin || isDisabled}
              >
                -{stepSize}
              </button>

              <button
                type="button"
                class={`${classes!.button} ${atMax ? classes!.disabled : ""}`}
                onclick={`
                  const container = this.closest('[data-count]');
                  const display = container.querySelector('.${
                  classes!.display
                }');
                  const current = parseInt(container.dataset.count);
                  const newCount = Math.min(${max}, current + ${stepSize});
                  container.dataset.count = newCount;
                  display.textContent = newCount;
                  
                  // Update button states  
                  const buttons = container.querySelectorAll('button');
                  buttons[0].classList.toggle('${
                  classes!.disabled
                }', newCount <= ${min});
                  buttons[1].classList.toggle('${
                  classes!.disabled
                }', newCount >= ${max});
                  // Keep disabled attribute in sync for real clickability
                  buttons[0].disabled = (newCount <= ${min});
                  buttons[1].disabled = (newCount >= ${max});
                  
                  // Update container state
                  container.classList.toggle('${
                  classes!.maxReached
                }', newCount >= ${max});
                `}
                disabled={atMax || isDisabled}
              >
                +{stepSize}
              </button>
            </div>
          )}
        </div>

        <div class={classes!.display}>{currentCount}</div>

        <div class={classes!.controls}>
          <div class={classes!.label}>
            Range: {min}-{max}
          </div>
          <div class={classes!.label}>
            Step: {stepSize}
          </div>
        </div>
      </div>
    );
  },
});
