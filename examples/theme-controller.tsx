/** @jsx h */
// deno-lint-ignore verbatim-module-syntax
import { defineComponent, h, string } from "../index.ts";

/**
 * 🎨 Theme Controller - Demonstrates Tier 1: CSS Property Reactivity
 *
 * Shows how CSS custom properties can be used for instant visual updates
 * across all components without JavaScript state management.
 */
defineComponent("theme-controller", {
  styles: {
    activeRing: `{
      outline: var(--border-size-2) solid var(--brand);
      outline-offset: var(--size-1);
    }`,
    demoText: `{
      color: var(--demo-text, var(--text-1));
      margin: 0;
      font-size: var(--font-size-1);
    }`,
    demoBox: `{
      background: var(--demo-card-bg, var(--surface-1));
      border: var(--border-size-2) solid var(--demo-card-border, var(--surface-3));
    }`,
  },

  render: (
    {
      currentTheme = string("blue"),
    },
    _api,
    classes,
  ) => {
    const theme = typeof currentTheme === "string" ? currentTheme : "blue";

    return (
      <div class="u-card u-p-4">
        <h3>🎨 CSS Property Reactivity</h3>
        <p>Click a theme to see instant updates via CSS custom properties:</p>

        <div class="u-grid u-grid-auto-fit-120 u-gap-4 u-my-4">
          <button
            type="button"
            class={`btn theme-option ${theme === "blue" ? classes!.activeRing : ""}`}
            aria-pressed={theme === "blue"}
            onclick={`
              document.documentElement.style.setProperty('--demo-primary', '#007bff');
              document.documentElement.style.setProperty('--demo-primary-bg', '#f8f9ff');
              document.documentElement.style.setProperty('--demo-card-bg', '#f8f9ff');
              document.documentElement.style.setProperty('--demo-card-border', '#007bff');
              document.documentElement.style.setProperty('--demo-text', '#0056b3');
              
              // Update active states and ARIA
              document.querySelectorAll('.theme-option').forEach(btn => btn.setAttribute('aria-pressed','false'));
              this.setAttribute('aria-pressed','true');
              document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('${classes!.activeRing}'));
              this.classList.add('${classes!.activeRing}');
            `}
          >
            🔵 Blue
          </button>

          <button
            type="button"
            class={`btn theme-option ${theme === "green" ? classes!.activeRing : ""}`}
            aria-pressed={theme === "green"}
            onclick={`
              document.documentElement.style.setProperty('--demo-primary', '#28a745');
              document.documentElement.style.setProperty('--demo-primary-bg', '#f8fff8');
              document.documentElement.style.setProperty('--demo-card-bg', '#f8fff8');
              document.documentElement.style.setProperty('--demo-card-border', '#28a745');
              document.documentElement.style.setProperty('--demo-text', '#1e7e34');
              
              // Update active states and ARIA
              document.querySelectorAll('.theme-option').forEach(btn => btn.setAttribute('aria-pressed','false'));
              this.setAttribute('aria-pressed','true');
              document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('${classes!.activeRing}'));
              this.classList.add('${classes!.activeRing}');
            `}
          >
            🟢 Green
          </button>

          <button
            type="button"
            class={`btn theme-option ${theme === "purple" ? classes!.activeRing : ""}`}
            aria-pressed={theme === "purple"}
            onclick={`
              document.documentElement.style.setProperty('--demo-primary', '#6f42c1');
              document.documentElement.style.setProperty('--demo-primary-bg', '#faf8ff');
              document.documentElement.style.setProperty('--demo-card-bg', '#faf8ff');
              document.documentElement.style.setProperty('--demo-card-border', '#6f42c1');
              document.documentElement.style.setProperty('--demo-text', '#5a2d91');
              
              // Update active states and ARIA
              document.querySelectorAll('.theme-option').forEach(btn => btn.setAttribute('aria-pressed','false'));
              this.setAttribute('aria-pressed','true');
              document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('${classes!.activeRing}'));
              this.classList.add('${classes!.activeRing}');
            `}
          >
            🟣 Purple
          </button>

          <button
            type="button"
            class={`btn theme-option ${theme === "orange" ? classes!.activeRing : ""}`}
            aria-pressed={theme === "orange"}
            onclick={`
              document.documentElement.style.setProperty('--demo-primary', '#fd7e14');
              document.documentElement.style.setProperty('--demo-primary-bg', '#fff8f0');
              document.documentElement.style.setProperty('--demo-card-bg', '#fff8f0');
              document.documentElement.style.setProperty('--demo-card-border', '#fd7e14');
              document.documentElement.style.setProperty('--demo-text', '#e55a00');
              
              // Update active states and ARIA
              document.querySelectorAll('.theme-option').forEach(btn => btn.setAttribute('aria-pressed','false'));
              this.setAttribute('aria-pressed','true');
              document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('${classes!.activeRing}'));
              this.classList.add('${classes!.activeRing}');
            `}
          >
            🟠 Orange
          </button>
        </div>

        <div class={`u-card u-p-3 u-mt-4 ${classes!.demoBox}`}>
          <p class={classes!.demoText}>
            ⚡ This card automatically updates when you change themes above!
            Notice how the colors change instantly without any JavaScript state
            management - it's all powered by CSS custom properties.
          </p>
        </div>
      </div>
    );
  },
});
