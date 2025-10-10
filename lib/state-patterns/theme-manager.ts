/**
 * Theme Manager - Functional theme switching with state management
 *
 * Provides centralized theme state with CSS custom property integration.
 * Refactored to follow Light FP principles:
 * - No classes, use factory functions
 * - Closures instead of instance variables
 * - Pure functions where possible
 * - Ports pattern (StateManager injected)
 */

import type { StateManager } from "../state-manager.ts";
import type { ThemeConfig } from "../theme-system.ts";

/**
 * Theme state interface
 */
export interface ThemeState {
  readonly currentTheme: string;
  readonly availableThemes: readonly string[];
  readonly isDarkMode: boolean;
}

/**
 * Theme manager configuration
 */
export interface ThemeManagerConfig {
  readonly topic?: string;
  readonly persistToLocalStorage?: boolean;
  readonly cssScope?: "global" | "component";
  readonly defaultTheme?: string;
}

/**
 * Theme manager instance interface
 */
export interface ThemeManager {
  readonly switchTheme: (themeName: string) => ThemeState;
  readonly toggleDarkMode: () => ThemeState;
  readonly getCurrentState: () => ThemeState;
  readonly getCurrentTheme: () => ThemeConfig | undefined;
  readonly subscribe: (callback: (state: ThemeState) => void, element: Element) => void;
  readonly addTheme: (theme: ThemeConfig) => void;
  readonly removeTheme: (themeName: string) => void;
}

// ============================================================
// Pure Helper Functions
// ============================================================

/**
 * Apply CSS data-attribute for theme switching
 */
function applyThemeAttribute(themeName: string, scope: "global" | "component"): void {
  const target = scope === "global"
    ? document.documentElement
    : document.querySelector("[data-component]") ?? document.documentElement;

  target.setAttribute("data-theme", themeName);
}

/**
 * Find opposite theme (light <-> dark)
 */
function findOppositeTheme(
  currentTheme: ThemeConfig,
  themes: Map<string, ThemeConfig>,
): ThemeConfig | undefined {
  const targetIsDark = !currentTheme.isDark;
  return Array.from(themes.values())
    .find((theme) => theme.isDark === targetIsDark);
}

/**
 * Load theme from localStorage
 */
function loadFromLocalStorage(
  topic: string,
  themes: Map<string, ThemeConfig>,
): string | null {
  try {
    const saved = localStorage.getItem(`ui-lib-theme-${topic}`);
    return (saved && themes.has(saved)) ? saved : null;
  } catch (error) {
    console.warn("Failed to load theme from localStorage:", error);
    return null;
  }
}

/**
 * Detect system color scheme preference
 */
function detectSystemPreference(themes: Map<string, ThemeConfig>): ThemeConfig | undefined {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    return Array.from(themes.values()).find((theme) => theme.isDark);
  }
  return undefined;
}

/**
 * Persist theme to localStorage
 */
function persistToStorage(topic: string, themeName: string): void {
  try {
    localStorage.setItem(`ui-lib-theme-${topic}`, themeName);
  } catch (error) {
    console.warn("Failed to persist theme to localStorage:", error);
  }
}

// ============================================================
// Theme Manager Factory
// ============================================================

/**
 * Create a functional theme manager instance
 *
 * @param stateManager - State manager port for pub/sub
 * @param themesArray - Array of theme configurations
 * @param config - Theme manager configuration
 * @returns Theme manager instance with methods
 *
 * @example
 * ```typescript
 * import { createThemeManager } from "ui-lib";
 * import { lightTheme, darkTheme } from "ui-lib/theme-system";
 *
 * const themeManager = createThemeManager(
 *   stateManager,
 *   [lightTheme, darkTheme],
 *   { defaultTheme: "light" }
 * );
 *
 * themeManager.switchTheme("dark");
 * ```
 */
