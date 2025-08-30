/** @jsx h */
/// <reference path="../src/lib/jsx.d.ts" />
import {
  defineComponent,
  h,
  string,
} from "../src/index.ts";
import {
  setCSSProperty,
  toggleCSSProperty,
  createThemeToggle,
  debugReactiveState,
} from "../src/lib/reactive-helpers.ts";

// Theme Controller - Master component that manages global theme
defineComponent("main-theme-controller", {
  styles: {
    container: { display: 'inline-flex', gap: '0.5rem', alignItems: 'center', padding: '1rem', border: '2px solid var(--theme-border, #ddd)', borderRadius: '8px', background: 'var(--theme-card-bg, #f8f9fa)', transition: 'all 0.3s ease' },
    button: { background: 'var(--theme-button-bg, #007bff)', color: 'var(--theme-button-text, white)', border: '1px solid var(--theme-button-border, #007bff)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease', marginRight: '0.5rem' },
    buttonHover: { opacity: '0.8', transform: 'translateY(-1px)' },
    label: { color: 'var(--theme-text, #333)', fontWeight: '500', marginLeft: '0.5rem' },
    debugButton: { background: 'var(--theme-debug-bg, #6c757d)', color: 'white', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }
  },
  render: () => (
    <div class="container">
      <span class="label">Theme:</span>
      
      {/* Light theme button */}
      <button 
        class="button"
        hx-on={`click: ${createThemeToggle(
          // Light theme properties
          {
            "theme-mode": "light",
            "theme-bg": "white",
            "theme-text": "#333",
            "theme-border": "#ddd",
            "theme-card-bg": "#f8f9fa",
            "theme-button-bg": "#007bff",
            "theme-button-text": "white",
            "theme-button-border": "#007bff",
            "theme-debug-bg": "#6c757d"
          },
          // Dark theme properties
          {
            "theme-mode": "dark", 
            "theme-bg": "#1a202c",
            "theme-text": "#f7fafc",
            "theme-border": "#4a5568",
            "theme-card-bg": "#2d3748",
            "theme-button-bg": "#63b3ed",
            "theme-button-text": "#1a202c",
            "theme-button-border": "#63b3ed",
            "theme-debug-bg": "#805ad5"
          }
        )}`}
      >
        🌓 Toggle Theme
      </button>

      {/* Preset theme buttons */}
      <button 
        class="button"
        style="background: #e3f2fd; color: #1976d2;"
        hx-on={`click: ${[
          setCSSProperty("theme-mode", "blue"),
          setCSSProperty("theme-bg", "#e3f2fd"),
          setCSSProperty("theme-text", "#1976d2"),
          setCSSProperty("theme-border", "#90caf9"),
          setCSSProperty("theme-card-bg", "#f3e5f5"),
          setCSSProperty("theme-button-bg", "#1976d2"),
          setCSSProperty("theme-button-text", "white"),
          "this.textContent = '✓ Blue Theme'",
          "setTimeout(() => this.textContent = '🔵 Blue', 1000)"
        ].join("; ")}`}
      >
        🔵 Blue
      </button>

      <button 
        class="button"
        style="background: #f3e5f5; color: #7b1fa2;"
        hx-on={`click: ${[
          setCSSProperty("theme-mode", "purple"),
          setCSSProperty("theme-bg", "#f3e5f5"),
          setCSSProperty("theme-text", "#7b1fa2"),
          setCSSProperty("theme-border", "#ce93d8"),
          setCSSProperty("theme-card-bg", "#fce4ec"),
          setCSSProperty("theme-button-bg", "#7b1fa2"),
          setCSSProperty("theme-button-text", "white"),
          "this.textContent = '✓ Purple Theme'",
          "setTimeout(() => this.textContent = '🟣 Purple', 1000)"
        ].join("; ")}`}
      >
        🟣 Purple
      </button>

      <button 
        class="button"
        style="background: #e8f5e8; color: #2e7d32;"
        hx-on={`click: ${[
          setCSSProperty("theme-mode", "green"),
          setCSSProperty("theme-bg", "#e8f5e8"),
          setCSSProperty("theme-text", "#2e7d32"),
          setCSSProperty("theme-border", "#a5d6a7"),
          setCSSProperty("theme-card-bg", "#f1f8e9"),
          setCSSProperty("theme-button-bg", "#2e7d32"),
          setCSSProperty("theme-button-text", "white"),
          "this.textContent = '✓ Green Theme'",
          "setTimeout(() => this.textContent = '🟢 Green', 1000)"
        ].join("; ")}`}
      >
        🟢 Green
      </button>

      {/* Debug button */}
      <button 
        class="button debug-button"
        hx-on={`click: ${debugReactiveState("Theme Controller", true, false)}`}
      >
        🐛 Debug
      </button>
    </div>
  )
});

