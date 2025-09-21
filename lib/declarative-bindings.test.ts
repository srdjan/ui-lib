import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std/assert/mod.ts";
import {
  extractBindingInfo,
  hasDeclarativeBindings,
  processDeclarativeBindings,
  validateBindings,
} from "./declarative-bindings.ts";

Deno.test("processDeclarativeBindings - text binding", () => {
  const html = '<span data-bind-text="username">Default</span>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, "data-binding-id=");
  assertStringIncludes(result, 'data-state-topic="username"');
  assertStringIncludes(result, 'hx-on="htmx:load:');
  assertStringIncludes(result, "this.textContent = data");
});

Deno.test("processDeclarativeBindings - class binding", () => {
  const html = '<div data-bind-class="theme">content</div>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, "data-binding-id=");
  assertStringIncludes(result, 'data-state-topic="theme"');
  assertStringIncludes(result, "this.className = data");
});

Deno.test("processDeclarativeBindings - style binding", () => {
  const html = '<div data-bind-style="color:primaryColor">content</div>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, "data-binding-id=");
  assertStringIncludes(result, 'data-state-topic="primaryColor"');
  assertStringIncludes(result, "this.style.color = data");
});

Deno.test("processDeclarativeBindings - value binding", () => {
  const html = '<input data-bind-value="email" type="email" />';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, "data-binding-id=");
  assertStringIncludes(result, 'data-state-topic="email"');
  assertStringIncludes(result, 'data-bind-value-target="email"');
  assertStringIncludes(result, "window.uiLibBindings?.initValueBinding");
});

Deno.test("processDeclarativeBindings - emit binding", () => {
  const html =
    '<button data-emit="save" data-emit-value=\'{"id": 123}\'>Save</button>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, "data-binding-id=");
  assertStringIncludes(result, 'onclick="document.dispatchEvent');
  assertStringIncludes(result, "ui-lib:save");
  assertStringIncludes(result, '{"id": 123}');
});

Deno.test("processDeclarativeBindings - emit binding without value", () => {
  const html = '<button data-emit="save">Save</button>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, 'onclick="document.dispatchEvent');
  assertStringIncludes(result, "ui-lib:save");
  assertStringIncludes(result, "{}"); // default empty object
});

Deno.test("processDeclarativeBindings - listen binding", () => {
  const html = '<div data-listen="save:handleSave()">Listener</div>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, "data-binding-id=");
  assertStringIncludes(result, "hx-on=");
  assertStringIncludes(result, "handleSave()");
});

Deno.test("processDeclarativeBindings - show-if binding", () => {
  const html = '<div data-show-if="isLoggedIn">Welcome!</div>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, "data-binding-id=");
  assertStringIncludes(result, 'data-state-topic="isLoggedIn"');
  assertStringIncludes(result, "this.style.display = data ? '' : 'none'");
});

Deno.test("processDeclarativeBindings - hide-if binding", () => {
  const html = '<div data-hide-if="isEmpty">Content here</div>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, "data-binding-id=");
  assertStringIncludes(result, 'data-state-topic="isEmpty"');
  assertStringIncludes(result, "this.style.display = data ? 'none' : ''");
});

