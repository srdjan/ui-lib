# Add Starter-Friendly Layout Components

## Summary
This PR adds 5 new layout components designed to make it easier to create starter applications with ui-lib. These components are specifically built for the [ui-lib-starter](https://github.com/srdjan/ui-lib-starter) project generator.

## Components Added

### 1. Container
- Responsive content container with max-width constraints
- Variants: `fluid`, `constrained` (default), `narrow`, `wide`
- Handles content width and centering automatically

### 2. Footer
- Flexible footer with links, copyright, and custom content
- Variants: `default`, `sticky`, `fixed`
- Supports external links with visual indicators

### 3. Hero
- Prominent page header section
- Includes: title, subtitle, description, and CTA button
- Optional props for all elements
- Supports custom children content

### 4. Navbar
- Responsive navigation bar with brand and links
- Active link state support
- Sticky positioning option
- Custom children for additional nav content

### 5. FeatureCard
- Feature highlight card component
- Includes: icon, title, description
- Variants: `default`, `elevated`, `bordered`
- Hover effects for interactivity

## Design Principles

All components follow ui-lib patterns:
- ✅ Use `css()` function with `componentTokens` for styling
- ✅ Support composition with `{{children}}` placeholder
- ✅ Include responsive design with media queries
- ✅ Export as string constants for JSX usage
- ✅ Fully typed with TypeScript interfaces
- ✅ Scoped styles prevent CSS conflicts

## Usage Example

```typescript
import { renderComponent } from "ui-lib";
import "ui-lib/lib/components/layout/hero";
import "ui-lib/lib/components/layout/container";

const hero = renderComponent("hero", {
  title: "Welcome to My App",
  subtitle: "Build amazing things",
  ctaText: "Get Started",
  ctaHref: "/docs",
  centered: true
});

const content = renderComponent("container", {
  variant: "constrained"
}, hero);
```

## Integration

These components are exported from `lib/components/layout/index.ts` and work seamlessly with the ui-lib-starter project generator. They provide a solid foundation for:
- Landing pages
- Marketing sites
- Documentation pages
- Application dashboards

## Testing

Components follow the existing ui-lib architecture and use the same rendering patterns. They can be tested with the ui-lib-starter generator:

```bash
deno run -A jsr:@ui-lib/starter
# Select options and generate a project
# Components will be imported and rendered automatically
```

## Files Changed

- `lib/components/layout/container.ts` - New container component
- `lib/components/layout/feature-card.ts` - New feature card component
- `lib/components/layout/footer.ts` - New footer component
- `lib/components/layout/hero.ts` - New hero component
- `lib/components/layout/navbar.ts` - New navbar component
- `lib/components/layout/index.ts` - Export new components

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
