#!/usr/bin/env deno run --allow-net --allow-read --allow-env

/** @jsx h */
/**
 * Layout Components Demo
 * Demonstrates the different layout options available in ui-lib
 */

import { Router } from "../mod-simple.ts";
import { defineComponent, h } from "../lib/define-component.ts";
import { renderComponent } from "../lib/component-state.ts";

import "../lib/components/layout/page.ts";
import "../lib/components/layout/stack.ts";
import "../lib/components/layout/section.ts";
import "../lib/components/layout/header.ts";
import "../lib/components/layout/card.ts";
import "../lib/components/layout/grid.ts";
import "../lib/components/data-display/stat.ts";

const router = new Router();

// Demo page showing different layout options
defineComponent<{}>("layout-demo", {
  render: () => {
    const pageExamples = [
      {
        title: "Constrained Page (Default)",
        code: `renderComponent("page", { variant: "constrained" })`,
        preview: renderComponent("page", { variant: "constrained" }).replace("{{children}}", `
          <div style=\"background: #f0f0f0; padding: 1rem; text-align: center;\">
            Constrained page with max-width and centered content
          </div>
        `),
      },
      {
        title: "Fluid Page",
        code: `renderComponent("page", { variant: "fluid" })`,
        preview: renderComponent("page", { variant: "fluid" }).replace("{{children}}", `
          <div style=\"background: #f0f0f0; padding: 1rem; text-align: center;\">
            Fluid page that takes full width
          </div>
        `),
      },
      {
        title: "Narrow Page",
        code: `renderComponent("page", { variant: "narrow" })`,
        preview: renderComponent("page", { variant: "narrow" }).replace("{{children}}", `
          <div style=\"background: #f0f0f0; padding: 1rem; text-align: center;\">
            Narrow page for content-focused layouts
          </div>
        `),
      },
    ];

    const stackExamples = [
      {
        title: "Stack with Medium Spacing",
        code: `renderComponent("stack", { spacing: "md" })`,
        preview: renderComponent("stack", { spacing: "md" }).replace("{{children}}", `
          <div style=\"background: #e0e0e0; padding: 0.5rem;\">Item 1</div>
          <div style=\"background: #d0d0d0; padding: 0.5rem;\">Item 2</div>
          <div style=\"background: #c0c0c0; padding: 0.5rem;\">Item 3</div>
        `),
      },
      {
        title: "Stack with Large Spacing",
        code: `renderComponent("stack", { spacing: "xl" })`,
        preview: renderComponent("stack", { spacing: "xl" }).replace("{{children}}", `
          <div style=\"background: #e0e0e0; padding: 0.5rem;\">Item 1</div>
          <div style=\"background: #d0d0d0; padding: 0.5rem;\">Item 2</div>
          <div style=\"background: #c0c0c0; padding: 0.5rem;\">Item 3</div>
        `),
      },
    ];

    const gridExamples = [
      {
        title: "3-Column Grid",
        code: `renderComponent("grid", { columns: 3, gap: "md" })`,
        preview: renderComponent("grid", { columns: 3, gap: "md" }).replace("{{children}}", [
          renderComponent("stat", { value: "42", label: "Active Users" }),
          renderComponent("stat", { value: "128", label: "Total Posts" }),
          renderComponent("stat", { value: "91%", label: "Uptime" }),
        ].join("")),
      },
      {
        title: "Auto-fit Grid",
        code: `renderComponent("grid", { columns: "auto", minItemWidth: "200px" })`,
        preview: renderComponent("grid", { columns: "auto", minItemWidth: "200px" }).replace("{{children}}", [
          renderComponent("card", { title: "Card 1" }).replace("{{children}}", "Auto-sized card content"),
          renderComponent("card", { title: "Card 2" }).replace("{{children}}", "Auto-sized card content"),
          renderComponent("card", { title: "Card 3" }).replace("{{children}}", "Auto-sized card content"),
        ].join("")),
      },
    ];

    const styles = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background: #f8fafc;
        color: #0f172a;
      }

      .layout-demo {
        max-width: 1100px;
        margin: 0 auto;
        padding: 3rem 1.5rem 4rem;
        display: grid;
        gap: 3rem;
      }

      .layout-demo__hero {
        text-align: center;
        display: grid;
        gap: 0.75rem;
      }

      .layout-demo__hero h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 2.5rem);
      }

      .layout-demo__hero p {
        margin: 0;
        color: #64748b;
      }

      .demo-section {
        display: grid;
        gap: 1.5rem;
      }

      .demo-section__header h2 {
        margin: 0;
        font-size: 1.4rem;
      }

      .demo-section__header p {
        margin: 0.35rem 0 0;
        color: #64748b;
      }

      .demo-section__grid {
        display: grid;
        gap: 1.6rem;
      }

      @media (min-width: 960px) {
        .demo-section__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      code {
        background: rgba(15, 23, 42, 0.07);
        padding: 0.15em 0.4em;
        border-radius: 0.35rem;
        font-size: 0.9rem;
      }

      .demo-card {
        background: #ffffff;
        border-radius: 1.25rem;
        padding: 1.75rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
        display: grid;
        gap: 1rem;
      }

      .demo-card__preview {
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 1rem;
        padding: 1.25rem;
        background: rgba(248, 250, 252, 0.9);
      }

      .demo-card__preview > * {
        margin: 0;
      }
    `;

    const renderExampleCard = (example: { title: string; code: string; preview: string }) => (
      <article class="demo-card">
        <header>
          <h3>{example.title}</h3>
        </header>
        <p>
          <strong>Usage:</strong> <code>{example.code}</code>
        </p>
        <div class="demo-card__preview" dangerouslySetInnerHTML={{ __html: example.preview }} />
      </article>
    );

    const renderSection = (
      title: string,
      subtitle: string,
      examples: readonly { title: string; code: string; preview: string }[],
    ) => (
      <section class="demo-section">
        <div class="demo-section__header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div class="demo-section__grid">
          {examples.map(renderExampleCard)}
        </div>
      </section>
    );

    const pageSection = renderSection(
      "Page Layouts",
      "Different page container options",
      pageExamples,
    );
    const stackSection = renderSection(
      "Stack Layouts",
      "Vertical spacing with design tokens",
      stackExamples,
    );
    const gridSection = renderSection(
      "Grid Layouts",
      "Flexible CSS Grid with responsive options",
      gridExamples,
    );

    return "<!DOCTYPE html>" + (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Layout Components Demo - ui-lib</title>
          <style dangerouslySetInnerHTML={{ __html: styles }} />
        </head>
        <body>
          <main class="layout-demo">
            <header class="layout-demo__hero">
              <h1>Layout Components Demo</h1>
              <p>Explore constrained layouts, responsive stacks, and adaptive grids.</p>
            </header>
            {pageSection}
            {stackSection}
            {gridSection}
          </main>
        </body>
      </html>
    );
  },
});

router.register("GET", "/", async () => {
  return new Response(renderComponent("layout-demo", {}), {
    headers: { "Content-Type": "text/html" },
  });
});

const port = Number(Deno.env.get("PORT")) || 8085;
console.log(`🎨 Layout Components Demo running at http://localhost:${port}`);

Deno.serve({ port }, async (req) => {
  const match = router.match(req);
  if (match) {
    return await match.handler(req, match.params);
  }
  return new Response("Not Found", { status: 404 });
});
