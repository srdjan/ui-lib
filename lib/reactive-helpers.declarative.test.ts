import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std/assert/mod.ts";
import {
  bindClass,
  bindStyle,
  bindText,
  bindValue,
  combineBindings,
  createBoundElement,
  emitOn,
  hideIf,
  listenFor,
  showIf,
} from "./reactive-helpers.ts";

// Tests for the new declarative binding helper functions

Deno.test("bindText - generates text binding attribute", () => {
  const result = bindText("username");
  assertEquals(result, 'data-bind-text="username"');
});

Deno.test("bindClass - generates class binding attribute", () => {
  const result = bindClass("theme");
  assertEquals(result, 'data-bind-class="theme"');
});

Deno.test("bindStyle - generates style binding attribute", () => {
  const result = bindStyle("color", "primaryColor");
  assertEquals(result, 'data-bind-style="color:primaryColor"');
});

Deno.test("bindValue - generates value binding attribute", () => {
  const result = bindValue("email");
  assertEquals(result, 'data-bind-value="email"');
});

Deno.test("emitOn - generates emit binding with value", () => {
  const result = emitOn("save", '{"id": 123}');
  assertEquals(result, 'data-emit="save" data-emit-value="{"id": 123}"');
});

Deno.test("emitOn - generates emit binding without value", () => {
  const result = emitOn("save");
  assertEquals(result, 'data-emit="save"');
});

Deno.test("listenFor - generates listen binding attribute", () => {
  const result = listenFor("save", "handleSave()");
  assertEquals(result, 'data-listen="save:handleSave()"');
});

Deno.test("showIf - generates show-if binding attribute", () => {
  const result = showIf("isLoggedIn");
  assertEquals(result, 'data-show-if="isLoggedIn"');
});

Deno.test("hideIf - generates hide-if binding attribute", () => {
  const result = hideIf("isEmpty");
  assertEquals(result, 'data-hide-if="isEmpty"');
});

Deno.test("combineBindings - combines multiple binding strings", () => {
  const result = combineBindings(
    bindText("title"),
    bindClass("theme"),
    showIf("visible"),
  );

  assertStringIncludes(result, 'data-bind-text="title"');
  assertStringIncludes(result, 'data-bind-class="theme"');
  assertStringIncludes(result, 'data-show-if="visible"');
});

Deno.test("combineBindings - filters out empty bindings", () => {
  const result = combineBindings(
    bindText("title"),
    "", // empty binding
    bindClass("theme"),
    null as unknown as string, // null binding
    showIf("visible"),
  );

  assertEquals(
    result,
    'data-bind-text="title" data-bind-class="theme" data-show-if="visible"',
  );
});

Deno.test("createBoundElement - creates element with text binding", () => {
  const result = createBoundElement(
    "span",
    { text: "username" },
    "Default User",
  );

  assertEquals(result, '<span data-bind-text="username">Default User</span>');
});

Deno.test("createBoundElement - creates element with multiple bindings", () => {
  const result = createBoundElement(
    "div",
    {
      text: "title",
      class: "theme",
      showIf: "visible",
      attrs: { id: "main-title", role: "heading" },
    },
    "Page Title",
  );

  assertStringIncludes(result, 'id="main-title"');
  assertStringIncludes(result, 'role="heading"');
  assertStringIncludes(result, 'data-bind-text="title"');
  assertStringIncludes(result, 'data-bind-class="theme"');
  assertStringIncludes(result, 'data-show-if="visible"');
  assertStringIncludes(result, "Page Title");
  assertEquals(result.startsWith("<div"), true);
  assertEquals(result.endsWith("</div>"), true);
});

Deno.test("createBoundElement - creates self-closing element", () => {
  const result = createBoundElement(
    "input",
    {
      value: "email",
      attrs: { type: "email", placeholder: "Enter email" },
    },
  );

  assertStringIncludes(result, 'type="email"');
  assertStringIncludes(result, 'placeholder="Enter email"');
  assertStringIncludes(result, 'data-bind-value="email"');
  assertEquals(result.endsWith(" />"), true);
});

