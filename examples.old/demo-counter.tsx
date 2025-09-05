/** @jsx h */
import { router } from "./router.ts";
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
  router,
  autoProps: true,
  // 🎨 CSS-Only Format - Auto-generated class names!
  styles: {},

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
    _classes,
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
        class={`u-card u-p-4 u-flex u-items-center u-gap-4 ${
          atMax ? "u-border u-border-dashed" : ""
        }`}
        data-count={currentCount}
        data-theme={counterTheme}
      >
        <div class="u-flex u-flex-col u-gap-1">
          <label class="u-text-0 u-text-muted u-weight-5">{counterLabel}</label>
          {showButtons && (
            <div
              class="u-btn-group"
              role="group"
              aria-label="Counter controls"
            >
              <button
                type="button"
                class={`btn btn-brand u-transition u-focus-ring ${
                  atMin || isDisabled ? "u-disabled" : ""
                }`}
                onclick={`
                  const container = this.closest('[data-count]');
                  const display = container.querySelector('[data-role="count-display"]');
                  const current = parseInt(container.dataset.count);
                  const newCount = Math.max(${min}, current - ${stepSize});
                  container.dataset.count = newCount;
                  display.textContent = newCount;
                  
                  // Update button disabled state
                  const buttons = container.querySelectorAll('button');
                  buttons[0].disabled = (newCount <= ${min});
                  buttons[1].disabled = (newCount >= ${max});

                  // Update container border state
                  container.classList.toggle('u-border', newCount >= ${max});
                  container.classList.toggle('u-border-dashed', newCount >= ${max});
                `}
                disabled={atMin || isDisabled}
              >
                -{stepSize}
              </button>

              <button
                type="button"
                class={`btn btn-brand u-transition u-focus-ring ${
                  atMax || isDisabled ? "u-disabled" : ""
                }`}
                onclick={`
                  const container = this.closest('[data-count]');
                  const display = container.querySelector('[data-role="count-display"]');
                  const current = parseInt(container.dataset.count);
                  const newCount = Math.min(${max}, current + ${stepSize});
                  container.dataset.count = newCount;
                  display.textContent = newCount;
                  
                  // Update button states  
                  const buttons = container.querySelectorAll('button');
                  // Keep disabled attribute in sync for real clickability
                  buttons[0].disabled = (newCount <= ${min});
                  buttons[1].disabled = (newCount >= ${max});
                  
                  // Update container border state
                  container.classList.toggle('u-border', newCount >= ${max});
                  container.classList.toggle('u-border-dashed', newCount >= ${max});
                `}
                disabled={atMax || isDisabled}
              >
                +{stepSize}
              </button>
            </div>
          )}
        </div>

        <div
          data-role="count-display"
          class="u-text-3 u-weight-7 u-text-brand u-border u-px-3 u-py-1 u-rounded-2"
        >
          {currentCount}
        </div>

        <div class="u-flex u-flex-col u-gap-1">
          <div class="u-text-0 u-text-muted">
            Range: {min}-{max}
          </div>
          <div class="u-text-0 u-text-muted">
            Step: {stepSize}
          </div>
        </div>
      </div>
    );
  },
});
