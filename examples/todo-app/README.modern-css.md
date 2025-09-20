# Modern CSS Architecture Demo

This demonstrates the implementation of the modernized CSS architecture in the ui-lib todo app example.

## 🎯 **What Was Implemented**

### **1. Modern CSS Architecture System**
- **Cascade Layers**: `@layer reset, tokens, utilities, components, overrides`
- **Design Tokens**: Comprehensive token system with semantic aliases
- **Container Queries**: True component-responsive design
- **Modern CSS Features**: Logical properties, focus-visible, containment
- **Performance Optimization**: Intelligent bundling and critical CSS

### **2. Modern Components Created**

#### **TodoItem.modern.tsx**
- Uses design tokens instead of hardcoded values
- Container queries for responsive layout
- Data attributes for state management (`data-completed`, `data-priority`)
- Modern accessibility patterns with `aria-label`
- Priority-based visual indicators using border accents

#### **TodoList.modern.tsx**
- CSS Grid layout with auto-fit columns
- Container query-based responsive design
- Semantic HTML with proper ARIA labels
- Loading states with modern CSS animations

#### **server.modern.tsx**
- Side-by-side comparison of old vs new CSS
- Modern CSS initialization and configuration
- CSS statistics and performance monitoring
- Development features including CSS debug mode

### **3. Key Modern CSS Features Used**

#### **Design Tokens**
```typescript
// Instead of hardcoded values
padding: "1rem"

// Use semantic tokens
padding: token("space", "6")
```

#### **Container Queries**
```css
@container (min-width: 500px) {
  padding: token("space", "8");
}

@container (max-width: 400px) {
  flex-direction: column;
}
```

#### **Cascade Layers**
```css
@layer components {
  .todo-item { /* component styles */ }
}

@layer utilities {
  .u-hidden { /* utility styles */ }
}
```

#### **Modern Selectors**
```css
&:focus-visible {
  outline: 2px solid token("color", "primary-500");
}

&:has(:checked) {
  opacity: 0.7;
}
```

## 🚀 **How to Run**

1. **Start the modern demo server:**
   ```bash
   cd examples/todo-app
   PORT=8082 deno run --allow-net --allow-read --allow-env server.modern.tsx
   ```

2. **Visit the demo:**
   - Main comparison: http://localhost:8082/
   - Modern only: http://localhost:8082/modern-only
   - CSS statistics: http://localhost:8082/stats

3. **Development features:**
   - Open browser console and call `toggleCSSDebug()` to visualize layout
   - Check CSS bundle statistics for performance monitoring

## 📊 **Performance Results**

- **Total CSS Bundle**: 17.21KB
- **Gzipped Size**: 5.16KB
- **Layer Organization**: Reset, tokens, utilities, components, overrides
- **Zero runtime cost**: All CSS is static, no client-side processing

## 🎨 **Modern CSS Features Demonstrated**

### **1. Design System Architecture**
- Consistent spacing scale using golden ratio
- Semantic color system with light/dark mode support
- Typography scale with fluid responsive sizing
- Component variants using data attributes

### **2. Container Query Responsive Design**
- Components respond to their container size, not viewport
- True component-level responsive behavior
- Layout shifts based on available space
- Better reusability across different contexts

### **3. Cascade Layers for Specificity Management**
- Clear separation of concerns
- Predictable specificity hierarchy
- Easy overrides without !important
- Better maintainability and debugging

### **4. Modern Accessibility Patterns**
- Semantic HTML with proper ARIA labels
- Focus management with `:focus-visible`
- High contrast support
- Screen reader friendly state announcements

### **5. Performance Optimizations**
- CSS containment for rendering performance
- Bundle analysis and size monitoring
- Critical CSS extraction
- Development vs production optimizations

## 🔄 **Migration Benefits**

### **Before (Legacy CSS-in-TS)**
```typescript
styles: `
  .todo-item {
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
  }
`
```

### **After (Modern CSS Architecture)**
```typescript
const styles = css.responsive("todo-item", {
  base: {
    padding: token("space", "6"),
    backgroundColor: token("surface", "background"),
    border: `1px solid ${token("surface", "border")}`,
    containerType: "inline-size",
  },
  "@container": {
    "(min-width: 500px)": {
      padding: token("space", "8"),
    }
  }
});
```

### **Key Improvements**
- **Maintainability**: Design tokens enable consistent changes across components
- **Responsiveness**: Container queries provide true component-responsive design
- **Performance**: Better CSS organization and bundling
- **Accessibility**: Modern patterns built-in by default
- **Developer Experience**: Type-safe CSS with better tooling support

## 🎯 **Next Steps**

1. **Migrate existing components** using the automated migration tools
2. **Extend design tokens** for your specific brand requirements
3. **Add more container query breakpoints** for complex responsive behavior
4. **Implement dark mode** using the token system
5. **Add CSS custom properties** for dynamic theming

This modern CSS architecture provides a solid foundation for scalable, maintainable, and performant user interfaces while maintaining the SSR-first philosophy of ui-lib.