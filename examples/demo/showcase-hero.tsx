/** @jsx h */
import { boolean, defineComponent, h, setCSSProperty, string } from "../../index.ts";

/**
 * 🚀 Hero Section - Interactive showcase of ui-lib's revolutionary features
 * 
 * Demonstrates:
 * - Live interactive component preview
 * - Performance metrics display
 * - Feature highlights with animations
 * - Theme switching via CSS properties
 */
defineComponent("showcase-hero", {
  styles: {
    hero: `{
      min-height: 100vh;
      background: linear-gradient(135deg, var(--indigo-6) 0%, var(--purple-6) 50%, var(--pink-6) 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
      overflow: hidden;
    }`,

    heroContent: `{
      max-width: 900px;
      padding: var(--size-8);
      position: relative;
      z-index: 2;
    }`,

    heroBackground: `{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>');
      animation: float 20s ease-in-out infinite;
    } @keyframes float { 
      0%, 100% { transform: translateY(0px) rotate(0deg); } 
      50% { transform: translateY(-10px) rotate(180deg); } 
    }`,

    heroTitle: `{
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: var(--font-weight-8);
      line-height: 1.1;
      margin-bottom: var(--size-4);
      background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: slideInUp 0.8s ease-out;
    } @keyframes slideInUp { 
      from { opacity: 0; transform: translateY(30px); } 
      to { opacity: 1; transform: translateY(0); } 
    }`,

    heroSubtitle: `{
      font-size: var(--font-size-3);
      font-weight: var(--font-weight-5);
      opacity: 0.9;
      margin-bottom: var(--size-6);
      animation: slideInUp 0.8s ease-out 0.2s both;
    }`,

    heroStats: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--size-4);
      margin: var(--size-8) 0 var(--size-6) 0;
      animation: slideInUp 0.8s ease-out 0.4s both;
    }`,

    heroStat: `{
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-3);
      padding: var(--size-3);
      transition: all 0.3s ease;
    }`,

    heroStatValue: `{
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-7);
      color: white;
      margin-bottom: var(--size-1);
    }`,

    heroStatLabel: `{
      font-size: var(--font-size-0);
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }`,

    heroActions: `{
      display: flex;
      gap: var(--size-4);
      justify-content: center;
      flex-wrap: wrap;
      animation: slideInUp 0.8s ease-out 0.6s both;
    }`,

    heroButton: `{
      background: white;
      color: var(--indigo-6);
      border: none;
      padding: var(--size-4) var(--size-6);
      border-radius: var(--radius-3);
      font-size: var(--font-size-1);
      font-weight: var(--font-weight-6);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      text-decoration: none;
      display: inline-block;
    }`,

    heroButtonSecondary: `{
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.5);
    }`,

    heroFeatures: `{
      position: absolute;
      bottom: var(--size-8);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: var(--size-6);
      animation: slideInUp 0.8s ease-out 0.8s both;
    }`,

    heroFeature: `{
      text-align: center;
      max-width: 120px;
    }`,

    heroFeatureIcon: `{
      font-size: var(--font-size-3);
      margin-bottom: var(--size-2);
      opacity: 0.9;
    }`,

    heroFeatureText: `{
      font-size: var(--font-size-0);
      opacity: 0.8;
    }`,
  },

  render: (
    {
      title = string("ui-lib"),
      subtitle = string("The Most Ergonomic Component Library Ever Built"),
      showStats = boolean(true),
      showFeatures = boolean(true),
    },
    _api,
    classes,
  ) => (
    <section class={classes!.hero} role="banner" aria-label="Hero section">
      <div class={classes!.heroBackground} aria-hidden="true"></div>
      
      <div class={classes!.heroContent}>
        <h1 class={classes!.heroTitle}>{title}</h1>
        <p class={classes!.heroSubtitle}>{subtitle}</p>

        {showStats && (
          <div class={classes!.heroStats} role="region" aria-label="Performance statistics">
            <div class={classes!.heroStat}>
              <div class={classes!.heroStatValue}>0KB</div>
              <div class={classes!.heroStatLabel}>Client JS</div>
            </div>
            <div class={classes!.heroStat}>
              <div class={classes!.heroStatValue}>100%</div>
              <div class={classes!.heroStatLabel}>SSR</div>
            </div>
            <div class={classes!.heroStat}>
              <div class={classes!.heroStatValue}>3-Tier</div>
              <div class={classes!.heroStatLabel}>Reactivity</div>
            </div>
            <div class={classes!.heroStat}>
              <div class={classes!.heroStatValue}>Zero</div>
              <div class={classes!.heroStatLabel}>Dependencies</div>
            </div>
          </div>
        )}

        <div class={classes!.heroActions}>
          <a href="#examples" class={classes!.heroButton} role="button">
            View Examples
          </a>
          <button 
            class={`${classes!.heroButton} ${classes!.heroButtonSecondary}`}
            onclick={setCSSProperty("demo-theme", "dark")}
            aria-label="Toggle dark theme"
          >
            Toggle Theme
          </button>
        </div>
      </div>

      {showFeatures && (
        <div class={classes!.heroFeatures}>
          <div class={classes!.heroFeature}>
            <div class={classes!.heroFeatureIcon}>✨</div>
            <div class={classes!.heroFeatureText}>Function-Style Props</div>
          </div>
          <div class={classes!.heroFeature}>
            <div class={classes!.heroFeatureIcon}>🎨</div>
            <div class={classes!.heroFeatureText}>CSS-Only Format</div>
          </div>
          <div class={classes!.heroFeature}>
            <div class={classes!.heroFeatureIcon}>⚡</div>
            <div class={classes!.heroFeatureText}>Hybrid Reactivity</div>
          </div>
          <div class={classes!.heroFeature}>
            <div class={classes!.heroFeatureIcon}>🔄</div>
            <div class={classes!.heroFeatureText}>Unified API</div>
          </div>
        </div>
      )}
    </section>
  ),
});

/**
 * 🎯 Interactive Feature Preview
 * Live demonstration of component capabilities
 */
defineComponent("feature-preview", {
  styles: {
    preview: `{
      background: var(--gray-0);
      border-radius: var(--radius-4);
      padding: var(--size-6);
      margin: var(--size-6) 0;
      border: 2px solid var(--gray-3);
      transition: all 0.3s ease;
    }`,

    previewHeader: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--size-4);
      padding-bottom: var(--size-3);
      border-bottom: 1px solid var(--gray-3);
    }`,

    previewTitle: `{
      font-size: var(--font-size-2);
      font-weight: var(--font-weight-6);
      color: var(--gray-8);
    }`,

    previewDemo: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--size-4);
      align-items: start;
    }`,

    previewCode: `{
      background: var(--gray-9);
      color: var(--gray-1);
      padding: var(--size-4);
      border-radius: var(--radius-3);
      font-family: var(--font-mono);
      font-size: var(--font-size-0);
      line-height: 1.5;
      overflow-x: auto;
      position: relative;
    }`,

    previewOutput: `{
      background: white;
      border: 1px solid var(--gray-3);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }`,

    liveCounter: `{
      background: linear-gradient(135deg, var(--blue-1) 0%, var(--blue-2) 100%);
      border: 2px solid var(--blue-6);
      border-radius: var(--radius-3);
      padding: var(--size-4);
      text-align: center;
      transition: all 0.3s ease;
    }`,

    counterDisplay: `{
      font-size: var(--font-size-4);
      font-weight: var(--font-weight-7);
      color: var(--blue-7);
      margin: var(--size-3) 0;
    }`,

    counterButton: `{
      background: var(--blue-6);
      color: white;
      border: none;
      padding: var(--size-2) var(--size-4);
      border-radius: var(--radius-2);
      font-weight: var(--font-weight-5);
      cursor: pointer;
      margin: 0 var(--size-2);
      transition: all 0.2s ease;
    }`,
  },

  render: (
    {
      title = string("Live Component Preview"),
      showCode = boolean(true),
    },
    _api,
    classes,
  ) => (
    <div class={classes!.preview}>
      <div class={classes!.previewHeader}>
        <h3 class={classes!.previewTitle}>{title}</h3>
        <small>Try it below! ↓</small>
      </div>

      <div class={classes!.previewDemo}>
        {showCode && (
          <div class={classes!.previewCode}>
{`defineComponent("smart-counter", {
  render: ({
    initialCount = number(0),
    step = number(1),
  }) => (
    <div data-count={initialCount}>
      <button onclick="updateCount(-step)">
        -{step}
      </button>
      <span>{initialCount}</span>
      <button onclick="updateCount(+step)">
        +{step}
      </button>
    </div>
  ),
});`}
          </div>
        )}

        <div class={classes!.previewOutput}>
          <div class={classes!.liveCounter} data-count="5">
            <div>Smart Counter Demo</div>
            <div class={classes!.counterDisplay}>5</div>
            <div>
              <button 
                class={classes!.counterButton}
                onclick={`
                  const container = this.closest('[data-count]');
                  const display = container.querySelector('.${classes!.counterDisplay.replace(/[{}]/g, '')}');
                  const current = parseInt(container.dataset.count);
                  const newCount = Math.max(0, current - 1);
                  container.dataset.count = newCount;
                  display.textContent = newCount;
                `}
              >
                -1
              </button>
              <button 
                class={classes!.counterButton}
                onclick={`
                  const container = this.closest('[data-count]');
                  const display = container.querySelector('.${classes!.counterDisplay.replace(/[{}]/g, '')}');
                  const current = parseInt(container.dataset.count);
                  const newCount = current + 1;
                  container.dataset.count = newCount;
                  display.textContent = newCount;
                `}
              >
                +1
              </button>
            </div>
            <small>Function-style props • Zero duplication • DOM state</small>
          </div>
        </div>
      </div>
    </div>
  ),
});