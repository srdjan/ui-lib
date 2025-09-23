/**
 * Theme System for Shopping Cart Demo
 *
 * Demonstrates:
 * - DOM-native theme switching (CSS custom properties)
 * - Token-based theme configuration
 * - System preference detection
 * - Persistent theme selection
 * - Three-tier reactivity for theme changes
 */

// ============================================================
// Theme Configuration Types
// ============================================================

export interface ThemeTokens {
  colors: {
    // Surface colors
    background: string;
    surface: string;
    surfaceVariant: string;
    overlay: string;

    // Text colors
    onBackground: string;
    onSurface: string;
    onSurfaceVariant: string;

    // Primary colors
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;

    // Secondary colors
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;

    // State colors
    success: string;
    onSuccess: string;
    warning: string;
    onWarning: string;
    error: string;
    onError: string;

    // Border and outline
    outline: string;
    outlineVariant: string;

    // Interactive states
    hover: string;
    focus: string;
    pressed: string;

    // Cart-specific
    cartBadge: string;
    cartBadgeText: string;
  };

  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };

  typography: {
    fontFamily: string;
    fontFamilyMono: string;

    // Font sizes
    textXs: string;
    textSm: string;
    textBase: string;
    textLg: string;
    textXl: string;
    text2xl: string;
    text3xl: string;

    // Font weights
    weightRegular: string;
    weightMedium: string;
    weightSemibold: string;
    weightBold: string;

    // Line heights
    leadingTight: string;
    leadingNormal: string;
    leadingRelaxed: string;
  };

  layout: {
    borderRadius: string;
    borderRadiusLg: string;
    borderWidth: string;

    // Shadows
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
    shadowXl: string;

    // Z-index layers
    zTooltip: string;
    zModal: string;
    zToast: string;
  };

  animation: {
    durationFast: string;
    durationNormal: string;
    durationSlow: string;

    timingEaseOut: string;
    timingEaseIn: string;
    timingEaseInOut: string;
  };
}

// ============================================================
// Predefined Themes
// ============================================================

export const lightTheme: ThemeTokens = {
  colors: {
    // Surface colors
    background: "#FFFFFF",
    surface: "#FAFAFA",
    surfaceVariant: "#F5F5F5",
    overlay: "rgba(0, 0, 0, 0.5)",

    // Text colors
    onBackground: "#1F2937",
    onSurface: "#374151",
    onSurfaceVariant: "#6B7280",

    // Primary colors
    primary: "#6366F1",
    onPrimary: "#FFFFFF",
    primaryContainer: "#EEF2FF",
    onPrimaryContainer: "#3730A3",

    // Secondary colors
    secondary: "#64748B",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#F1F5F9",
    onSecondaryContainer: "#334155",

    // State colors
    success: "#10B981",
    onSuccess: "#FFFFFF",
    warning: "#F59E0B",
    onWarning: "#FFFFFF",
    error: "#EF4444",
    onError: "#FFFFFF",

    // Border and outline
    outline: "#D1D5DB",
    outlineVariant: "#E5E7EB",

    // Interactive states
    hover: "rgba(99, 102, 241, 0.08)",
    focus: "rgba(99, 102, 241, 0.12)",
    pressed: "rgba(99, 102, 241, 0.16)",

    // Cart-specific
    cartBadge: "#EF4444",
    cartBadgeText: "#FFFFFF",
  },

  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    xxl: "3rem", // 48px
  },

  typography: {
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMono:
      "'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",

    // Font sizes
    textXs: "0.75rem", // 12px
    textSm: "0.875rem", // 14px
    textBase: "1rem", // 16px
    textLg: "1.125rem", // 18px
    textXl: "1.25rem", // 20px
    text2xl: "1.5rem", // 24px
    text3xl: "1.875rem", // 30px

    // Font weights
    weightRegular: "400",
    weightMedium: "500",
    weightSemibold: "600",
    weightBold: "700",

    // Line heights
    leadingTight: "1.25",
    leadingNormal: "1.5",
    leadingRelaxed: "1.75",
  },

  layout: {
    borderRadius: "0.375rem", // 6px
    borderRadiusLg: "0.5rem", // 8px
    borderWidth: "1px",

    // Shadows
    shadowSm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    shadowMd:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    shadowLg:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    shadowXl:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

    // Z-index layers
    zTooltip: "100",
    zModal: "200",
    zToast: "300",
  },

  animation: {
    durationFast: "150ms",
    durationNormal: "200ms",
    durationSlow: "300ms",

    timingEaseOut: "cubic-bezier(0, 0, 0.2, 1)",
    timingEaseIn: "cubic-bezier(0.4, 0, 1, 1)",
    timingEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

export const darkTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    // Surface colors
    background: "#0F172A",
    surface: "#1E293B",
    surfaceVariant: "#334155",
    overlay: "rgba(0, 0, 0, 0.7)",

    // Text colors
    onBackground: "#F8FAFC",
    onSurface: "#E2E8F0",
    onSurfaceVariant: "#94A3B8",

    // Primary colors
    primary: "#818CF8",
    onPrimary: "#1E1B4B",
    primaryContainer: "#312E81",
    onPrimaryContainer: "#C7D2FE",

    // Secondary colors
    secondary: "#94A3B8",
    onSecondary: "#1E293B",
    secondaryContainer: "#475569",
    onSecondaryContainer: "#CBD5E1",

    // State colors
    success: "#34D399",
    onSuccess: "#064E3B",
    warning: "#FBBF24",
    onWarning: "#451A03",
    error: "#F87171",
    onError: "#7F1D1D",

    // Border and outline
    outline: "#475569",
    outlineVariant: "#334155",

    // Interactive states
    hover: "rgba(129, 140, 248, 0.08)",
    focus: "rgba(129, 140, 248, 0.12)",
    pressed: "rgba(129, 140, 248, 0.16)",

    // Cart-specific
    cartBadge: "#F87171",
    cartBadgeText: "#FFFFFF",
  },
};

