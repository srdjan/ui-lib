# Changelog

All notable changes to ui-lib will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Library components now accept children**: Item, Card, Stack, and other layout components can now accept custom HTML children, enabling more flexible composition patterns
- Added children support to Item component for custom content rendering
- Exported Item component types (`ItemProps`, `ItemAction`, `ItemBadge`, `ItemBadgeVariant`, `ItemPriority`, `ActionVariant`) from `mod.ts` for application use

### Changed
- **BREAKING: Composition-only pattern enforced**: Applications should now compose pre-styled library components instead of writing custom CSS
- **Improved API ergonomics**: Preserved `{...api!.action(id)}` spread syntax while using library components
- Updated todo-app example components to demonstrate composition-only pattern:
  - `todo-item.tsx`: Now uses `<item>` component with children and spread operators
  - `todo-list.tsx`: Replaced inline styles with Stack layout components
  - `todo-app.tsx`: Removed inline style attributes, uses Stack for alignment
- Updated shopping-cart example:
  - `product-card.tsx`: Now uses Card, Stack, and Badge components instead of custom CSS classes
- Updated all documentation to reflect new composition-only pattern:
  - README.md: Updated Component-Colocated APIs section
  - docs/component-api.md: Updated Real-World Example
  - docs/getting-started.md: Updated Basic Example and Complete Real-World Example sections
  - CLAUDE.md: Added composition-only pattern guidance and updated all examples

### Removed
- Removed `spreadAttrs()` helper from documentation examples (no longer needed with children support)
- Removed all inline styles and custom CSS classes from example applications

### Key Benefits
- ✅ **Zero custom CSS in applications** - All styling from library components
- ✅ **Ergonomic API spread syntax** - Direct JSX spread operators work seamlessly
- ✅ **Flexible composition** - Library components accept children for customization
- ✅ **Enforced UI consistency** - Applications compose from pre-styled component library
- ✅ **Reduced code** - Simpler, more maintainable application code

## [0.1.0] - Previous Release

### Added
- Initial release with component system
- JSX/TSX support with custom runtime
- CSS-in-TS system
- SSR rendering
- State management
- Component-colocated APIs with HTTP method helpers
- Built-in component library (Button, Card, Input, Item, Stack, etc.)
- Result<T,E> error handling pattern
- Light Functional Programming architecture

[Unreleased]: https://github.com/yourusername/ui-lib/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/ui-lib/releases/tag/v0.1.0
