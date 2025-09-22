# Migration Guide: Traditional to Token-Based Components

This guide helps you migrate from ui-lib's traditional component system to the new token-based approach. The token system provides better encapsulation, type safety, and prevents style conflicts.

## Overview

### Why Migrate?

| Traditional Components | Token-Based Components |
|----------------------|----------------------|
| Direct style access | CSS variables only |
| Potential style conflicts | Complete isolation |
| CSS-in-TS complexity | Simple token interface |
| Runtime style generation | Instant CSS variable updates |
| Internal access possible | Completely sealed |

### Migration Strategy

1. **Incremental**: Migrate components one by one
2. **Parallel**: Both systems can coexist during transition
3. **Backwards Compatible**: Existing components continue working
4. **Type-Safe**: Full TypeScript support in new system

## API Differences

### Import Changes

```typescript
// Before (Traditional)
import { defineComponent, css, composeStyles } from "ui-lib/mod.ts";

// After (Token-Based)
import { Button, defineTokens, applyTheme } from "ui-lib/mod-token.ts";
```

### Component Definition

#### Before: Traditional defineComponent

```typescript
import { defineComponent, css, h } from "ui-lib/mod.ts";

defineComponent("my-button", {
  styles: css({
    button: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      border: "none",
      cursor: "pointer",

      "&:hover": {
        backgroundColor: "#0056b3",
      },

      "&:disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
      }
    }
  }),

  render: (props) => (
    <button className="button" disabled={props.disabled}>
      {props.children}
    </button>
  )
});

// Usage
const button = <my-button disabled>Click me</my-button>;
```

#### After: Token-Based Component

```typescript
import { createTokenComponent } from "ui-lib/lib/tokens/component-factory.ts";

// 1. Define token contract
type MyButtonTokens = {
  base: {
    background: string;
    backgroundHover: string;
    textColor: string;
    padding: string;
    borderRadius: string;
    cursor: string;
  };
  disabled: {
    opacity: string;
    cursor: string;
  };
};

// 2. Create sealed component
const MyButton = createTokenComponent<MyButtonTokens, { disabled?: boolean; children: string }>({
  name: "my-button",

  tokens: {
    base: {
      background: "#007bff",
      backgroundHover: "#0056b3",
      textColor: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      cursor: "pointer",
    },
    disabled: {
      opacity: "0.6",
      cursor: "not-allowed",
    }
  },

  styles: (cssVars) => `
    .ui-my-button {
      background-color: ${cssVars.base.background};
      color: ${cssVars.base.textColor};
      padding: ${cssVars.base.padding};
      border-radius: ${cssVars.base.borderRadius};
      border: none;
      cursor: ${cssVars.base.cursor};
      transition: background-color 150ms ease;
    }

    .ui-my-button:hover:not(:disabled) {
      background-color: ${cssVars.base.backgroundHover};
    }

    .ui-my-button:disabled {
      opacity: ${cssVars.disabled.opacity};
      cursor: ${cssVars.disabled.cursor};
    }
  `,

  render: (props) => {
    const classes = ["ui-my-button"];
    const attributes: Record<string, string> = { class: classes.join(" ") };

    if (props.disabled) {
      attributes.disabled = "true";
    }

    const attrs = Object.entries(attributes)
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ");

    return `<button ${attrs}>${props.children}</button>`;
  }
});

// Usage (same interface)
const button = MyButton({ disabled: true, children: "Click me" });
```

### Customization Changes

#### Before: Direct Style Manipulation

```typescript
// CSS-in-TS customization
const customStyles = css({
  button: {
    backgroundColor: "#28a745", // Direct property access
    "&:hover": {
      backgroundColor: "#218838",
    }
  }
});

const styledButton = composeStyles(baseStyles, customStyles);
```

#### After: Token-Based Customization

```typescript
// Token-based customization
const customStyles = defineTokens({
  "my-button": {
    base: {
      background: "#28a745",    // CSS variable only
      backgroundHover: "#218838",
    }
  }
});

// Or scoped customization
const scopedStyles = customizeComponent(".success-section", "my-button", {
  base: {
    background: "#28a745",
    backgroundHover: "#218838",
  }
});
```

## Step-by-Step Migration

### Step 1: Analyze Current Component

Before migrating, understand your component's customizable properties:

