import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { 
  Layout, 
  Grid, 
  Card, 
  ButtonGroup, 
  Navigation, 
  Form 
} from "./composition.ts";

Deno.test("Layout component generates correct HTML structure", () => {
  const result = Layout({
    direction: "horizontal",
    align: "center",
    justify: "between",
    gap: "1rem",
    children: ["Item 1", "Item 2"],
  });

  assertStringIncludes(result, "<div");
  assertStringIncludes(result, "Item 1");
  assertStringIncludes(result, "Item 2");
  assertStringIncludes(result, "</div>");
});

Deno.test("Layout component handles vertical direction", () => {
  const result = Layout({
    direction: "vertical",
    gap: "2rem",
    children: ["Top", "Bottom"],
  });

  assertStringIncludes(result, "Top");
  assertStringIncludes(result, "Bottom");
});

Deno.test("Layout component applies custom className", () => {
  const result = Layout({
    className: "custom-layout",
    children: ["Content"],
  });

  assertStringIncludes(result, "custom-layout");
});

Deno.test("Grid component generates correct HTML structure", () => {
  const result = Grid({
    columns: 3,
    gap: "1rem",
    children: ["Cell 1", "Cell 2", "Cell 3"],
  });

  assertStringIncludes(result, "<div");
  assertStringIncludes(result, "Cell 1");
  assertStringIncludes(result, "Cell 2");
  assertStringIncludes(result, "Cell 3");
  assertStringIncludes(result, "</div>");
});

Deno.test("Grid component handles string columns template", () => {
  const result = Grid({
    columns: "1fr 2fr 1fr",
    children: ["A", "B", "C"],
  });

  assertStringIncludes(result, "A");
  assertStringIncludes(result, "B");
  assertStringIncludes(result, "C");
});

Deno.test("Grid component includes grid template areas", () => {
  const result = Grid({
    columns: 2,
    areas: '"header header" "sidebar content"',
    children: ["Header", "Sidebar", "Content"],
  });

  assertStringIncludes(result, "Header");
  assertStringIncludes(result, "Sidebar");
  assertStringIncludes(result, "Content");
});

Deno.test("Card component generates basic card", () => {
  const result = Card({
    children: ["Card content"],
  });

  assertStringIncludes(result, "<div");
  assertStringIncludes(result, "Card content");
  assertStringIncludes(result, "</div>");
});

Deno.test("Card component includes header and footer", () => {
  const result = Card({
    header: "Card Title",
    footer: "Card Footer",
    children: ["Main content"],
  });

  assertStringIncludes(result, "Card Title");
  assertStringIncludes(result, "Main content");
  assertStringIncludes(result, "Card Footer");
});

Deno.test("Card component applies different variants", () => {
  const elevated = Card({ variant: "elevated", children: ["Test"] });
  const outlined = Card({ variant: "outlined", children: ["Test"] });
  const filled = Card({ variant: "filled", children: ["Test"] });

  // All should contain the content
  assertStringIncludes(elevated, "Test");
  assertStringIncludes(outlined, "Test");
  assertStringIncludes(filled, "Test");
});

Deno.test("ButtonGroup component generates correct structure", () => {
  const result = ButtonGroup({
    variant: "attached",
    children: ["Button 1", "Button 2"],
  });

  assertStringIncludes(result, '<div');
  assertStringIncludes(result, 'role="group"');
  assertStringIncludes(result, 'aria-label="Button group"');
  assertStringIncludes(result, "Button 1");
  assertStringIncludes(result, "Button 2");
});

Deno.test("ButtonGroup handles different variants", () => {
  const attached = ButtonGroup({ 
    variant: "attached", 
    children: ["A", "B"] 
  });
  const spaced = ButtonGroup({ 
    variant: "spaced", 
    children: ["A", "B"] 
  });

  assertStringIncludes(attached, "A");
  assertStringIncludes(attached, "B");
  assertStringIncludes(spaced, "A");
  assertStringIncludes(spaced, "B");
});

Deno.test("Navigation component generates nav structure", () => {
  const result = Navigation({
    items: [
      { label: "Home", href: "/home" },
      { label: "About", href: "/about", active: true },
      { label: "Contact", href: "/contact", badge: "2" },
    ],
    variant: "tabs",
  });

  assertStringIncludes(result, '<nav');
  assertStringIncludes(result, 'role="navigation"');
  assertStringIncludes(result, "Home");
  assertStringIncludes(result, "About");
  assertStringIncludes(result, "Contact");
  assertStringIncludes(result, 'data-active');
  assertStringIncludes(result, "2");
});