export function createThemeManager(
  stateManager: StateManager,
  themesArray: readonly ThemeConfig[],
  config: ThemeManagerConfig = {},
): ThemeManager {
  // Configuration with defaults
  const topic = config.topic ?? "theme";
  const persistToLocalStorage = config.persistToLocalStorage ?? true;
  const cssScope = config.cssScope ?? "global";
  const defaultTheme = config.defaultTheme ?? themesArray[0]?.name ?? "default";

  // Internal theme registry (mutable Map is OK inside closure)
  const themes = new Map<string, ThemeConfig>();
  themesArray.forEach((theme) => themes.set(theme.name, theme));

  // Helper: Get default state
  const getDefaultState = (): ThemeState => ({
    currentTheme: defaultTheme,
    availableThemes: Array.from(themes.keys()),
    isDarkMode: false,
  });

  // Helper: Publish state to state manager
  const publishState = (state: ThemeState): void => {
    stateManager.publish(topic, state);

    if (persistToLocalStorage) {
      persistToStorage(topic, state.currentTheme);
    }
  };

  // Public API: Get current theme state
  const getCurrentState = (): ThemeState => {
    const state = stateManager.getState(topic) as ThemeState;
    return state ?? getDefaultState();
  };

  // Public API: Switch to a specific theme
  const switchTheme = (themeName: string): ThemeState => {
    const theme = themes.get(themeName);
    if (!theme) {
      throw new Error(`Theme "${themeName}" not found`);
    }

    // Apply theme via data attribute (CSS handles the rest)
    applyThemeAttribute(themeName, cssScope);

    // Create new state
    const newState: ThemeState = {
      currentTheme: themeName,
      availableThemes: Array.from(themes.keys()),
      isDarkMode: theme.isDark ?? false,
    };

    publishState(newState);
    return newState;
  };

  // Public API: Toggle between light and dark themes
  const toggleDarkMode = (): ThemeState => {
    const currentState = getCurrentState();
    const currentTheme = themes.get(currentState.currentTheme);

    if (!currentTheme) {
      throw new Error(`Current theme "${currentState.currentTheme}" not found`);
    }

    const targetTheme = findOppositeTheme(currentTheme, themes);

    if (!targetTheme) {
      console.warn("No opposite theme found for dark mode toggle");
      return currentState;
    }

    return switchTheme(targetTheme.name);
  };

  // Public API: Get current theme configuration
  const getCurrentTheme = (): ThemeConfig | undefined => {
    const state = getCurrentState();
    return themes.get(state.currentTheme);
  };

  // Public API: Subscribe to theme state changes
  const subscribe = (callback: (state: ThemeState) => void, element: Element): void => {
    stateManager.subscribe(
      topic,
      callback as (data: unknown) => void,
      element,
    );
  };

  // Public API: Add a new theme
  const addTheme = (theme: ThemeConfig): void => {
    themes.set(theme.name, theme);

    const currentState = getCurrentState();
    const newState: ThemeState = {
      ...currentState,
      availableThemes: Array.from(themes.keys()),
    };
    publishState(newState);
  };

  // Public API: Remove a theme
  const removeTheme = (themeName: string): void => {
    if (themeName === defaultTheme) {
      throw new Error(`Cannot remove default theme "${themeName}"`);
    }

    themes.delete(themeName);

    const currentState = getCurrentState();
    if (currentState.currentTheme === themeName) {
      switchTheme(defaultTheme);
    }
  };

  // Initialize theme on creation
  const initializeTheme = (): void => {
    let initialTheme = defaultTheme;

    // Try localStorage first
    if (persistToLocalStorage) {
      const saved = loadFromLocalStorage(topic, themes);
      if (saved) {
        initialTheme = saved;
      }
    }

    // Try system preference if still using default
    if (initialTheme === defaultTheme) {
      const systemTheme = detectSystemPreference(themes);
      if (systemTheme) {
        initialTheme = systemTheme.name;
      }
    }

    switchTheme(initialTheme);
  };

  // Run initialization
  initializeTheme();

  // Return public API
  return {
    switchTheme,
    toggleDarkMode,
    getCurrentState,
    getCurrentTheme,
    subscribe,
    addTheme,
    removeTheme,
  };
}

