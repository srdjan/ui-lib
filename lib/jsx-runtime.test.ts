// Tests for JSX runtime with type-safe event handlers

import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  clearRenderContext,
  Fragment,
  h,
  setRenderContext,
} from "./jsx-runtime.ts";
import { chain, toggleClass, toggleClasses } from "./dom-helpers.ts";

Deno.test("h function renders basic elements", () => {
  const result = h("div", { class: "container" }, "Hello World");
  assertEquals(result, '<div class="container">Hello World</div>');
});

Deno.test("h function handles self-closing tags", () => {
  const result = h("input", { type: "text", value: "test" });
  assertEquals(result, '<input type="text" value="test">');
});

Deno.test("h function handles boolean attributes", () => {
  const result = h("input", {
    type: "checkbox",
    checked: true,
    disabled: false,
  });
  assertEquals(result, '<input type="checkbox" checked>');
});

Deno.test("h function handles ComponentAction objects in event handlers", () => {
  const action = toggleClass("active");
  const result = h("button", { onClick: action }, "Click me");
  assertEquals(
    result,
    "<button onclick=\"this.classList.toggle('active')\">Click me</button>",
  );
});

Deno.test("h function handles multiple ComponentAction objects", () => {
  const action = toggleClasses(["light", "dark"]);
  const result = h("button", { onClick: action }, "Toggle");
  assertEquals(
    result,
    "<button onclick=\"this.classList.toggle('light');this.classList.toggle('dark')\">Toggle</button>",
  );
});

Deno.test("h function handles string event handlers", () => {
  const result = h("button", { onClick: "alert('clicked')" }, "Click");
  assertEquals(result, "<button onclick=\"alert('clicked')\">Click</button>");
});

Deno.test("h function composes actions with chain", () => {
  const action = chain(toggleClass("a"), toggleClass("b"));
  const result = h("button", { onClick: action }, "Do");
  assertEquals(
    result,
    "<button onclick=\"this.classList.toggle('a');this.classList.toggle('b')\">Do</button>",
  );
});

Deno.test("h function handles nested children", () => {
  const result = h(
    "div",
    null,
    h("h1", null, "Title"),
    h("p", null, "Paragraph"),
  );
  assertEquals(result, "<div><h1>Title</h1><p>Paragraph</p></div>");
});

Deno.test("h function escapes plain text content", () => {
  const result = h("div", null, "Tom & Jerry");
  assertEquals(result, "<div>Tom &amp; Jerry</div>");
});

Deno.test("h function handles HTML-like text content safely", () => {
  const result = h("div", null, "Use <em>tags</em> wisely");
  assertEquals(result, "<div>Use &lt;em&gt;tags&lt;/em&gt; wisely</div>");
});

Deno.test("h function handles null and undefined children", () => {
  const result = h("div", null, "Hello", null, undefined, false, "World");
  assertEquals(result, "<div>HelloWorld</div>");
});

Deno.test("Fragment component joins children", () => {
  const result = Fragment({ children: ["Hello", " ", "World"] });
  assertEquals(result, "Hello World");
});

Deno.test("h function handles arrays of children", () => {
  const items = ["apple", "banana", "cherry"];
  const result = h("ul", null, items.map((item) => h("li", null, item)));
  assertEquals(result, "<ul><li>apple</li><li>banana</li><li>cherry</li></ul>");
});

Deno.test("h function preserves explicit <script> children strings", () => {
  const script = "<script>window.__x=1;</script>";
  const result = h("div", null, script);
  assertEquals(result, "<div><script>window.__x=1;</script></div>");
});

Deno.test("h function handles function components", () => {
  const MyComponent = (props: { name: string; children?: unknown[] }) => {
    return h(
      "div",
      { class: "my-component" },
      `Hello ${props.name}`,
      props.children,
    );
  };

  const result = h(MyComponent, { name: "World" }, h("p", null, "Content"));
  assertEquals(
    result,
    '<div class="my-component">Hello World<p>Content</p></div>',
  );
});

Deno.test("h function lowercases event attribute names", () => {
  const res1 = h("div", { onMouseDown: "doit()" }, "A");
  assertEquals(res1, '<div onmousedown="doit()">A</div>');

  const res2 = h("input", { onInput: 'console.log("X")' });
  // Double quotes escaped to &quot;
  assertEquals(res2, '<input oninput="console.log(&quot;X&quot;)">');

  const res3 = h("button", { onChange: "update()" }, "Ok");
  assertEquals(res3, '<button onchange="update()">Ok</button>');
});

Deno.test("action DSL converts to HTMX attributes", () => {
  const apiMap = {
    increment: () => 'hx-post="/api/counter/increment" hx-vals="{}"',
  };

  setRenderContext({ apiMap, componentId: "counter:test" });
  const markup = h(
    "button",
    { action: "increment('counter-1')", target: "role:count" },
    "+",
  );
  clearRenderContext();

  assertStringIncludes(markup, 'hx-post="/api/counter/increment"');
  assertStringIncludes(markup, 'hx-target="[data-role=&quot;count&quot;]"');
  assertStringIncludes(
    markup,
    'hx-vals="{&quot;args&quot;:[&quot;counter-1&quot;]}"',
  );
  assertEquals(markup.includes("action="), false);
  assertEquals(markup.includes(' target="role:count"'), false);
});
