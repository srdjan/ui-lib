// Theme Manager - Type-safe theme switching state management
// Provides centralized theme state with CSS custom property integration

import type { StateManager } from "../state-manager.ts";

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  readonly name: string;
  readonly properties: Record<string, string>;
  readonly displayName?: string;
  readonly isDark?: boolean;
}

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
 * Type-safe theme manager for application theming
 */
export class ThemeManager {
  private readonly topic: string;
  private readonly persistToLocalStorage: boolean;
  private readonly cssScope: "global" | "component";
  private readonly themes = new Map<string, ThemeConfig>();
  private readonly defaultTheme: string;

  constructor(
    private readonly stateManager: StateManager,
    themes: readonly ThemeConfig[],
    config: ThemeManagerConfig = {},
  ) {
    this.topic = config.topic ?? "theme";
    this.persistToLocalStorage = config.persistToLocalStorage ?? true;
    this.cssScope = config.cssScope ?? "global";
    this.defaultTheme = config.defaultTheme ?? themes[0]?.name ?? "default";

    // Register themes
    themes.forEach((theme) => {
      this.themes.set(theme.name, theme);
    });

    // Load initial theme
    this.loadInitialTheme();
  }

  /**
   * Switch to a specific theme
   */
  switchTheme(themeName: string): ThemeState {
    const theme = this.themes.get(themeName);
    if (!theme) {
      throw new Error(`Theme "${themeName}" not found`);
    }

    // Apply CSS custom properties
    this.applyCSSProperties(theme.properties);

    // Update state
    const newState: ThemeState = {
      currentTheme: themeName,
      availableThemes: Array.from(this.themes.keys()),
      isDarkMode: theme.isDark ?? false,
    };

    this.publishState(newState);
    return newState;
  }

  /**
   * Toggle between light and dark themes
   */
  toggleDarkMode(): ThemeState {
    const currentState = this.getCurrentState();
    const currentTheme = this.themes.get(currentState.currentTheme);
    
    if (!currentTheme) {
      throw new Error(`Current theme "${currentState.currentTheme}" not found`);
    }

    // Find opposite theme
    const targetIsDark = !currentTheme.isDark;
    const targetTheme = Array.from(this.themes.values())
      .find((theme) => theme.isDark === targetIsDark);

    if (!targetTheme) {
      console.warn("No opposite theme found for dark mode toggle");
      return currentState;
    }

    return this.switchTheme(targetTheme.name);
  }

  /**
   * Get current theme state
   */
  getCurrentState(): ThemeState {
    const state = this.stateManager.getState(this.topic) as ThemeState;
    return state ?? this.getDefaultState();
  }

  /**
   * Subscribe to theme state changes
   */
  subscribe(callback: (state: ThemeState) => void, element: Element): void {
    this.stateManager.subscribe(this.topic, callback as (data: unknown) => void, element);
  }

  /**
   * Get current theme configuration
   */
  getCurrentTheme(): ThemeConfig | undefined {
    const state = this.getCurrentState();
    return this.themes.get(state.currentTheme);
  }

  /**
   * Add a new theme
   */
  addTheme(theme: ThemeConfig): void {
    this.themes.set(theme.name, theme);
    
    // Update available themes in state
    const currentState = this.getCurrentState();
    const newState: ThemeState = {
      ...currentState,
      availableThemes: Array.from(this.themes.keys()),
    };
    this.publishState(newState);
  }

  /**
   * Remove a theme
   */
  removeTheme(themeName: string): void {
    if (themeName === this.defaultTheme) {
      throw new Error(`Cannot remove default theme "${themeName}"`);
    }

    this.themes.delete(themeName);
    
    // Switch to default if current theme was removed
    const currentState = this.getCurrentState();
    if (currentState.currentTheme === themeName) {
      this.switchTheme(this.defaultTheme);
    }
  }

  private loadInitialTheme(): void {
    let initialTheme = this.defaultTheme;

    // Try to load from localStorage
    if (this.persistToLocalStorage) {
      try {
        const saved = localStorage.getItem(`ui-lib-theme-${this.topic}`);
        if (saved && this.themes.has(saved)) {
          initialTheme = saved;
        }
      } catch (error) {
        console.warn("Failed to load theme from localStorage:", error);
      }
    }

    // Try to detect system preference
    if (initialTheme === this.defaultTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const darkTheme = Array.from(this.themes.values()).find((theme) => theme.isDark);
      if (prefersDark && darkTheme) {
        initialTheme = darkTheme.name;
      }
    }

    this.switchTheme(initialTheme);
  }