/**
 * Create theme toggle action for reactive helpers
 *
 * @param themeManager - Theme manager instance
 * @returns JavaScript code string for theme toggle
 */
export function createThemeToggleAction(themeManager: ThemeManager): string {
  return `window.uiLibThemeToggle()`;
}

/**
 * Generate client-side theme manager script for injection
 *
 * This creates a lightweight client-side version of the theme manager
 * that works without the full state manager. Useful for static sites.
 *
 * @param themes - Array of theme configurations
 * @param config - Theme manager configuration
 * @returns JavaScript code string for <script> injection
 *
 * @example
 * ```typescript
 * const script = createThemeManagerScript([lightTheme, darkTheme]);
 * // In layout:
 * <script>${script}</script>
 * ```
 */
export function createThemeManagerScript(
  themes: readonly ThemeConfig[],
  config: ThemeManagerConfig = {},
): string {
  const topic = config.topic ?? "theme";
  const defaultTheme = config.defaultTheme ?? themes[0]?.name ?? "default";
  const cssScope = config.cssScope ?? "global";

  // Serialize theme names and isDark flags (not full tokens)
  const themeData = themes.map((t) => ({
    name: t.name,
    isDark: t.isDark ?? false,
  }));
  const themesJson = JSON.stringify(themeData);

  return `
// ui-lib Theme Manager - Client-side theme switching
(function() {
  const themes = new Map(${themesJson}.map(t => [t.name, t]));
  let currentTheme = "${defaultTheme}";

  function applyTheme(themeName) {
    const theme = themes.get(themeName);
    if (!theme) {
      console.error("Theme not found:", themeName);
      return;
    }

    // Apply data-theme attribute (CSS handles the rest)
    const target = "${cssScope}" === "global"
      ? document.documentElement
      : document.querySelector("[data-component]") || document.documentElement;

    target.setAttribute("data-theme", themeName);
    currentTheme = themeName;

    // Persist to localStorage
    try {
      localStorage.setItem("ui-lib-theme-${topic}", themeName);
    } catch (e) {
      console.warn("Failed to persist theme:", e);
    }

    // Publish state if state manager exists
    if (window.funcwcState?.publish) {
      window.funcwcState.publish("${topic}", {
        currentTheme: themeName,
        availableThemes: Array.from(themes.keys()),
        isDarkMode: theme.isDark || false
      });
    }
  }

  function toggleDarkMode() {
    const current = themes.get(currentTheme);
    if (!current) return;

    const targetIsDark = !current.isDark;
    const targetTheme = Array.from(themes.values())
      .find(t => t.isDark === targetIsDark);

    if (targetTheme) {
      applyTheme(targetTheme.name);
    }
  }

  // Initialize on page load
  function initialize() {
    let initialTheme = "${defaultTheme}";

    // Try localStorage
    try {
      const saved = localStorage.getItem("ui-lib-theme-${topic}");
      if (saved && themes.has(saved)) {
        initialTheme = saved;
      }
    } catch (e) {
      console.warn("Failed to load theme:", e);
    }

    // Try system preference if still default
    if (initialTheme === "${defaultTheme}") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const darkTheme = Array.from(themes.values()).find(t => t.isDark);
      if (prefersDark && darkTheme) {
        initialTheme = darkTheme.name;
      }
    }

    applyTheme(initialTheme);
  }

  // Expose global API
  window.uiLibThemeManager = {
    switchTheme: applyTheme,
    toggleDarkMode: toggleDarkMode,
    getCurrentTheme: () => currentTheme,
    getAvailableThemes: () => Array.from(themes.keys())
  };

  window.uiLibThemeToggle = toggleDarkMode;

  // Auto-initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
`.trim();
}