Deno.test("createBoundElement - creates button with emit binding", () => {
  const result = createBoundElement(
    "button",
    {
      emit: { event: "save", value: '{"form": "user"}' },
      hideIf: "isSaving",
      attrs: { type: "button", class: "primary-btn" },
    },
    "Save User",
  );

  assertStringIncludes(result, 'type="button"');
  assertStringIncludes(result, 'class="primary-btn"');
  assertStringIncludes(result, 'data-emit="save"');
  assertStringIncludes(result, 'data-emit-value="{"form": "user"}"');
  assertStringIncludes(result, 'data-hide-if="isSaving"');
  assertStringIncludes(result, "Save User");
});

Deno.test("createBoundElement - creates element with style binding", () => {
  const result = createBoundElement(
    "div",
    {
      style: { property: "backgroundColor", state: "bgColor" },
      attrs: { class: "themed-box" },
    },
    "Themed Content",
  );

  assertStringIncludes(result, 'class="themed-box"');
  assertStringIncludes(result, 'data-bind-style="backgroundColor:bgColor"');
  assertStringIncludes(result, "Themed Content");
});

Deno.test("createBoundElement - creates element with listen binding", () => {
  const result = createBoundElement(
    "div",
    {
      listen: { event: "user:login", handler: "showWelcome()" },
      attrs: { id: "notification-area" },
    },
    "Notifications will appear here",
  );

  assertStringIncludes(result, 'id="notification-area"');
  assertStringIncludes(result, 'data-listen="user:login:showWelcome()"');
  assertStringIncludes(result, "Notifications will appear here");
});

Deno.test("createBoundElement - handles empty bindings gracefully", () => {
  const result = createBoundElement(
    "div",
    {}, // no bindings
    "Plain content",
  );

  assertEquals(result, "<div>Plain content</div>");
});

Deno.test("createBoundElement - handles no content", () => {
  const result = createBoundElement(
    "br",
    { attrs: { class: "spacer" } },
  );

  assertEquals(result, '<br class="spacer" />');
});

Deno.test("createBoundElement - complex form example", () => {
  const result = createBoundElement(
    "form",
    {
      listen: { event: "submit", handler: "preventDefault(); handleSubmit()" },
      showIf: "showForm",
      attrs: { method: "post", action: "/api/users" },
    },
    `
      <input data-bind-value="name" placeholder="Name" required />
      <input data-bind-value="email" type="email" placeholder="Email" required />
      <button type="submit" data-emit="form:submit">Create User</button>
    `,
  );

  assertStringIncludes(result, 'method="post"');
  assertStringIncludes(result, 'action="/api/users"');
  assertStringIncludes(
    result,
    'data-listen="submit:preventDefault(); handleSubmit()"',
  );
  assertStringIncludes(result, 'data-show-if="showForm"');
  assertStringIncludes(result, 'data-bind-value="name"');
  assertStringIncludes(result, 'data-bind-value="email"');
  assertStringIncludes(result, 'data-emit="form:submit"');
});

Deno.test("Helper functions - special characters handling", () => {
  // Test that helper functions properly handle special characters
  const eventHandler = 'alert("Hello \\"World\\"!")';
  const result = listenFor("test", eventHandler);

  // The function doesn't escape quotes, it just concatenates the strings
  assertEquals(result, 'data-listen="test:alert("Hello \\"World\\"!")"');
});

Deno.test("Helper functions - empty string inputs", () => {
  // Test edge cases with empty strings
  assertEquals(bindText(""), 'data-bind-text=""');
  assertEquals(bindClass(""), 'data-bind-class=""');
  assertEquals(emitOn(""), 'data-emit=""');
  assertEquals(showIf(""), 'data-show-if=""');
});