// ============================================================
// Theme Manager Class
// ============================================================

export class ThemeManager {
  private currentTheme: "light" | "dark" | "auto" = "auto";
  private eventTarget: EventTarget;
  private mediaQuery: MediaQueryList;

  constructor() {
    this.eventTarget = new EventTarget();
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.initializeTheme();
    this.setupEventListeners();
  }

  // ============================================================
  // Initialization
  // ============================================================

  private initializeTheme(): void {
    // Load saved theme preference
    const savedTheme = localStorage.getItem("shopping-cart-theme") as
      | "light"
      | "dark"
      | "auto"
      | null;
    this.currentTheme = savedTheme || "auto";

    // Apply initial theme
    this.applyTheme();

    // Update theme toggle UI
    this.updateThemeToggleUI();
  }

  private setupEventListeners(): void {
    // Listen for system theme changes
    this.mediaQuery.addEventListener("change", () => {
      if (this.currentTheme === "auto") {
        this.applyTheme();
      }
    });

    // Listen for storage changes (sync across tabs)
    window.addEventListener("storage", (event) => {
      if (event.key === "shopping-cart-theme" && event.newValue) {
        this.currentTheme = event.newValue as "light" | "dark" | "auto";
        this.applyTheme();
        this.updateThemeToggleUI();
      }
    });
  }

  // ============================================================
  // Theme Application
  // ============================================================

  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme();
    const tokens = effectiveTheme === "dark" ? darkTheme : lightTheme;

    // Apply theme tokens as CSS custom properties
    this.applyCSSTokens(tokens);

    // Update document attributes for CSS selectors
    document.documentElement.setAttribute("data-theme", effectiveTheme);
    document.documentElement.setAttribute(
      "data-theme-preference",
      this.currentTheme,
    );

    // Tier 1: CSS Property Reactivity (instant visual updates)
    document.documentElement.style.setProperty("--theme-mode", effectiveTheme);

    // Tier 2: Pub/Sub State Update
    this.publishThemeChange(effectiveTheme, this.currentTheme);

