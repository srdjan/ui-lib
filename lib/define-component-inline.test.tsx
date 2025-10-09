/** @jsx h */
// Tests for defineComponent with inline prop definitions
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { renderComponent } from "./component-state.ts";
import { defineComponent, defineSimpleComponent } from "./define-component.ts";
import { h } from "./jsx-runtime.ts";
import { boolean, number, oneOf, string } from "./prop-helpers.ts";
import { getRegistry } from "./registry.ts";

import { del, post } from "./api-helpers.ts";
Deno.test("Inline props: Basic component with prop helpers", () => {
  const registry = getRegistry();
  delete registry["inline-test"];

  defineComponent("inline-test", {
    render: ({
      title = string("Default Title"),
      count = number(0),
      active = boolean(false),
    }) => (
      <div class={active ? "active" : ""}>
        <h2>{title}</h2>
        <span>Count: {count}</span>
      </div>
    ),
  });

  assertExists(registry["inline-test"]);

  // Test with default values
  const result1 = renderComponent("inline-test", {});
  assertExists(result1.includes("Default Title"));
  assertExists(result1.includes("Count: 0"));

  // Test with provided values
  const result2 = renderComponent("inline-test", {
    title: "Custom Title",
    count: "42",
    active: "true",
  });
  assertExists(result2.includes("Custom Title"));
  assertExists(result2.includes("Count: 42"));
  assertExists(result2.includes('class="active"'));
});

Deno.test("Inline props: Component with oneOf helper", () => {
  const registry = getRegistry();
  delete registry["inline-oneOf"];

  defineComponent("inline-oneOf", {
    render: ({
      priority = oneOf(["low", "medium", "high"], "medium"),
      status = oneOf(["pending", "active", "completed"], "pending"),
    }) => (
      <div class={`priority-${priority} status-${status}`}>
        <span>Priority: {priority}</span>
        <span>Status: {status}</span>
      </div>
    ),
  });

  const result = renderComponent("inline-oneOf", {
    priority: "high",
    status: "active",
  });
  assertExists(result.includes("priority-high"));
  assertExists(result.includes("status-active"));
  assertExists(result.includes("Priority: high"));
  assertExists(result.includes("Status: active"));
});

Deno.test("Inline props: Component with CSS-only format", () => {
  const registry = getRegistry();
  delete registry["inline-styles"];

  defineComponent("inline-styles", {
    styles: {
      card: `{
        padding: 2rem;
        background: white;
        border-radius: 0.5rem;
      }`,
      title: `{
        font-size: 1.5rem;
        font-weight: bold;
      }`,
    },
    render: (
      {
        title = string("Card Title"),
        content = string("Card content"),
      },
      _api,
      classes,
    ) => (
      <div class={classes?.card}>
        <h2 class={classes?.title}>{title}</h2>
        <p>{content}</p>
      </div>
    ),
  });

  assertExists(registry["inline-styles"].css);
  const result = renderComponent("inline-styles", {
    title: "Test Card",
    content: "Test Content",
  });
  assertExists(result.includes("Test Card"));
  assertExists(result.includes("Test Content"));
});

Deno.test("defineSimpleComponent: Simplified API", () => {
  const registry = getRegistry();
  delete registry["simple-component"];

  defineSimpleComponent(
    "simple-component",
    (
      {
        name = string("Anonymous"),
        age = number(0),
      },
      _api,
      classes,
    ) => (
      <div class={classes?.container}>
        <span>{name} is {age} years old</span>
      </div>
    ),
    {
      container: `{ padding: 1rem; background: #f0f0f0; }`,
    },
  );

  const result = renderComponent("simple-component", {
    name: "Alice",
    age: "25",
  });
  assertExists(result.includes("Alice is 25 years old"));
});

Deno.test("Inline props: Component with API integration", () => {
  const registry = getRegistry();
  delete registry["inline-api"];

  const mockHandler = async () => new Response(JSON.stringify({ ok: true }));

  defineComponent("inline-api", {
    api: {
      save: post("/api/save", mockHandler),
      delete: del("/api/delete/:id", mockHandler),
    },
    render: ({
      id = string(""),
      text = string("Item"),
    }, api) => (
      <div>
        <span>{text}</span>
        {api && (
          <div>
            <button {...api.save()}>Save</button>
            <button {...api.delete(id)}>Delete</button>
          </div>
        )}
      </div>
    ),
  });

  assertExists(registry["inline-api"].api);
  const result = renderComponent("inline-api", {
    id: "123",
    text: "Todo Item",
  });
  assertExists(result.includes("Todo Item"));
  assertExists(result.includes("<button"));
});

Deno.test("Inline props: No props (simple render)", () => {
  const registry = getRegistry();
  delete registry["no-props"];

  defineComponent("no-props", {
    render: () => <div>Static content with no props</div>,
  });

  const result = renderComponent("no-props", {});
  assertEquals(
    result,
    '<div data-component="no-props">Static content with no props</div>',
  );
});
