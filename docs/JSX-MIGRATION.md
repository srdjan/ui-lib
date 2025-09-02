# ✨ funcwc JSX Guide

## Overview

funcwc uses **native JSX syntax** with full TypeScript integration, providing a modern developer experience with zero runtime overhead. Components render directly to HTML strings with complete type safety and IDE support.

## 🎯 JSX Syntax

funcwc components use clean, familiar JSX syntax with proper TypeScript types:

```tsx
<demo-counter
  initial-count={5}    // number type
  step={2}             // number type
  max-value={20}       // number type
  label="Counter"      // string type
  disabled={false}     // boolean type
/>
```

## ✨ JSX Benefits

- **🛡️ Type Safety**: Full TypeScript integration with compile-time prop validation
- **💡 IDE Support**: Complete autocompletion, error highlighting, and go-to-definition
- **🔧 Familiar Syntax**: React-like JSX that developers already know and love
- **⚡ Zero Runtime Overhead**: Components compile directly to HTML strings
- **🎯 Modern DX**: Professional developer experience with contemporary tooling

## 🛠️ Technical Implementation

### How JSX Works in funcwc

The JSX runtime provides seamless component integration:

1. **Component Detection**: Automatically recognizes funcwc components by kebab-case naming
2. **Type Generation**: Auto-generates TypeScript interfaces from component prop signatures  
3. **Props Processing**: Converts JSX props to component-expected formats
4. **Direct Rendering**: Compiles JSX directly to HTML strings at build time

### Architecture

```mermaid
graph TD
    A[JSX: <demo-counter initial-count={5} />] 
    B[JSX Runtime h() function]
    C{Is kebab-case tag?}
    D{Component registered?}
    E[Convert JSX props to attributes]
    F[Call renderComponent()]
    G[Render as HTML element]
    H[Component HTML output]
    
    A --> B
    B --> C
    C -->|Yes| D
    C -->|No| G
    D -->|Yes| E
    D -->|No| G
    E --> F
    F --> H
    G --> H
```

## 🚀 Getting Started with JSX

### Step 1: Add JSX Pragma

Add the JSX pragma to the top of your files:

```tsx
/** @jsx h */
import { h } from "funcwc";
```

### Step 2: Use Components with JSX

Write components using familiar JSX syntax:

```tsx
function MyPage() {
  return (
    <div>
      <demo-counter
        initial-count={10}
        step={5} 
        show-controls={true}
        theme="blue"
      />
    </div>
  );
}
```

### Step 3: Use Proper Types

Use native JavaScript types for props:

| Prop Type | JSX Syntax | TypeScript Type |
|-----------|------------|-----------------|
| Numbers | `initial-count={5}` | `number` |
| Strings | `theme="blue"` | `string` |
| Booleans | `disabled={true}` | `boolean` |
| Arrays | `items={[1,2,3]}` | `Array<T>` |
| Objects | `config={{theme: "dark"}}` | `Record<string, unknown>` |

### Step 4: Leverage TypeScript Features

```tsx
// TypeScript will validate prop types
<demo-counter
  initial-count={5}        // ✅ number
  theme="blue"             // ✅ string
  disabled={false}         // ✅ boolean
  // invalid-prop="error"  // ❌ TypeScript error
/>
```

## 📝 JSX Best Practices

### Component Naming
- Use **kebab-case** for component names: `<demo-counter>`, `<theme-controller>`
- funcwc automatically detects kebab-case tags as components

### Prop Types
- Use **native JavaScript types**: numbers as numbers, booleans as booleans
- Avoid string representations: `count={5}` not `count="5"`
- Let TypeScript validate prop types at compile time

### IDE Integration
- Enable TypeScript strict mode for better type checking
- Use JSX file extensions (`.tsx`) for proper syntax highlighting
- Install TypeScript extensions for full IDE support

## ⚡ Performance & Architecture

### Zero Runtime Overhead

funcwc's JSX implementation has **no runtime performance cost**:
- Components compile directly to HTML strings at build time
- No virtual DOM or reconciliation overhead  
- No client-side JavaScript framework required

### Bundle Size

Minimal impact on bundle size:
- **Core runtime**: No additional overhead
- **Type definitions**: Development-only TypeScript files
- **Total impact**: Effectively zero for production builds

## 🔍 Type Safety Features

### Automatic Prop Validation

JSX provides compile-time type checking:

```tsx
// ❌ TypeScript error - invalid prop type
<demo-counter initial-count="not a number" />

// ❌ TypeScript error - unknown prop
<demo-counter invalid-prop="value" />

// ✅ Valid usage
<demo-counter initial-count={10} />
```

### IDE Integration

