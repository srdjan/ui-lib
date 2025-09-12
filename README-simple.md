# ui-lib Simplified 🚀

A **dramatically simplified** version of ui-lib that maintains the core benefits while removing complexity.

## What's Different?

| Original ui-lib | Simplified ui-lib |
|-----------------|-------------------|
| 80+ files | ~6 files |
| Complex registry system | Direct JSX functions |
| Elaborate prop helpers | Simple TypeScript props |
| Complex state manager | DOM-based state |
| 50+ components | 5 essential components |
| CSS-in-TS with collision detection | Simple inline styles |
| ~5000 lines | ~500 lines |

## Quick Start

```tsx
import { Button, Card, Container, renderToString } from "./mod-simple.ts";

function MyPage() {
  return (
    <Container>
      <Card title="Hello World">
        <Button variant="primary" onClick="alert('Hello!')">
          Click me!
        </Button>
      </Card>
    </Container>
  );
}

// Render to HTML string
const html = renderToString(<MyPage />);
```

## Core Philosophy

- **Direct JSX components** - No registry, no defineComponent, just functions
- **Simple state management** - DOM attributes + events, no pub/sub complexity  
- **Essential components only** - Button, Input, Card, Alert, Container
- **Inline styles** - No class generation, no collision detection needed
- **Minimal overhead** - Keep it under 500 lines total

## Components

### Button
```tsx
<Button variant="primary" size="lg" onClick="handleClick()">
  Click me
</Button>
```

### Input
```tsx
<Input 
  type="email" 
  placeholder="Enter email" 
  dataBind="userEmail" 
/>
```

### Card
```tsx
<Card title="My Card" padding={true}>
  Card content goes here
</Card>
```

### Alert
```tsx
<Alert variant="success" dismissible={true}>
  Success message
</Alert>
```

### Container
```tsx
<Container size="lg">
  Page content
</Container>
```

## State Management

No complex pub/sub system needed. Just simple DOM-based state:

```tsx
import { state } from "./mod-simple.ts";

// Set state
state.set('count', 42);

// Get state
const count = state.get('count');

// Subscribe to changes
state.subscribe('count', (value) => {
  console.log('Count:', value);
});

// Two-way binding
<Input dataBind="userName" />
<span data-text-bind="userName">Name appears here</span>
```

## Running the Demo

```bash
# Run simplified showcase
deno task serve:simple

# Visit http://localhost:8081
```

## File Structure

```
lib/
├── simple.tsx          # Core JSX runtime + state management (~200 lines)
├── components-simple.tsx   # Essential components (~300 lines)
mod-simple.ts           # Public API exports (~20 lines)
examples/
└── showcase-simple/    # Demo server (~200 lines)
```

## Benefits Maintained

✅ **SSR-first** - Components render to HTML strings  
✅ **Type-safe** - Full TypeScript support with JSX  
✅ **DOM-native state** - State lives in DOM, not JS memory  
✅ **Zero hydration** - State is already in the HTML  
✅ **Fast rendering** - Simple string concatenation  

## Complexity Removed

❌ No registry system or component registration  
❌ No complex prop helpers or validation  
❌ No CSS-in-TS with class collision detection  
❌ No elaborate state manager with pub/sub  
❌ No enterprise component features  
❌ No deep abstraction layers  

## Migration from Original

Replace:
```tsx
// Old way
defineComponent("my-button", {
  props: (attrs) => ({
    text: attrs.text,
    variant: attrs.variant || "primary"
  }),
  styles: { /* complex CSS-in-TS */ },
  render: (props) => /* ... */
});
```

With:
```tsx
// New way
export function MyButton({ 
  text, 
  variant = "primary" 
}: { 
  text: string; 
  variant?: string; 
}) {
  return (
    <button className={`btn btn-${variant}`}>
      {text}
      <style>{`
        .btn { /* simple CSS */ }
      `}</style>
    </button>
  );
}
```

This simplified approach reduces complexity by **90%** while keeping the core benefits that make ui-lib special.