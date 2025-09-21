#!/usr/bin/env deno run --allow-net --allow-read --allow-env

/**
 * Layout Components Demo
 * Demonstrates the different layout options available in ui-lib
 */

import { html, Router } from "../mod-simple.ts";
import { defineComponent } from "../lib/define-component.ts";
import { renderComponent } from "../lib/component-state.ts";

// Import layout components
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
    // Create examples of different layouts
    const pageExamples = [
      {
        title: "Constrained Page (Default)",
        code: `renderComponent("page", { variant: "constrained" })`,
        preview: renderComponent("page", { variant: "constrained" }).replace("{{children}}", `
          <div style="background: #f0f0f0; padding: 1rem; text-align: center;">
            Constrained page with max-width and centered content
          </div>
        `),
      },
      {
        title: "Fluid Page",
        code: `renderComponent("page", { variant: "fluid" })`,
        preview: renderComponent("page", { variant: "fluid" }).replace("{{children}}", `
          <div style="background: #f0f0f0; padding: 1rem; text-align: center;">
            Fluid page that takes full width
          </div>
        `),
      },
      {
        title: "Narrow Page",
        code: `renderComponent("page", { variant: "narrow" })`,
        preview: renderComponent("page", { variant: "narrow" }).replace("{{children}}", `
          <div style="background: #f0f0f0; padding: 1rem; text-align: center;">
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
          <div style="background: #e0e0e0; padding: 0.5rem;">Item 1</div>
          <div style="background: #d0d0d0; padding: 0.5rem;">Item 2</div>
          <div style="background: #c0c0c0; padding: 0.5rem;">Item 3</div>
        `),
      },
      {
        title: "Stack with Large Spacing",
        code: `renderComponent("stack", { spacing: "xl" })`,
        preview: renderComponent("stack", { spacing: "xl" }).replace("{{children}}", `
          <div style="background: #e0e0e0; padding: 0.5rem;">Item 1</div>
          <div style="background: #d0d0d0; padding: 0.5rem;">Item 2</div>
          <div style="background: #c0c0c0; padding: 0.5rem;">Item 3</div>
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

    const headerContent = renderComponent("header", {
      title: "Layout Components Demo",
      subtitle: "Comprehensive layout system for ui-lib applications",
      description: "Explore the different layout components and options available for building consistent, responsive interfaces.",
      level: 1,
      centered: true,
    });

    const pageSection = renderComponent("section", {
      title: "Page Layouts",
      subtitle: "Different page container options",
    }).replace("{{children}}", pageExamples.map(example =>
      renderComponent("card", { title: example.title }).replace("{{children}}", `
        <p><strong>Usage:</strong> <code>${example.code}</code></p>
        <div style="border: 1px solid #ddd; margin: 1rem 0;">
          ${example.preview}
        </div>
      `)
    ).join(""));

    const stackSection = renderComponent("section", {
      title: "Stack Layouts",
      subtitle: "Vertical spacing with design tokens",
    }).replace("{{children}}", stackExamples.map(example =>
      renderComponent("card", { title: example.title }).replace("{{children}}", `
        <p><strong>Usage:</strong> <code>${example.code}</code></p>
        <div style="border: 1px solid #ddd; margin: 1rem 0;">
          ${example.preview}
        </div>
      `)
    ).join(""));

    const gridSection = renderComponent("section", {
      title: "Grid Layouts",
      subtitle: "Flexible CSS Grid with responsive options",
    }).replace("{{children}}", gridExamples.map(example =>
      renderComponent("card", { title: example.title }).replace("{{children}}", `
        <p><strong>Usage:</strong> <code>${example.code}</code></p>
        <div style="border: 1px solid #ddd; margin: 1rem 0;">
          ${example.preview}
        </div>
      `)
    ).join(""));

    const stackContent = renderComponent("stack", {
      spacing: "2xl",
    }).replace("{{children}}", [
      headerContent,
      pageSection,
      stackSection,
      gridSection,
    ].join(""));

    const pageContent = renderComponent("page", {
      variant: "constrained",
      maxWidth: "1200px",
    }).replace("{{children}}", stackContent);

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Layout Components Demo - ui-lib</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background: #fafafa;
            }
            code {
              background: #f5f5f5;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-family: Monaco, Consolas, monospace;
              font-size: 0.9em;
            }
            .header { text-align: center; }
            .header__title { color: #333; margin-bottom: 0.5rem; }
            .header__subtitle { color: #666; margin-bottom: 0.5rem; }
            .header__description { color: #888; max-width: 600px; margin: 0 auto; }
            .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .card__title { margin-top: 0; color: #333; }
            .section__title { color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 0.5rem; }
            .stat { text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 6px; }
            .stat__value { display: block; font-size: 2rem; font-weight: bold; color: #2563eb; }
            .stat__label { display: block; font-size: 0.875rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
          </style>
        </head>
        <body>
          ${pageContent}
        </body>
      </html>
    `;
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