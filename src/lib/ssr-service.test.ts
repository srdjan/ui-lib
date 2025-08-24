import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { renderComponent } from "./ssr-service.ts";
import { getRegistry } from "./registry.ts";

Deno.test("SSR Service - Render basic component", () => {
  const registry = getRegistry();
  registry["test-basic-ssr"] = {
    init: () => ({ count: 42 }),
    render: (state, props, actions) => {
      const count = (state as { count: number }).count;
      return `<div>Count: ${count}</div>`;
    },
  };
  
  const html = renderComponent("test-basic-ssr");
  assertEquals(html, "<div>Count: 42</div>");
});

Deno.test("SSR Service - Render component with CSS", () => {
  const registry = getRegistry();
  registry["test-css-ssr"] = {
    init: () => ({ message: "styled" }),
    css: ".message { color: red; font-weight: bold; }",
    render: (state, props, actions) => {
      const message = (state as { message: string }).message;
      return `<div class="message">${message}</div>`;
    },
  };
  
  const html = renderComponent("test-css-ssr");
  assertEquals(html, '<style>.message { color: red; font-weight: bold; }</style><div class="message">styled</div>');
});

Deno.test("SSR Service - Render component with props", () => {
  const registry = getRegistry();
  registry["test-props-ssr"] = {
    init: () => ({ base: 10 }),
    props: {
      multiplier: { attribute: "multiplier", parse: (v) => Number(v) || 1 },
      label: { attribute: "label", parse: (v) => String(v) },
    },
    render: (state, props, actions) => {
      const base = (state as { base: number }).base;
      const { multiplier, label } = props as { multiplier: number; label: string };
      const result = base * multiplier;
      return `<div>${label}: ${result}</div>`;
    },
  };
  
  const html = renderComponent("test-props-ssr", { 
    multiplier: "3", 
    label: "Result" 
  });
  assertEquals(html, "<div>Result: 30</div>");
});

Deno.test("SSR Service - Render component with optional props", () => {
  const registry = getRegistry();
  registry["test-optional-props"] = {
    init: () => ({ value: 100 }),
    props: {
      prefix: { attribute: "prefix", parse: (v) => v ? String(v) : undefined },
      suffix: { attribute: "suffix", parse: (v) => v ? String(v) : undefined },
    },
    render: (state, props, actions) => {
      const value = (state as { value: number }).value;
      const { prefix, suffix } = props as { prefix?: string; suffix?: string };
      
      const parts = [
        prefix || "",
        String(value),
        suffix || ""
      ].filter(Boolean);
      
      return `<div>${parts.join(" ")}</div>`;
    },
  };
  
  // With all props
  let html = renderComponent("test-optional-props", { 
    prefix: "Value:", 
    suffix: "units" 
  });
  assertEquals(html, "<div>Value: 100 units</div>");
  
  // With some props missing
  html = renderComponent("test-optional-props", { prefix: "Total:" });
  assertEquals(html, "<div>Total: 100</div>");
  
  // With no props
  html = renderComponent("test-optional-props", {});
  assertEquals(html, "<div>100</div>");
});

Deno.test("SSR Service - Render component without props spec", () => {
  const registry = getRegistry();
  registry["test-no-props"] = {
    init: () => ({ data: "no props needed" }),
    render: (state, props, actions) => {
      const data = (state as { data: string }).data;
      return `<span>${data}</span>`;
    },
  };
  
  const html = renderComponent("test-no-props", { ignored: "value" });
  assertEquals(html, "<span>no props needed</span>");
});

Deno.test("SSR Service - Render non-existent component", () => {
  const html = renderComponent("does-not-exist");
  assertEquals(html, "<!-- component does-not-exist not registered -->");
});

Deno.test("SSR Service - Render component with complex state", () => {
  const registry = getRegistry();
  registry["test-complex-state"] = {
    init: () => ({
      items: [
        { id: 1, name: "First", active: true },
        { id: 2, name: "Second", active: false },
      ],
      total: 2,
      title: "Item List",
    }),
    render: (state, props, actions) => {
      const { items, total, title } = state as {
        items: Array<{ id: number; name: string; active: boolean }>;
        total: number;
        title: string;
      };
      
      const itemsHtml = items
        .map(item => `<li class="${item.active ? 'active' : 'inactive'}">${item.name}</li>`)
        .join("");
      
      return `<div><h3>${title}</h3><ul>${itemsHtml}</ul><p>Total: ${total}</p></div>`;
    },
  };
  
  const html = renderComponent("test-complex-state");
  const expected = '<div><h3>Item List</h3><ul><li class="active">First</li><li class="inactive">Second</li></ul><p>Total: 2</p></div>';
  assertEquals(html, expected);
});

Deno.test("SSR Service - Render component with action creators", () => {
  const registry = getRegistry();
  registry["test-actions-ssr"] = {
    init: () => ({ count: 0 }),
    render: (state, props, actions) => {
      const count = (state as { count: number }).count;
      const actionCreators = actions as Record<string, unknown>;
      
      // Actions should be passed but are empty for static SSR
      const hasActions = typeof actionCreators === "object";
      
      return `<div>Count: ${count}, Has Actions: ${hasActions}</div>`;
    },
  };
  
  const html = renderComponent("test-actions-ssr");
  assertEquals(html, "<div>Count: 0, Has Actions: true</div>");
});

Deno.test("SSR Service - Props parsing with type conversion", () => {
  const registry = getRegistry();
  registry["test-type-conversion"] = {
    init: () => ({ base: 1 }),
    props: {
      numberProp: { attribute: "number", parse: (v) => Number(v) },
      booleanProp: { attribute: "boolean", parse: (v) => v === "true" || v === "" },
      stringProp: { attribute: "string", parse: (v) => String(v) },
    },
    render: (state, props, actions) => {
      const { numberProp, booleanProp, stringProp } = props as {
        numberProp: number;
        booleanProp: boolean;
        stringProp: string;
      };
      
      return `<div>Number: ${numberProp} (${typeof numberProp}), Boolean: ${booleanProp} (${typeof booleanProp}), String: ${stringProp} (${typeof stringProp})</div>`;
    },
  };
  
  const html = renderComponent("test-type-conversion", {
    number: "42",
    boolean: "true", 
    string: 123,
  });
  
  assertEquals(html, "<div>Number: 42 (number), Boolean: true (boolean), String: 123 (string)</div>");
});