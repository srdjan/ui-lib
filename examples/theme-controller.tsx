/** @jsx h */
import { defineComponent, h, string } from "../index.ts";

/**
 * 🎨 Theme Controller - Demonstrates Tier 1: CSS Property Reactivity
 *
 * Shows how CSS custom properties can be used for instant visual updates
 * across all components without JavaScript state management.
 */
defineComponent("theme-controller", {
  styles: {
    themePanel: `{
      background: white;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #dee2e6;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }`,

    themeTitle: `{
      font-size: 1.5rem;
      color: #495057;
      margin-bottom: 1rem;
      font-weight: bold;
    }`,

    themeOptions: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }`,

    themeButton: `{
      padding: 1rem;
      border: 2px solid #dee2e6;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      font-weight: 500;
    }`,

    themeButtonActive: `{
      border-color: var(--demo-primary, #007bff);
      background: var(--demo-primary-bg, #f8f9ff);
      transform: scale(1.05);
    }`,

    demoCard: `{
      margin-top: 2rem;
      padding: 1.5rem;
      border-radius: 8px;
      background: var(--demo-card-bg, #f8f9fa);
      border: 2px solid var(--demo-card-border, #dee2e6);
      transition: all 0.3s ease;
    }`,

    demoText: `{
      color: var(--demo-text, #495057);
      margin: 0;
      font-size: 1.1rem;
    }`,
  },

  render: (
    {
      currentTheme = string("blue"),
    },
    api,
    classes,
  ) => {
    const theme = typeof currentTheme === "string" ? currentTheme : "blue";

    return (
      <div class={classes!.themePanel}>
        <h3 class={classes!.themeTitle}>🎨 CSS Property Reactivity</h3>
        <p>Click a theme to see instant updates via CSS custom properties:</p>

        <div class={classes!.themeOptions}>
          <button
            class={`${classes!.themeButton} ${
              theme === "blue" ? classes!.themeButtonActive : ""
            }`}
            onclick={`
              document.documentElement.style.setProperty('--demo-primary', '#007bff');
              document.documentElement.style.setProperty('--demo-primary-bg', '#f8f9ff');
              document.documentElement.style.setProperty('--demo-card-bg', '#f8f9ff');
              document.documentElement.style.setProperty('--demo-card-border', '#007bff');
              document.documentElement.style.setProperty('--demo-text', '#0056b3');
              
              // Update active states
              document.querySelectorAll('.${
              classes!.themeButton
            }').forEach(btn => btn.classList.remove('${
              classes!.themeButtonActive
            }'));
              this.classList.add('${classes!.themeButtonActive}');
            `}
          >
            🔵 Blue
          </button>

          <button
            class={`${classes!.themeButton} ${
              theme === "green" ? classes!.themeButtonActive : ""
            }`}
            onclick={`
              document.documentElement.style.setProperty('--demo-primary', '#28a745');
              document.documentElement.style.setProperty('--demo-primary-bg', '#f8fff8');
              document.documentElement.style.setProperty('--demo-card-bg', '#f8fff8');
              document.documentElement.style.setProperty('--demo-card-border', '#28a745');
              document.documentElement.style.setProperty('--demo-text', '#1e7e34');
              
              // Update active states
              document.querySelectorAll('.${
              classes!.themeButton
            }').forEach(btn => btn.classList.remove('${
              classes!.themeButtonActive
            }'));
              this.classList.add('${classes!.themeButtonActive}');
            `}
          >
            🟢 Green
          </button>

          <button
            class={`${classes!.themeButton} ${
              theme === "purple" ? classes!.themeButtonActive : ""
            }`}
            onclick={`
              document.documentElement.style.setProperty('--demo-primary', '#6f42c1');
              document.documentElement.style.setProperty('--demo-primary-bg', '#faf8ff');
              document.documentElement.style.setProperty('--demo-card-bg', '#faf8ff');
              document.documentElement.style.setProperty('--demo-card-border', '#6f42c1');
              document.documentElement.style.setProperty('--demo-text', '#5a2d91');
              
              // Update active states
              document.querySelectorAll('.${
              classes!.themeButton
            }').forEach(btn => btn.classList.remove('${
              classes!.themeButtonActive
            }'));
              this.classList.add('${classes!.themeButtonActive}');
            `}
          >
            🟣 Purple
          </button>

          <button
            class={`${classes!.themeButton} ${
              theme === "orange" ? classes!.themeButtonActive : ""
            }`}
            onclick={`
              document.documentElement.style.setProperty('--demo-primary', '#fd7e14');
              document.documentElement.style.setProperty('--demo-primary-bg', '#fff8f0');
              document.documentElement.style.setProperty('--demo-card-bg', '#fff8f0');
              document.documentElement.style.setProperty('--demo-card-border', '#fd7e14');
              document.documentElement.style.setProperty('--demo-text', '#e55a00');
              
              // Update active states
              document.querySelectorAll('.${
              classes!.themeButton
            }').forEach(btn => btn.classList.remove('${
              classes!.themeButtonActive
            }'));
              this.classList.add('${classes!.themeButtonActive}');
            `}
          >
            🟠 Orange
          </button>
        </div>

        <div class={classes!.demoCard}>
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