    // Tier 3: DOM Event Communication
    this.dispatchThemeEvent("theme-changed", {
      theme: effectiveTheme,
      preference: this.currentTheme,
      tokens,
    });
  }

  private applyCSSTokens(tokens: ThemeTokens): void {
    const root = document.documentElement;

    // Apply color tokens
    Object.entries(tokens.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${this.kebabCase(key)}`, value);
    });

    // Apply spacing tokens
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply typography tokens
    Object.entries(tokens.typography).forEach(([key, value]) => {
      root.style.setProperty(`--typography-${this.kebabCase(key)}`, value);
    });

    // Apply layout tokens
    Object.entries(tokens.layout).forEach(([key, value]) => {
      root.style.setProperty(`--layout-${this.kebabCase(key)}`, value);
    });

    // Apply animation tokens
    Object.entries(tokens.animation).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${this.kebabCase(key)}`, value);
    });
  }

  private getEffectiveTheme(): "light" | "dark" {
    if (this.currentTheme === "auto") {
      return this.mediaQuery.matches ? "dark" : "light";
    }
    return this.currentTheme;
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }

  // ============================================================
  // Public API
  // ============================================================

  setTheme(theme: "light" | "dark" | "auto"): void {
    this.currentTheme = theme;
    localStorage.setItem("shopping-cart-theme", theme);
    this.applyTheme();
    this.updateThemeToggleUI();
  }

  getTheme(): "light" | "dark" | "auto" {
    return this.currentTheme;
  }

  getEffectiveThemeMode(): "light" | "dark" {
    return this.getEffectiveTheme();
  }

  toggleTheme(): void {
    const themes: ("light" | "dark" | "auto")[] = ["light", "dark", "auto"];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  // ============================================================
  // Reactivity System Integration
  // ============================================================

  // Tier 2: Pub/Sub State Manager
  private publishThemeChange(
    theme: "light" | "dark",
    preference: "light" | "dark" | "auto",
  ): void {
    window.dispatchEvent(
      new CustomEvent("state-change", {
        detail: {
          topic: "theme-changed",
          data: { theme, preference },
        },
      }),
    );
  }

  subscribeToThemeChanges(
    callback: (
      data: { theme: "light" | "dark"; preference: "light" | "dark" | "auto" },
    ) => void,
  ): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.topic === "theme-changed") {
        callback(customEvent.detail.data);
      }
    };

    window.addEventListener("state-change", handler);
    return () => window.removeEventListener("state-change", handler);
  }

  // Tier 3: DOM Event Communication
  private dispatchThemeEvent(type: string, detail: any): void {
    this.eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
    // Also dispatch on window for global listeners
    window.dispatchEvent(new CustomEvent(`theme-${type}`, { detail }));
  }

  addEventListener(type: string, listener: EventListener): void {
    this.eventTarget.addEventListener(type, listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.eventTarget.removeEventListener(type, listener);
  }

  // ============================================================
  // UI Integration
  // ============================================================

  private updateThemeToggleUI(): void {
    const toggles = document.querySelectorAll("[data-theme-toggle]");

    toggles.forEach((toggle) => {
      const button = toggle as HTMLElement;

      // Update button text/icon
      const icons = {
        light: "☀️",
        dark: "🌙",
        auto: "💻",
      };

      const labels = {
        light: "Light mode",
        dark: "Dark mode",
        auto: "System theme",
      };

      button.textContent = `${icons[this.currentTheme]} ${
        labels[this.currentTheme]
      }`;
      button.setAttribute(
        "aria-label",
        `Current theme: ${labels[this.currentTheme]}. Click to cycle themes.`,
      );

      // Update data attributes for CSS styling
      button.setAttribute("data-theme-current", this.currentTheme);
      button.setAttribute("data-theme-effective", this.getEffectiveTheme());
    });
  }

  // ============================================================
  // Component Integration Helper
  // ============================================================

  createThemeToggleButton(): string {
    return `
      <button
        data-theme-toggle
        class="theme-toggle"
        onclick="themeManager.toggleTheme()"
        aria-label="Toggle theme"
        type="button"
      >
        💻 System theme
      </button>
    `;
  }
}

// ============================================================
// Global Instance
// ============================================================

export const themeManager = new ThemeManager();

// Initialize theme on page load
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Theme is already initialized in constructor
    console.log("Theme system initialized");
  });

  // Expose global methods for component integration
  (window as any).themeManager = themeManager;
}

// ============================================================
// CSS for Theme System
// ============================================================

export const themeSystemCSS = `
  /* Base theme variables - will be overridden by ThemeManager */
  :root {
    color-scheme: light dark;
  }

  /* Theme toggle button styling */
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-surface);
    color: var(--color-on-surface);
    border: var(--layout-border-width) solid var(--color-outline);
    border-radius: var(--layout-border-radius);
    cursor: pointer;
    transition: all var(--animation-duration-normal) var(--animation-timing-ease-out);
    font-family: var(--typography-font-family);
    font-size: var(--typography-text-sm);
    font-weight: var(--typography-weight-medium);
  }

  .theme-toggle:hover {
    background: var(--color-hover);
    border-color: var(--color-primary);
  }

  .theme-toggle:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Smooth transitions for theme changes */
  *,
  *::before,
  *::after {
    transition: background-color var(--animation-duration-normal) var(--animation-timing-ease-out),
                border-color var(--animation-duration-normal) var(--animation-timing-ease-out),
                color var(--animation-duration-normal) var(--animation-timing-ease-out),
                box-shadow var(--animation-duration-normal) var(--animation-timing-ease-out);
  }

  /* Disable transitions during theme initialization */
  [data-theme-transitioning] *,
  [data-theme-transitioning] *::before,
  [data-theme-transitioning] *::after {
    transition: none !important;
  }

  /* Theme-specific overrides */
  [data-theme="dark"] {
    color-scheme: dark;
  }

  [data-theme="light"] {
    color-scheme: light;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :root {
      --layout-border-width: 2px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition: none !important;
    }
  }

  /* Print styles */
  @media print {
    :root {
      color-scheme: light !important;
    }

    [data-theme="dark"] {
      filter: invert(1) hue-rotate(180deg);
    }
  }
`;