// Reactive Card - Automatically responds to theme changes
defineComponent("theme-reactive-card", {
  styles: {
    card: { background: 'var(--theme-card-bg, #f8f9fa)', border: '2px solid var(--theme-border, #ddd)', color: 'var(--theme-text, #333)', padding: '1.5rem', borderRadius: '12px', margin: '1rem 0', transition: 'all 0.3s ease', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    title: { color: 'var(--theme-text, #333)', marginBottom: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' },
    content: { color: 'var(--theme-text, #333)', lineHeight: '1.6', opacity: '0.8' },
    highlight: { background: 'var(--theme-button-bg, #007bff)', color: 'var(--theme-button-text, white)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9rem' }
  },
  render: ({ 
    title = string("CSS Reactive Card"),
    content = string("This card automatically adapts to any theme changes via CSS custom properties. No JavaScript required for the visual updates!")
  }) => (
    <div class="card">
      <h3 class="title">{title}</h3>
      <div class="content">
        <p>{content}</p>
        <p>
          ✨ <strong>How it works:</strong> CSS custom properties like{" "}
          <code class="highlight">var(--theme-bg)</code> automatically update 
          when the theme controller changes them.
        </p>
        <p>
          🚀 <strong>Performance:</strong> Zero JavaScript overhead for theme 
          changes - the browser's CSS engine handles everything!
        </p>
      </div>
    </div>
  )
});

// Themed Navigation - Shows navigation that adapts to themes
defineComponent("themed-nav", {
  styles: {
    nav: `{
      background: var(--theme-bg, white);
      border: 2px solid var(--theme-border, #ddd);
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      transition: all 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }`,
    navLeft: `{
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }`,
    brand: `{
      color: var(--theme-text, #333);
      font-weight: bold;
      font-size: 1.2rem;
      text-decoration: none;
    }`,
    link: `{
      color: var(--theme-text, #333);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.2s ease;
      opacity: 0.8;
    }`,
    linkHover: `{
      background: var(--theme-card-bg, #f8f9fa);
      opacity: 1;
    }`,
    status: `{
      color: var(--theme-text, #333);
      font-size: 0.9rem;
      opacity: 0.7;
    }`
  },
  render: () => (
    <nav class="nav">
      <div class="nav-left">
        <a href="#" class="brand">🎨 ThemeApp</a>
        <a href="#" class="link">Home</a>
        <a href="#" class="link">About</a>
        <a href="#" class="link">Gallery</a>
        <a href="#" class="link">Contact</a>
      </div>
      <div class="status">
        Theme-aware navigation
      </div>
    </nav>
  )
});

// Theme Status Display - Shows current theme information
defineComponent("theme-status", {
  styles: {
    status: `{
      background: var(--theme-card-bg, #f8f9fa);
      border: 1px solid var(--theme-border, #ddd);
      color: var(--theme-text, #333);
      padding: 1rem;
      border-radius: 6px;
      margin: 1rem 0;
      font-family: monospace;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }`,
    title: `{
      color: var(--theme-text, #333);
      font-weight: bold;
      margin-bottom: 0.5rem;
      font-family: sans-serif;
    }`,
    property: `{
      display: flex;
      justify-content: space-between;
      margin: 0.25rem 0;
      padding: 0.25rem;
      background: var(--theme-bg, white);
      border-radius: 3px;
    }`,
    value: `{
      color: var(--theme-button-bg, #007bff);
      font-weight: bold;
    }`
  },
  render: () => (
    <div class="status" hx-on={`htmx:load: 
      const updateDisplay = () => {
        const mode = getComputedStyle(document.documentElement).getPropertyValue('--theme-mode').trim();
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--theme-bg').trim();
        const text = getComputedStyle(document.documentElement).getPropertyValue('--theme-text').trim();
        const ct = this.querySelector('.current-theme');
        const bv = this.querySelector('.bg-value');
        const tv = this.querySelector('.text-value');
        if (ct) ct.textContent = mode || 'default';
        if (bv) bv.textContent = bg || 'default';
        if (tv) tv.textContent = text || 'default';
        setTimeout(updateDisplay, 1000);
      };
      updateDisplay();
    `}>
      <div class="title">🔍 Live Theme Properties</div>
      <div class="property">
        <span>--theme-mode:</span>
        <span class="value current-theme">loading...</span>
      </div>
      <div class="property">
        <span>--theme-bg:</span>
        <span class="value bg-value">loading...</span>
      </div>
      <div class="property">
        <span>--theme-text:</span>
        <span class="value text-value">loading...</span>
      </div>
    </div>
  )
});

// Interactive Theme Playground
defineComponent("theme-playground", {
  styles: {
    playground: `{
      border: 2px dashed var(--theme-border, #ddd);
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1rem 0;
      background: var(--theme-bg, white);
      transition: all 0.3s ease;
    }`,
    title: `{
      color: var(--theme-text, #333);
      margin-bottom: 1rem;
    }`,
    controls: `{
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }`,
    colorButton: `{
      width: 40px;
      height: 40px;
      border: 3px solid var(--theme-border, #ddd);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
    }`,
    colorButtonActive: `{
      border-color: var(--theme-text, #333);
      transform: scale(1.1);
    }`,
    sample: `{
      background: var(--playground-bg, var(--theme-card-bg, #f8f9fa));
      color: var(--playground-text, var(--theme-text, #333));
      border: 2px solid var(--playground-border, var(--theme-border, #ddd));
      padding: 1rem;
      border-radius: 6px;
      transition: all 0.3s ease;
    }`
  },
  render: () => (
    <div class="playground">
      <h3 class="title">🎨 Interactive Theme Playground</h3>
      <div class="controls">
        <button 
          class="color-button"
          style="background: #ff6b6b;"
          title="Red"
          hx-on={`click: ${[
            setCSSProperty("playground-bg", "#ffe0e0"),
            setCSSProperty("playground-text", "#d63031"),
            setCSSProperty("playground-border", "#ff7675")
          ].join("; ")}`}
        ></button>
        <button 
          class="color-button"
          style="background: #4ecdc4;"
          title="Teal"
          hx-on={`click: ${[
            setCSSProperty("playground-bg", "#e0f7f7"),
            setCSSProperty("playground-text", "#00b894"),
            setCSSProperty("playground-border", "#55efc4")
          ].join("; ")}`}
        ></button>
        <button 
          class="color-button"
          style="background: #45b7d1;"
          title="Blue"
          hx-on={`click: ${[
            setCSSProperty("playground-bg", "#e3f2fd"),
            setCSSProperty("playground-text", "#0984e3"),
            setCSSProperty("playground-border", "#74b9ff")
          ].join("; ")}`}
        ></button>
        <button 
          class="color-button"
          style="background: #f9ca24;"
          title="Yellow"
          hx-on={`click: ${[
            setCSSProperty("playground-bg", "#fff9e6"),
            setCSSProperty("playground-text", "#e17055"),
            setCSSProperty("playground-border", "#fdcb6e")
          ].join("; ")}`}
        ></button>
        <button 
          class="color-button"
          style="background: #6c5ce7;"
          title="Purple"
          hx-on={`click: ${[
            setCSSProperty("playground-bg", "#f3e5f5"),
            setCSSProperty("playground-text", "#6c5ce7"),
            setCSSProperty("playground-border", "#a29bfe")
          ].join("; ")}`}
        ></button>
        <button 
          class="color-button"
          style="background: #fd79a8;"
          title="Pink"
          hx-on={`click: ${[
            setCSSProperty("playground-bg", "#ffeaa7"),
            setCSSProperty("playground-text", "#e84393"),
            setCSSProperty("playground-border", "#fd79a8")
          ].join("; ")}`}
        ></button>
      </div>
      <div class="sample">
        <h4>Playground Sample</h4>
        <p>This area changes colors independently of the main theme!</p>
        <p>🎯 <strong>Try it:</strong> Click the colored circles above to see instant CSS property updates.</p>
      </div>
    </div>
  )
});

// Theme Animation Demo
defineComponent("theme-animation-demo", {
  styles: {
    demo: `{
      background: var(--theme-card-bg, #f8f9fa);
      border: 2px solid var(--theme-border, #ddd);
      color: var(--theme-text, #333);
      padding: 2rem;
      border-radius: 12px;
      margin: 2rem 0;
      text-align: center;
      transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
    }`,
    title: `{
      color: var(--theme-text, #333);
      font-size: 2rem;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
    }`,
    subtitle: `{
      color: var(--theme-text, #333);
      opacity: 0.7;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }`,
    feature: `{
      background: var(--theme-bg, white);
      border: 1px solid var(--theme-border, #ddd);
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem;
      display: inline-block;
      min-width: 200px;
      transition: all 0.4s ease;
    }`,
    featureTitle: `{
      color: var(--theme-button-bg, #007bff);
      font-weight: bold;
      margin-bottom: 0.5rem;
    }`,
    featureText: `{
      color: var(--theme-text, #333);
      font-size: 0.9rem;
      opacity: 0.8;
    }`
  },
  render: () => (
    <div class="demo">
      <h2 class="title">🎭 CSS Property Reactivity</h2>
      <p class="subtitle">
        Watch how smoothly everything transitions when themes change
      </p>
      
      <div class="feature">
        <div class="feature-title">⚡ Instant Updates</div>
        <div class="feature-text">
          CSS engine handles all visual updates with zero JavaScript overhead
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-title">🎨 Smooth Transitions</div>
        <div class="feature-text">
          Beautiful animations powered by CSS transitions and custom properties
        </div>
      </div>
      
      <div class="feature">
        <div class="feature-title">🏗️ Component Agnostic</div>
        <div class="feature-text">
          Any component can react to themes without knowing about other components
        </div>
      </div>
    </div>
  )
});

console.log("✅ Theme System components registered");