```typescript
// Identify what needs to be tokenized
defineComponent("card", {
  styles: css({
    card: {
      // These become tokens ↓
      backgroundColor: "white",      // → base.background
      borderRadius: "8px",           // → base.borderRadius
      padding: "1rem",               // → base.padding
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // → base.shadow

      "&:hover": {
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)", // → hover.shadow
      }
    }
  })
});
```

### Step 2: Define Token Contract

Create a TypeScript interface for your tokens:

```typescript
type CardTokens = {
  base: {
    background: string;
    borderRadius: string;
    padding: string;
    shadow: string;
  };
  hover: {
    shadow: string;
  };
};
```

### Step 3: Create Token Defaults

Define default values for all tokens:

```typescript
const defaultCardTokens: CardTokens = {
  base: {
    background: "white",
    borderRadius: "8px",
    padding: "1rem",
    shadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  hover: {
    shadow: "0 4px 8px rgba(0,0,0,0.15)",
  }
};
```

### Step 4: Convert Styles to Use CSS Variables

```typescript
// Convert CSS-in-TS to CSS variables
styles: (cssVars) => `
  .ui-card {
    background-color: ${cssVars.base.background};
    border-radius: ${cssVars.base.borderRadius};
    padding: ${cssVars.base.padding};
    box-shadow: ${cssVars.base.shadow};
    transition: box-shadow 150ms ease;
  }

  .ui-card:hover {
    box-shadow: ${cssVars.hover.shadow};
  }
`
```

### Step 5: Update Render Function

```typescript
render: (props, _cssVars) => {
  const classes = ["ui-card"];

  if (props.elevated) classes.push("ui-card--elevated");

  return `
    <div class="${classes.join(" ")}">
      ${props.children || ""}
    </div>
  `;
}
```

### Step 6: Create the Component

```typescript
export const Card = createTokenComponent<CardTokens, CardProps>({
  name: "card",
  tokens: defaultCardTokens,
  styles,
  render,
});
```

### Step 7: Update Usage

```typescript
// Before
const card = <card elevated>{content}</card>;

// After
const card = Card({ elevated: true, children: content });
```

## Common Migration Patterns

### 1. Variant Props to Token Sections

#### Before

```typescript
defineComponent("button", {
  render: ({ variant = "primary" }) => (
    <button className={`btn btn--${variant}`}>
      {/* content */}
    </button>
  )
});
```

#### After

```typescript
type ButtonTokens = {
  primary: { background: string; textColor: string; };
  secondary: { background: string; textColor: string; };
  // ... other variants
};

const Button = createTokenComponent<ButtonTokens, ButtonProps>({
  // Token sections match variants
  tokens: {
    primary: { background: "#007bff", textColor: "white" },
    secondary: { background: "#6c757d", textColor: "white" },
  },

  styles: (cssVars) => `
    .ui-button--primary {
      background: ${cssVars.primary.background};
      color: ${cssVars.primary.textColor};
    }
    .ui-button--secondary {
      background: ${cssVars.secondary.background};
      color: ${cssVars.secondary.textColor};
    }
  `
});
```

### 2. Size Props to Token Sections

#### Before

```typescript
const sizeStyles = {
  sm: { height: "32px", fontSize: "14px" },
  md: { height: "40px", fontSize: "16px" },
  lg: { height: "48px", fontSize: "18px" },
};
```

#### After

```typescript
type ButtonTokens = {
  sizeSm: { height: string; fontSize: string; };
  sizeMd: { height: string; fontSize: string; };
  sizeLg: { height: string; fontSize: string; };
};

tokens: {
  sizeSm: { height: "32px", fontSize: "14px" },
  sizeMd: { height: "40px", fontSize: "16px" },
  sizeLg: { height: "48px", fontSize: "18px" },
}
```

### 3. State-Based Styles to Token Sections

#### Before

```typescript
styles: css({
  input: {
    borderColor: "#ccc",
    "&:focus": { borderColor: "#007bff" },
    "&.error": { borderColor: "#dc3545" },
    "&:disabled": { opacity: 0.6 },
  }
})
```

#### After

```typescript
type InputTokens = {
  default: { borderColor: string; };
  focus: { borderColor: string; };
  error: { borderColor: string; };
  disabled: { opacity: string; };
};

tokens: {
  default: { borderColor: "#ccc" },
  focus: { borderColor: "#007bff" },
  error: { borderColor: "#dc3545" },
  disabled: { opacity: "0.6" },
}
```

