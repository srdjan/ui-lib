#!/usr/bin/env -S deno run --allow-net --allow-read
/**
 * Style Demo - Showcases the modernized ui-lib design system
 *
 * Run: deno run --allow-net --allow-read examples/style-demo.tsx
 * Visit: http://localhost:8080
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { getBaseThemeCss, lightTheme, darkTheme, createThemeManagerScript } from "../mod.ts";
import { generateCSS } from "../lib/styles/css-generator.ts";
import { Button } from "../lib/components/button/button.ts";

const themeCSS = getBaseThemeCss([lightTheme, darkTheme], {
  includeSystemPreference: true,
  defaultTheme: "light",
});

const componentCSS = generateCSS();
const themeScript = createThemeManagerScript([lightTheme, darkTheme], {
  defaultTheme: "light",
  persistToLocalStorage: true,
});

function DemoPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ui-lib Style Demo - Modernized Design System</title>

      <style>${themeCSS}</style>
      <style>${componentCSS}</style>
      <script>${themeScript}</script>

      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: var(--typography-font-sans);
          background: var(--color-background);
          color: var(--color-on-background);
        }
        .demo-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-8);
        }
        .demo-header {
          text-align: center;
          margin-bottom: var(--space-12);
        }
        .demo-section {
          margin-bottom: var(--space-12);
        }
        .demo-section h2 {
          font-size: var(--typography-text-2xl);
          font-weight: var(--typography-weight-semibold);
          color: var(--color-primary);
          margin-bottom: var(--space-6);
        }
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-6);
        }
        .button-demo {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          align-items: center;
        }
      </style>
    </head>
    <body>
      <div class="demo-container">
        <header class="demo-header">
          <h1 class="display-1">ui-lib Design System</h1>
          <p class="body-large" style="color: var(--color-on-surface-variant);">
            Modernized with indigo primary, refined shadows, spring animations, and enhanced typography
          </p>
          <button
            onclick="window.uiLibThemeToggle()"
            style="margin-top: var(--space-4); padding: var(--space-3) var(--space-6); border-radius: var(--radius-md); border: 1px solid var(--color-outline); background: var(--color-surface); cursor: pointer;"
          >
            Toggle Theme
          </button>
        </header>

        <!-- Button Variants -->
        <section class="demo-section">
          <h2>Enhanced Buttons</h2>
          <div class="button-demo">
            ${Button({ children: "Primary", variant: "primary" })}
            ${Button({ children: "Secondary", variant: "secondary" })}
            ${Button({ children: "Outline", variant: "outline" })}
            ${Button({ children: "Ghost", variant: "ghost" })}
            ${Button({ children: "Destructive", variant: "destructive" })}
          </div>
          <h3 style="margin-top: var(--space-8); margin-bottom: var(--space-4); font-size: var(--typography-text-lg);">New Modern Variants</h3>
          <div class="button-demo">
            ${Button({ children: "✨ Gradient", variant: "gradient" })}
            ${Button({ children: "🌟 Glow", variant: "glow" })}
            ${Button({ children: "⬆️ Elevated", variant: "elevated" })}
          </div>
        </section>

        <!-- Card Variants -->
        <section class="demo-section">
          <h2>Enhanced Cards</h2>
          <div class="demo-grid">
            <div class="card">
              <div class="card__header">
                <h3 class="card__title">Default Card</h3>
                <p class="card__subtitle">Standard card with subtle shadow</p>
              </div>
              <div class="card__content">
                Hover to see smooth spring animation and refined shadow transitions.
              </div>
            </div>

            <div class="card card--elevated">
              <div class="card__header">
                <h3 class="card__title">Elevated Card</h3>
                <p class="card__subtitle">Dramatic shadow on hover</p>
              </div>
              <div class="card__content">
                Notice the lift animation with enhanced shadow depth.
              </div>
            </div>

            <div class="card card--interactive">
              <div class="card__header">
                <h3 class="card__title">Interactive Card</h3>
                <p class="card__subtitle">Gradient overlay effect</p>
              </div>
              <div class="card__content">
                Hover to see the gradient overlay and border color change.
              </div>
            </div>

            <div class="card card--outlined">
              <div class="card__header">
                <h3 class="card__title">Outlined Card</h3>
                <p class="card__subtitle">Clean border style</p>
              </div>
              <div class="card__content">
                Transparent background with 2px border.
              </div>
            </div>
          </div>
        </section>

        <!-- Typography -->
        <section class="demo-section">
          <h2>Enhanced Typography</h2>
          <div style="background: var(--color-surface); padding: var(--space-8); border-radius: var(--radius-lg);">
            <h1 class="display-1">Display 1 - Hero Headlines</h1>
            <h2 class="display-2">Display 2 - Sub Heroes</h2>
            <h3 class="heading-1">Heading 1 - Major Sections</h3>
            <h4 class="heading-2">Heading 2 - Sub Sections</h4>
            <p class="body-large">Body Large - Introductory text with enhanced readability using Inter font family.</p>
            <p class="body-base">Body Base - Standard paragraph text with fluid sizing and improved line height.</p>
            <p class="caption">Caption text - Smaller supporting text with refined spacing</p>
            <code class="code-inline">inline code</code>
          </div>
        </section>

        <!-- Color Palette -->
        <section class="demo-section">
          <h2>Refined Color System</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
            <div style="padding: var(--space-6); background: var(--color-primary-500); color: white; border-radius: var(--radius-md); text-align: center;">
              <strong>Indigo Primary</strong><br>
              <small>Sophisticated & Modern</small>
            </div>
            <div style="padding: var(--space-6); background: var(--color-success-500); color: white; border-radius: var(--radius-md); text-align: center;">
              <strong>Success Green</strong><br>
              <small>Full 100-900 Scale</small>
            </div>
            <div style="padding: var(--space-6); background: var(--color-warning-500); color: white; border-radius: var(--radius-md); text-align: center;">
              <strong>Warning Yellow</strong><br>
              <small>Attention States</small>
            </div>
            <div style="padding: var(--space-6); background: var(--color-error-500); color: white; border-radius: var(--radius-md); text-align: center;">
              <strong>Error Red</strong><br>
              <small>Critical Feedback</small>
            </div>
          </div>
        </section>

        <!-- Shadows & Elevation -->
        <section class="demo-section">
          <h2>Refined Shadow System</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-6);">
            <div style="padding: var(--space-6); background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-xs); text-align: center;">
              <strong>XS</strong><br>
              <small>Micro shadow</small>
            </div>
            <div style="padding: var(--space-6); background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); text-align: center;">
              <strong>SM</strong><br>
              <small>Subtle</small>
            </div>
            <div style="padding: var(--space-6); background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-md); text-align: center;">
              <strong>MD</strong><br>
              <small>Standard</small>
            </div>
            <div style="padding: var(--space-6); background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); text-align: center;">
              <strong>LG</strong><br>
              <small>Elevated</small>
            </div>
            <div style="padding: var(--space-6); background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-xl); text-align: center;">
              <strong>XL</strong><br>
              <small>High</small>
            </div>
            <div style="padding: var(--space-6); background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-primary); text-align: center;">
              <strong>Primary</strong><br>
              <small>Colored</small>
            </div>
          </div>
        </section>

        <footer style="text-align: center; margin-top: var(--space-12); padding-top: var(--space-8); border-top: 1px solid var(--color-outline); color: var(--color-on-surface-variant);">
          <p>ui-lib Design System v0.12.0 - SSR-first, DOM-native, Zero runtime</p>
        </footer>
      </div>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    return new Response(DemoPage(), {
      headers: { "Content-Type": "text/html" },
    });
  }

  return new Response("Not Found", { status: 404 });
};

console.log("🎨 Style Demo Server");
console.log("📍 http://localhost:8080");
console.log("\nShowcasing:");
console.log("✨ New button variants (gradient, glow, elevated)");
console.log("🎴 Enhanced card animations");
console.log("🎯 Refined typography with Inter font");
console.log("🌈 Sophisticated indigo color system");
console.log("💫 Spring-based animations");
console.log("\nPress Ctrl+C to stop\n");

await serve(handler, { port: 8080 });