Deno.test("Navigation handles different variants", () => {
  const items = [{ label: "Test", href: "/test" }];
  
  const tabs = Navigation({ items, variant: "tabs" });
  const pills = Navigation({ items, variant: "pills" });
  const breadcrumbs = Navigation({ items, variant: "breadcrumbs" });
  const sidebar = Navigation({ items, variant: "sidebar" });

  [tabs, pills, breadcrumbs, sidebar].forEach(nav => {
    assertStringIncludes(nav, "Test");
    assertStringIncludes(nav, '<nav');
  });
});

Deno.test("Navigation handles disabled items", () => {
  const result = Navigation({
    items: [
      { label: "Enabled", href: "/enabled" },
      { label: "Disabled", href: "/disabled", disabled: true },
    ],
  });

  assertStringIncludes(result, "Enabled");
  assertStringIncludes(result, "Disabled");
  assertStringIncludes(result, 'data-disabled');
});

Deno.test("Form component generates form structure", () => {
  const result = Form({
    fields: [
      { type: "text", name: "username", label: "Username", required: true },
      { type: "email", name: "email", label: "Email" },
    ],
    action: "/submit",
    method: "POST",
  });

  assertStringIncludes(result, "<form");
  assertStringIncludes(result, 'action="/submit"');
  assertStringIncludes(result, 'method="POST"');
  assertStringIncludes(result, "Username");
  assertStringIncludes(result, "Email");
  assertStringIncludes(result, 'type="text"');
  assertStringIncludes(result, 'type="email"');
  assertStringIncludes(result, "required");
});

Deno.test("Form handles different field types", () => {
  const result = Form({
    fields: [
      { type: "textarea", name: "bio", label: "Bio" },
      { 
        type: "select", 
        name: "role", 
        label: "Role", 
        options: [
          { value: "admin", label: "Admin" },
          { value: "user", label: "User" },
        ]
      },
      { type: "checkbox", name: "agree", label: "I agree", checked: true },
    ],
  });

  assertStringIncludes(result, "<textarea");
  assertStringIncludes(result, "<select");
  assertStringIncludes(result, "<option");
  assertStringIncludes(result, "Admin");
  assertStringIncludes(result, "User");
  assertStringIncludes(result, 'type="checkbox"');
  assertStringIncludes(result, "I agree");
  assertStringIncludes(result, "checked");
});

Deno.test("Form includes submit and reset buttons", () => {
  const result = Form({
    fields: [{ type: "text", name: "test", label: "Test" }],
    submitText: "Save Changes",
    resetText: "Clear All",
  });

  assertStringIncludes(result, 'type="submit"');
  assertStringIncludes(result, 'type="reset"');
  assertStringIncludes(result, "Save Changes");
  assertStringIncludes(result, "Clear All");
});

Deno.test("Form handles field attributes correctly", () => {
  const result = Form({
    fields: [
      { 
        type: "text", 
        name: "test", 
        label: "Test Field",
        placeholder: "Enter text",
        required: true,
        disabled: false,
        value: "default value"
      },
    ],
  });

  assertStringIncludes(result, 'name="test"');
  assertStringIncludes(result, 'placeholder="Enter text"');
  assertStringIncludes(result, "required");
  assertStringIncludes(result, 'value="default value"');
});

Deno.test("Layout component handles wrap option", () => {
  const result = Layout({
    wrap: true,
    children: ["Item 1", "Item 2", "Item 3"],
  });

  assertStringIncludes(result, "Item 1");
  assertStringIncludes(result, "Item 2");
  assertStringIncludes(result, "Item 3");
});

Deno.test("Components handle empty children arrays", () => {
  const layout = Layout({ children: [] });
  const grid = Grid({ children: [] });
  const card = Card({ children: [] });
  const buttonGroup = ButtonGroup({ children: [] });

  [layout, grid, card, buttonGroup].forEach(component => {
    assertStringIncludes(component, "<div");
    assertStringIncludes(component, "</div>");
  });
});

Deno.test("Navigation handles items with onClick instead of href", () => {
  const result = Navigation({
    items: [
      { label: "Button Item", onClick: "handleClick()" },
      { label: "Link Item", href: "/link" },
    ],
  });

  assertStringIncludes(result, "<button");
  assertStringIncludes(result, 'onclick="handleClick()"');
  assertStringIncludes(result, "<a");
  assertStringIncludes(result, 'href="/link"');
  assertStringIncludes(result, "Button Item");
  assertStringIncludes(result, "Link Item");
});