## Migrating Built-in Components

### Button Migration

```typescript
// Before
import { Button } from "ui-lib/lib/components/button/button.ts";

// After
import { Button } from "ui-lib/mod-token.ts";

// Customization before
const customButton = composeStyles(Button.styles, myStyles);

// Customization after
const customStyles = defineTokens({
  button: {
    primary: { background: "#custom-color" }
  }
});
```

### Form Components

```typescript
// Before
import { Input, Select, Textarea } from "ui-lib/components";

// After (when available)
import { Input, Select, Textarea } from "ui-lib/mod-token.ts";

// Theme all form components
const formTheme = defineTokens({
  input: { default: { borderColor: "#custom" } },
  select: { default: { borderColor: "#custom" } },
  textarea: { default: { borderColor: "#custom" } },
});
```

## Testing Token Components

### Unit Tests

```typescript
import { assertEquals, assertStringIncludes } from "std/assert/mod.ts";
import { Button } from "./token-button.ts";

Deno.test("Button renders with default tokens", () => {
  const html = Button({ children: "Test" });
  assertStringIncludes(html, "ui-button");
  assertStringIncludes(html, "Test");
});

Deno.test("Button exposes token contract", () => {
  assertEquals(typeof Button.tokenContract, "object");
  assertEquals(typeof Button.cssVarDefinitions, "string");
});

Deno.test("Button is sealed", () => {
  // No access to internals
  assertEquals((Button as any).css, undefined);
  assertEquals((Button as any).styles, undefined);
});
```

### Integration Tests

```typescript
Deno.test("Token customization works", () => {
  const customTokens = defineTokens({
    button: {
      primary: { background: "#custom-red" }
    }
  });

  assertStringIncludes(customTokens, "--button-primary-background: #custom-red");
});
```

## Troubleshooting

### Common Issues

#### 1. TypeScript Errors

```typescript
// Error: Token structure mismatch
❌ tokens: { primary: "#blue" }  // Wrong: not a token set

✅ tokens: { primary: { background: "#blue" } }  // Correct: token set
```

#### 2. CSS Variable Not Applying

```typescript
// Ensure styles are included before components
const styles = Button.injectStyles();
const html = `
  <style>${styles}</style>
  ${Button({ children: "Test" })}
`;
```

#### 3. Token Override Not Working

```typescript
// Check CSS specificity and ordering
const overrides = defineTokens({
  button: {
    primary: { background: "#new-color" }
  }
});

// Ensure overrides come after default styles
```

### Debug Mode

```typescript
// Enable debug logging
if (import.meta.env.DEV) {
  console.log("Token contract:", Button.tokenContract);
  console.log("CSS variables:", Button.cssVarDefinitions);
}
```

## Migration Checklist

- [ ] **Analyze current component**: Identify customizable properties
- [ ] **Define token contract**: Create TypeScript interface
- [ ] **Set default tokens**: Define all token default values
- [ ] **Convert styles**: Replace CSS-in-TS with CSS variables
- [ ] **Update render function**: Use new component class patterns
- [ ] **Create sealed component**: Use `createTokenComponent`
- [ ] **Update imports**: Switch to token-based imports
- [ ] **Test component**: Ensure functionality works
- [ ] **Test customization**: Verify token overrides work
- [ ] **Update documentation**: Document available tokens

## Best Practices

### 1. Token Naming

```typescript
// ✅ Good: Semantic names
type Tokens = {
  primary: { background: string };
  secondary: { background: string };
  disabled: { opacity: string };
};

// ❌ Avoid: Implementation details
type Tokens = {
  blue: { background: string };
  gray: { background: string };
};
```

### 2. Token Granularity

```typescript
// ✅ Good: Appropriately granular
type Tokens = {
  base: { padding: string; borderRadius: string };
  primary: { background: string; textColor: string };
};

// ❌ Too granular
type Tokens = {
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
};
```

### 3. Progressive Migration

1. Start with leaf components (no dependencies)
2. Move to container components
3. Update application-level components last
4. Test thoroughly at each step

The token-based system provides a more maintainable and predictable way to customize components while ensuring complete encapsulation of implementation details.