Full IntelliSense support:
- **Autocompletion**: All available props show up in autocomplete
- **Type Hints**: Hover to see expected prop types
- **Error Highlighting**: Invalid props highlighted in red
- **Go to Definition**: Jump to component definition

### Runtime Validation (Development)

In development mode, additional validation is available:

```tsx
import { validateJSXProps } from "../index.ts";

// Validate props at runtime
validateJSXProps("demo-counter", { initialCount: "invalid" });
// Console warning: Property "initialCount" should be a number
```

## 🔧 Advanced Usage

### Mixed Approaches

You can use both approaches in the same file:

```tsx
function MyLayout() {
  return (
    <div>
      {/* JSX syntax */}
      <demo-counter initial-count={5} />
      
      {/* Traditional approach */}
      {renderComponent("demo-counter", {
        "initial-count": "10"
      })}
    </div>
  );
}
```

### Dynamic Component Names

When component names are dynamic, use renderComponent():

```tsx
function DynamicComponent({ componentType, props }) {
  // Use renderComponent for runtime component selection
  return renderComponent(componentType, props);
}
```

### Conditional Rendering

JSX enables cleaner conditional rendering:

```tsx
// Before
{showCounter ? renderComponent("demo-counter", { ... }) : ""}

// After  
{showCounter && <demo-counter ... />}
```

## 🚨 Common Pitfalls

### Prop Name Conversion

JSX props are automatically converted to kebab-case attributes:

```tsx
// JSX prop name -> HTML attribute
initialCount    -> initial-count
maxValue        -> max-value  
showControls    -> show-controls
```

### Boolean Props

Handle boolean props correctly:

```tsx
// ❌ Wrong - creates attribute with "false" value
<demo-counter disabled={false} />

// ✅ Right - omits attribute entirely
<demo-counter disabled={shouldBeDisabled} />

// ✅ Right - presence-based boolean
<demo-counter disabled />
```

### Children vs Props

Prefer JSX children over children props:

```tsx
// ❌ Less ergonomic
<card-container children="<p>Content</p>" />

// ✅ More ergonomic
<card-container>
  <p>Content</p>
</card-container>
```

## 📚 Example Conversions

### Counter Component

```tsx
// Before
<div>
  {renderComponent("demo-counter", {
    "initial-count": "0",
    "step": "1", 
    "max-value": "10",
    "theme": "blue",
    "label": "My Counter"
  })}
</div>

// After
<div>
  <demo-counter
    initial-count={0}
    step={1}
    max-value={10}
    theme="blue"
    label="My Counter"
  />
</div>
```

### Theme Controller

```tsx
// Before  
{renderComponent("theme-controller", {
  "current-theme": "dark",
  "available-themes": JSON.stringify(["light", "dark", "auto"])
})}

// After
<theme-controller
  current-theme="dark"
  available-themes={["light", "dark", "auto"]}
/>
```

### Complex Component with Multiple Props

```tsx
// Before
{renderComponent("data-table", {
  "columns": JSON.stringify([
    { key: "name", label: "Name" },
    { key: "age", label: "Age" }
  ]),
  "data": JSON.stringify(users),
  "sortable": "true",
  "page-size": "10",
  "show-pagination": "true"
})}

// After  
<data-table
  columns={[
    { key: "name", label: "Name" },
    { key: "age", label: "Age" }
  ]}
  data={users}
  sortable={true}
  page-size={10}
  show-pagination={true}
/>
```

## 🎯 Best Practices

### 1. Prefer JSX for Static Usage
Use JSX when component names and most props are known at compile time.

### 2. Use renderComponent for Dynamic Usage
Use renderComponent() when you need runtime flexibility.

### 3. Consistent Prop Types
Always use appropriate JavaScript types in JSX rather than strings.

### 4. Validate in Development
Enable prop validation in development for better debugging.

### 5. Migration Strategy
Migrate incrementally rather than attempting a big-bang conversion.

## 🔮 Future Enhancements

Planned JSX improvements:

- **Auto-generated Type Files**: Automatically generate `.d.ts` files for all components
- **Props Documentation**: Extract JSDoc comments for prop documentation
- **Enhanced Validation**: More sophisticated runtime prop validation
- **Performance Optimization**: Further optimizations for JSX parsing

## 📞 Support

If you encounter issues during migration:

1. **Check the console** for prop validation warnings
2. **Verify component registration** - components must be registered before JSX usage
3. **Review prop types** - ensure JSX props match expected types
4. **Test incrementally** - migrate one component at a time

funcwc's JSX implementation provides a modern, type-safe development experience while maintaining the library's core philosophy of DOM-native components and zero runtime overhead.