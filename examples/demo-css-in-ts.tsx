/** @jsx h */
import { router } from "./router.ts";
import { boolean, defineComponent, h, string } from "../index.ts";
import {

  createTheme,
  css,
  cssHelpers,
  responsive,
} from "../lib/css-in-ts.ts";

// Define a theme with design tokens
const theme = createTheme({
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    light: "#f8f9fa",
    dark: "#343a40",
  },
  space: {
    1: "0.25rem",
    2: "0.5rem",
    3: "1rem",
    4: "1.5rem",
    5: "2rem",
    6: "3rem",
  },
  radii: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
    xl: "0 20px 25px rgba(0,0,0,0.1)",
  },
});

/**
 * 🎨 CSS-in-TypeScript Demo
 *
 * Showcases the new type-safe CSS system with:
 * - Full TypeScript IntelliSense for CSS properties
 * - Theme tokens and design system integration
 * - Pseudo-selectors and hover states
 * - Responsive design with media queries
 * - CSS helper utilities
 */
defineComponent("css-in-ts-demo", {
  router,

  // Type-safe styles with IntelliSense!
  styles: css({
    container: {
      padding: theme.token("space", 4),
      maxWidth: "1200px",
      margin: "0 auto",
    },

    header: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: theme.token("colors", "primary"),
      marginBottom: theme.token("space", 3),
    },

    card: {
      background: "white",
      borderRadius: theme.token("radii", "lg"),
      padding: theme.token("space", 4),
      boxShadow: theme.token("shadows", "md"),
      transition: "all 0.3s ease",

      // Hover effect with type safety!
      "&:hover": {
        boxShadow: theme.token("shadows", "xl"),
        transform: "translateY(-2px)",
      },
    },

    button: {
      ...cssHelpers.resetButton(),
      padding: `${theme.token("space", 2)} ${theme.token("space", 4)}`,
      background: theme.token("colors", "primary"),
      color: "white",
      borderRadius: theme.token("radii", "md"),
      fontWeight: 600,
      transition: "all 0.2s ease",

      "&:hover": {
        background: theme.token("colors", "dark"),
        transform: "scale(1.05)",
      },

      "&:active": {
        transform: "scale(0.95)",
      },

      "&:disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: theme.token("space", 3),
      marginTop: theme.token("space", 4),

      // Responsive design with type-safe breakpoints!
      "@media": {
        mobile: {
          gridTemplateColumns: "1fr",
        },
        tablet: {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
        desktop: {
          gridTemplateColumns: "repeat(3, 1fr)",
        },
      },
    },

    badge: {
      display: "inline-block",
      padding: `${theme.token("space", 1)} ${theme.token("space", 2)}`,
      background: theme.token("colors", "info"),
      color: "white",
      borderRadius: theme.token("radii", "full"),
      fontSize: "0.875rem",
      fontWeight: 600,
    },

    flexCenter: cssHelpers.center(),

    codeBlock: {
      background: theme.token("colors", "light"),
      padding: theme.token("space", 3),
      borderRadius: theme.token("radii", "md"),
      fontFamily: "monospace",
      fontSize: "0.875rem",
      overflowX: "auto",
      border: `1px solid ${theme.token("colors", "secondary")}`,
    },

    responsiveText: responsive({
      base: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      mobile: {
        fontSize: "0.875rem",
      },
      tablet: {
        fontSize: "1rem",
      },
      desktop: {
        fontSize: "1.125rem",
      },
      wide: {
        fontSize: "1.25rem",
      },
    }),
  }),

  render: (
    {
      title = string("CSS-in-TypeScript Demo"),
      showCode = boolean(true),
    },
    _api,
    classes,
  ) => {
    return (
      <div class={classes!.container}>
        <style dangerouslySetInnerHTML={{ __html: theme.vars() }} />

        <h1 class={classes!.header}>{title}</h1>

        <div class={classes!.card}>
          <h2>✨ Type-Safe CSS with IntelliSense</h2>
          <p class={classes!.responsiveText}>
            This component uses the new CSS-in-TypeScript system with full type
            safety, IntelliSense support, and design tokens integration.
          </p>

          <div class={classes!.grid}>
            <div class={classes!.card}>
              <h3>🎯 Type Safety</h3>
              <p>All CSS properties are type-checked at compile time.</p>
              <span class={classes!.badge}>TypeScript</span>
            </div>

            <div class={classes!.card}>
              <h3>🎨 Theme Tokens</h3>
              <p>Use design system tokens for consistent styling.</p>
              <span class={classes!.badge}>Design System</span>
            </div>

            <div class={classes!.card}>
              <h3>📱 Responsive</h3>
              <p>Built-in responsive design with media queries.</p>
              <span class={classes!.badge}>Mobile First</span>
            </div>

            <div class={classes!.card}>
              <h3>🚀 Performance</h3>
              <p>Zero runtime overhead - compiles to pure CSS.</p>
              <span class={classes!.badge}>Zero Runtime</span>
            </div>

            <div class={classes!.card}>
              <h3>✍️ IntelliSense</h3>
              <p>Full autocomplete for all CSS properties.</p>
              <span class={classes!.badge}>Developer Experience</span>
            </div>

            <div class={classes!.card}>
              <h3>🔧 Utilities</h3>
              <p>Helper functions for common CSS patterns.</p>
              <span class={classes!.badge}>Productivity</span>
            </div>
          </div>

          <div style="margin-top: 2rem;" class={classes!.flexCenter}>
            <button type="button" class={classes!.button}>
              Interactive Button
            </button>
            <button type="button" class={classes!.button} disabled style="margin-left: 1rem;">
              Disabled Button
            </button>
          </div>

          {showCode && (
            <div style="margin-top: 2rem;">
              <h3>Example Code:</h3>
              <pre class={classes!.codeBlock}>
{`// Define type-safe styles with IntelliSense
styles: css({
  button: {
    padding: theme.token("space", 3),
    background: theme.token("colors", "primary"),
    color: "white",
    borderRadius: theme.token("radii", "md"),

    // Pseudo-selectors with type safety!
    "&:hover": {
      background: theme.token("colors", "dark"),
      transform: "scale(1.05)",
    },

    // Responsive design
    "@media": {
      mobile: {
        padding: theme.token("space", 2),
        fontSize: "0.875rem",
      },
      desktop: {
        padding: theme.token("space", 4),
        fontSize: "1rem",
      },
    },
  },
})`}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  },
});

/**
 * Comparison component showing before/after
 */
defineComponent("css-comparison", {
  router,

  styles: css({
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
      padding: "2rem",

      "@media": {
        mobile: {
          gridTemplateColumns: "1fr",
        },
      },
    },

    section: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },

    title: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#333",
    },

    code: {
      background: "#f5f5f5",
      padding: "1rem",
      borderRadius: "4px",
      fontFamily: "monospace",
      fontSize: "0.875rem",
      overflowX: "auto",
    },

    badge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "999px",
      fontSize: "0.75rem",
      fontWeight: 600,
      marginTop: "1rem",
    },

    oldBadge: {
      background: "#ffc107",
      color: "#333",
    },

    newBadge: {
      background: "#28a745",
      color: "white",
    },
  }),

  render: (_props, _api, classes) => (
    <div class={classes!.container}>
      <div class={classes!.section}>
        <h3 class={classes!.title}>❌ Old Way (String-based CSS)</h3>
        <pre class={classes!.code}>
{`styles: {
  button: \`{
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border-radius: 4px;
  }\`,
  // No IntelliSense
  // No type checking
  // Error-prone strings
  // No theme integration
}`}
        </pre>
        <div class={`${classes!.badge} ${classes!.oldBadge}`}>
          String-based • No IntelliSense • Manual
        </div>
      </div>

      <div class={classes!.section}>
        <h3 class={classes!.title}>✅ New Way (CSS-in-TypeScript)</h3>
        <pre class={classes!.code}>
{`styles: css({
  button: {
    padding: theme.token("space", 3),
    background: theme.token("colors", "primary"),
    color: "white",
    borderRadius: theme.token("radii", "md"),

    "&:hover": {
      background: theme.token("colors", "dark"),
    },
  },
  // ✨ Full IntelliSense!
  // ✅ Type checking!
  // 🎨 Theme tokens!
  // 📱 Responsive support!
})`}
        </pre>
        <div class={`${classes!.badge} ${classes!.newBadge}`}>
          Type-safe • IntelliSense • Theme-aware
        </div>
      </div>
    </div>
  ),
});