Deno.test("processDeclarativeBindings - multiple bindings", () => {
  const html =
    '<div data-bind-text="title" data-bind-class="theme" data-show-if="visible">Content</div>';
  const result = processDeclarativeBindings(html, "test-component");

  // Should have multiple binding IDs
  const bindingMatches = result.match(/data-binding-id="/g);
  assertEquals(bindingMatches?.length, 3);

  // Should contain all three types of bindings
  assertStringIncludes(result, "this.textContent = data");
  assertStringIncludes(result, "this.className = data");
  assertStringIncludes(result, "this.style.display = data ? '' : 'none'");
});

Deno.test("processDeclarativeBindings - no bindings", () => {
  const html = '<div class="regular">No bindings here</div>';
  const result = processDeclarativeBindings(html, "test-component");

  assertEquals(result, html); // Should be unchanged
});

Deno.test("hasDeclarativeBindings - detection", () => {
  assertEquals(
    hasDeclarativeBindings('<div data-bind-text="test">Hi</div>'),
    true,
  );
  assertEquals(
    hasDeclarativeBindings('<div data-emit="save">Save</div>'),
    true,
  );
  assertEquals(
    hasDeclarativeBindings('<div data-listen="load:init()">Listen</div>'),
    true,
  );
  assertEquals(
    hasDeclarativeBindings('<div data-show-if="visible">Show</div>'),
    true,
  );
  assertEquals(
    hasDeclarativeBindings('<div data-hide-if="hidden">Hide</div>'),
    true,
  );
  assertEquals(
    hasDeclarativeBindings('<div class="regular">No bindings</div>'),
    false,
  );
});

Deno.test("extractBindingInfo - binding extraction", () => {
  const html = `
    <div data-binding-id="bind-test-text-123" data-state-topic="username">John</div>
    <input data-binding-id="bind-test-value-456" data-state-topic="email" />
  `;

  const bindings = extractBindingInfo(html);
  assertEquals(bindings.length, 2);

  assertEquals(bindings[0].id, "bind-test-text-123");
  assertEquals(bindings[0].type, "text");
  assertEquals(bindings[0].target, "username");

  assertEquals(bindings[1].id, "bind-test-value-456");
  assertEquals(bindings[1].type, "value");
  assertEquals(bindings[1].target, "email");
});

Deno.test("validateBindings - validation warnings", () => {
  // Valid bindings should have no warnings
  const validHtml =
    '<div data-bind-text="username" data-bind-style="color:theme">Content</div>';
  assertEquals(validateBindings(validHtml), []);

  // Invalid style binding format
  const invalidStyleHtml = '<div data-bind-style="invalidformat">Content</div>';
  const styleWarnings = validateBindings(invalidStyleHtml);
  assertEquals(styleWarnings.length, 1);
  assertStringIncludes(styleWarnings[0], "property:stateName");

  // Invalid listen binding format
  const invalidListenHtml = '<div data-listen="invalidformat">Content</div>';
  const listenWarnings = validateBindings(invalidListenHtml);
  assertEquals(listenWarnings.length, 1);
  assertStringIncludes(listenWarnings[0], "eventName:handlerCode");

  // Empty binding targets
  const emptyBindingHtml = '<div data-bind-text="">Content</div>';
  const emptyWarnings = validateBindings(emptyBindingHtml);
  assertEquals(emptyWarnings.length, 1);
  assertStringIncludes(emptyWarnings[0], "Empty binding targets");
});

Deno.test("processDeclarativeBindings - binding ID generation", () => {
  const html = '<span data-bind-text="username">User</span>';
  const result1 = processDeclarativeBindings(html, "component1");
  const result2 = processDeclarativeBindings(html, "component2");

  // Different components should generate different binding IDs
  const id1 = result1.match(/data-binding-id="([^"]+)"/)?.[1];
  const id2 = result2.match(/data-binding-id="([^"]+)"/)?.[1];

  assertEquals(id1?.includes("component1"), true);
  assertEquals(id2?.includes("component2"), true);
  assertEquals(id1 === id2, false);
});

Deno.test("processDeclarativeBindings - special characters in handlers", () => {
  const html =
    '<div data-listen="save:alert(\\"Hello World!\\")">Content</div>';
  const result = processDeclarativeBindings(html, "test-component");

  // Should properly escape quotes in handlers via listensFor function
  assertStringIncludes(result, 'hx-on="ui-lib:save:');
  assertStringIncludes(result, "alert");
});

Deno.test("processDeclarativeBindings - complex event values", () => {
  const html =
    '<button data-emit="update" data-emit-value=\'{"user": {"id": 123, "name": "John"}}\'>Update</button>';
  const result = processDeclarativeBindings(html, "test-component");

  assertStringIncludes(result, '{"user": {"id": 123, "name": "John"}}');
  assertStringIncludes(result, "ui-lib:update");
});

Deno.test("processDeclarativeBindings - edge cases", () => {
  // Empty HTML
  assertEquals(processDeclarativeBindings("", "test"), "");

  // Self-closing tags
  const selfClosing = '<input data-bind-value="test" />';
  const result = processDeclarativeBindings(selfClosing, "test");
  assertStringIncludes(result, 'data-bind-value-target="test"');

  // Multiple spaces in attributes
  const multiSpace = '<div   data-bind-text="test"   >Content</div>';
  const result2 = processDeclarativeBindings(multiSpace, "test");
  assertStringIncludes(result2, 'data-state-topic="test"');
});