  private applyCSSProperties(properties: Record<string, string>): void {
    const target = this.cssScope === "global" 
      ? document.documentElement 
      : document.querySelector("[data-component]") ?? document.documentElement;

    Object.entries(properties).forEach(([property, value]) => {
      const cssProperty = property.startsWith("--") ? property : `--${property}`;
      target.style.setProperty(cssProperty, value);
    });
  }

  private publishState(state: ThemeState): void {
    this.stateManager.publish(this.topic, state);
    
    if (this.persistToLocalStorage) {
      try {
        localStorage.setItem(`ui-lib-theme-${this.topic}`, state.currentTheme);
      } catch (error) {
        console.warn("Failed to persist theme to localStorage:", error);
      }
    }
  }

  private getDefaultState(): ThemeState {
    return {
      currentTheme: this.defaultTheme,
      availableThemes: Array.from(this.themes.keys()),
      isDarkMode: false,
    };
  }
}

/**
 * Create theme toggle action for reactive helpers
 */
export const createThemeToggleAction = (themeManager: ThemeManager): string => {
  return `window.uiLibThemeToggle()`;
};

/**
 * JavaScript implementation string for injection into host pages
 */
export const createThemeManagerScript = (
  themes: readonly ThemeConfig[],
  config: ThemeManagerConfig = {},
): string => {
  const topic = config.topic ?? "theme";
  const defaultTheme = config.defaultTheme ?? themes[0]?.name ?? "default";
  const cssScope = config.cssScope ?? "global";

  const themesJson = JSON.stringify(themes);

  return `
// ui-lib Theme Manager - Client-side theme switching
window.uiLibThemeManager = {
  themes: new Map(${themesJson}.map(theme => [theme.name, theme])),
  currentTheme: "${defaultTheme}",
  
  switchTheme(themeName) {
    const theme = this.themes.get(themeName);
    if (!theme) {
      console.error("Theme not found:", themeName);
      return;
    }
    
    // Apply CSS properties
    const target = "${cssScope}" === "global" 
      ? document.documentElement 
      : document.querySelector("[data-component]") || document.documentElement;
    
    Object.entries(theme.properties).forEach(([property, value]) => {
      const cssProperty = property.startsWith("--") ? property : "--" + property;
      target.style.setProperty(cssProperty, value);
    });
    
    this.currentTheme = themeName;
    
    // Update state
    const themeState = {
      currentTheme: themeName,
      availableThemes: Array.from(this.themes.keys()),
      isDarkMode: theme.isDark || false
    };
    
    window.funcwcState?.publish("${topic}", themeState);
    
    // Persist to localStorage
    try {
      localStorage.setItem("ui-lib-theme-${topic}", themeName);
    } catch (e) {
      console.warn("Failed to persist theme:", e);
    }
  },
  
  toggleDarkMode() {
    const currentTheme = this.themes.get(this.currentTheme);
    if (!currentTheme) return;
    
    const targetIsDark = !currentTheme.isDark;
    const targetTheme = Array.from(this.themes.values())
      .find(theme => theme.isDark === targetIsDark);
    
    if (targetTheme) {
      this.switchTheme(targetTheme.name);
    }
  }
};

// Global theme toggle function
window.uiLibThemeToggle = function() {
  window.uiLibThemeManager.toggleDarkMode();
};

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", function() {
  let initialTheme = "${defaultTheme}";
  
  // Load from localStorage
  try {
    const saved = localStorage.getItem("ui-lib-theme-${topic}");
    if (saved && window.uiLibThemeManager.themes.has(saved)) {
      initialTheme = saved;
    }
  } catch (e) {
    console.warn("Failed to load theme:", e);
  }
  
  // Detect system preference
  if (initialTheme === "${defaultTheme}") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkTheme = Array.from(window.uiLibThemeManager.themes.values())
      .find(theme => theme.isDark);
    if (prefersDark && darkTheme) {
      initialTheme = darkTheme.name;
    }
  }
  
  window.uiLibThemeManager.switchTheme(initialTheme);
});
`.trim();
};