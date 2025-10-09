# API Exposure Refactoring Plan

## Overview
Refactor the current API approach in `defineComponent` to match the simpler, more direct pattern from commit `c6c6c7b5ff74bf9c29c6e15fc38b5fe43d266ce9`.

## Current Approach (Complex)

### Current API Definition
```typescript
defineComponent<{ todo: Todo }>("todo-item", {
  api: {
    toggle: [
      "POST",                    // HTTP method
      "/api/todos/:id/toggle",   // Route pattern
      (req, params) => todoAPI.toggleTodo(req, params as { id: string }),  // Handler
    ],
    deleteTodo: [
      "DELETE",
      "/api/todos/:id",
      (req, params) => todoAPI.deleteTodo(req, params as { id: string }),
    ],
  },
  render: ({ todo }, api) => {
    // Usage requires helper functions
    const toggleAttrs = api ? onAction(api.toggle, todo.id) : "";
    const deleteAction = itemAction(api!.deleteTodo, "Delete", [todo.id], {
      variant: "danger",
      confirm: "Are you sure?",
    });
    // ...
  },
});
```

**Issues:**
1. ✗ Tuple-based API definition `["METHOD", "path", handler]` is verbose
2. ✗ Requires helper functions (`onAction`, `itemAction`) to use API
3. ✗ Separation between definition and usage creates indirection
4. ✗ Type inference issues with tuples
5. ✗ Not clear what the API returns or how to use it

---

## Target Approach (from commit c6c6c7b)

### Target API Definition
```typescript
defineComponent("todo-item", {
  api: {
    toggle: patch("/api/todos/:id/toggle", async (req, params) => {
      const form = await req.formData();
      const isDone = form.get("done") === "true";
      return new Response(
        renderComponent("todo-item", {
          id: params.id,
          text: "Task updated!",
          done: !isDone,
        }),
      );
    }),
    remove: del("/api/todos/:id", (_req, _params) => {
      return new Response(null, { status: 200 });
    }),
  },
  render: ({ id, text, done }, api, classes) => (
    <div class={classes!.item} data-id={id}>
      <input
        type="checkbox"
        checked={done}
        {...api.toggle(id)}  // Direct spread of attributes
      />
      <span>{text}</span>
      <button {...api.remove(id)}>×</button>  // Direct spread of attributes
    </div>
  ),
});
```

**Benefits:**
1. ✅ HTTP method helpers (`patch`, `del`, `post`, `get`, `put`) are clear and concise
2. ✅ Handler is inline - no separation between route and implementation
3. ✅ API usage via spread operator `{...api.action(id)}` - simple and direct
4. ✅ No helper functions needed (`onAction`, `itemAction`)
5. ✅ Better TypeScript inference
6. ✅ Clear that API returns spreadable attributes object

---

## Implementation Plan

### Phase 1: Create HTTP Method Helpers

**File:** `lib/api-helpers.ts` (new file)

```typescript
import type { RouteHandler } from "./router.ts";

// Type for the API action that returns spreadable attributes
export type ApiAction = (
  ...params: string[]
) => Record<string, string>;

// Type for wrapped route handler
export type ApiRoute = {
  method: string;
  path: string;
  handler: RouteHandler;
  toAction: (...params: string[]) => Record<string, string>;
};

// HTTP method helpers that create ApiRoute objects
export function get(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("GET", path, handler);
}

export function post(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("POST", path, handler);
}

export function patch(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("PATCH", path, handler);
}

export function put(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("PUT", path, handler);
}

export function del(path: string, handler: RouteHandler): ApiRoute {
  return createApiRoute("DELETE", path, handler);
}

// Internal helper to create ApiRoute with attribute generator
function createApiRoute(
  method: string,
  path: string,
  handler: RouteHandler,
): ApiRoute {
  return {
    method,
    path,
    handler,
    toAction: (...params: string[]) => {
      // Generate HTMX attributes for this route with params
      const interpolatedPath = params.reduce((p, param, idx) => {
        return p.replace(`:${getParamName(path, idx)}`, param);
      }, path);

      return {
        "hx-target": "this",
        "hx-swap": "outerHTML",
        [`hx-${method.toLowerCase()}`]: interpolatedPath,
      };
    },
  };
}

// Helper to extract param names from path
function getParamName(path: string, index: number): string {
  const matches = path.match(/:([^/]+)/g);
  if (!matches || index >= matches.length) {
    throw new Error(`No param at index ${index} in path ${path}`);
  }
  return matches[index].substring(1);
}
```

---

### Phase 2: Update defineComponent API Processing

**File:** `lib/define-component.ts`

**Current:**
```typescript
export type ApiMap = Record<
  string,
  readonly [method: string, path: string, handler: RouteHandler]
>;
```

**New:**
```typescript
import type { ApiRoute } from "./api-helpers.ts";

export type ApiMap = Record<string, ApiRoute>;
```

**Update component registration:**
```typescript
export function defineComponent<TProps = any>(
  name: string,
  config: ComponentConfig<TProps>,
): DefinedComponent<TProps> {
  // ... existing code ...

  // Convert ApiMap to HxActionMap
  let hxActionMap: HxActionMap<any> | undefined;
  if (apiMap) {
    hxActionMap = {} as HxActionMap<any>;
    for (const [key, apiRoute] of Object.entries(apiMap)) {
      // Create action function that returns spreadable attributes
      hxActionMap[key] = apiRoute.toAction;
    }
  }

  // ... rest of existing code ...
}
```

---

### Phase 3: Update Router Registration

**File:** `lib/api-generator.ts`

**Current:**
```typescript
export function registerComponentApi(
  router: { register: (method: string, path: string, handler: RouteHandler) => void },
  componentName: string,
): void {
  const registry = getRegistry();
  const component = registry.getComponent(componentName);
  if (!component?.api) return;

  for (const [_actionName, [method, path, handler]] of Object.entries(component.api)) {
    router.register(method, path, handler);
  }
}
```

**New:**
```typescript
export function registerComponentApi(
  router: { register: (method: string, path: string, handler: RouteHandler) => void },
  componentName: string,
): void {
  const registry = getRegistry();
  const component = registry.getComponent(componentName);
  if (!component?.api) return;

  for (const [_actionName, apiRoute] of Object.entries(component.api)) {
    router.register(apiRoute.method, apiRoute.path, apiRoute.handler);
  }
}
```

---

### Phase 4: Update Exports

**File:** `mod.ts` and `mod-simple.ts`

Add exports:
```typescript
// HTTP method helpers for API definitions
export { del, get, patch, post, put } from "./lib/api-helpers.ts";
export type { ApiAction, ApiRoute } from "./lib/api-helpers.ts";
```

---

### Phase 5: Deprecate Old Helpers

**Files to mark as deprecated:**
- `lib/api-recipes.ts` - Functions: `onAction`, `itemAction`
- Document migration path in deprecation notices

**Add deprecation comments:**
```typescript
/**
 * @deprecated Use spread operator with API actions instead:
 *
 * Old: const attrs = onAction(api.toggle, id);
 * New: <input {...api.toggle(id)} />
 */
export function onAction(...) { ... }
```

---

### Phase 6: Update Examples

**Examples to update:**

1. **Todo App** (`examples/todo-app/components/todo-item.tsx`)

**Before:**
```typescript
defineComponent<{ todo: Todo }>("todo-item", {
  api: {
    toggle: [
      "POST",
      "/api/todos/:id/toggle",
      (req, params) => todoAPI.toggleTodo(req, params as { id: string }),
    ],
    deleteTodo: [
      "DELETE",
      "/api/todos/:id",
      (req, params) => todoAPI.deleteTodo(req, params as { id: string }),
    ],
  },
  render: ({ todo }, api) => {
    const toggleAttrs = api ? onAction(api.toggle, todo.id) : "";
    const deleteAction = itemAction(api!.deleteTodo, "Delete", [todo.id], {
      variant: "danger",
    });
    // ...
  },
});
```

**After:**
```typescript
import { del, post } from "../../../mod.ts";

defineComponent<{ todo: Todo }>("todo-item", {
  api: {
    toggle: post("/api/todos/:id/toggle", (req, params) =>
      todoAPI.toggleTodo(req, params as { id: string })
    ),
    deleteTodo: del("/api/todos/:id", (req, params) =>
      todoAPI.deleteTodo(req, params as { id: string })
    ),
  },
  render: ({ todo }, api) => {
    return (
      <div>
        <input
          type="checkbox"
          checked={todo.completed}
          {...api!.toggle(todo.id)}
        />
        <span>{todo.text}</span>
        <button {...api!.deleteTodo(todo.id)}>Delete</button>
      </div>
    );
  },
});
```

2. **Shopping Cart** (if applicable)

---

## Migration Path

### For Library Developers

1. Import HTTP helpers: `import { get, post, patch, put, del } from "ui-lib"`
2. Replace tuple syntax:
   ```typescript
   // Old
   api: {
     action: ["POST", "/path/:id", handler]
   }

   // New
   api: {
     action: post("/path/:id", handler)
   }
   ```
3. Use spread operator in render:
   ```typescript
   // Old
   const attrs = onAction(api.action, id);
   <button hx-post={attrs}>

   // New
   <button {...api.action(id)}>
   ```

### For Application Developers

- Same as library developers
- Remove imports of `onAction`, `itemAction`
- Spread API actions directly onto elements

---

## Backwards Compatibility

### Option 1: Breaking Change (Recommended)
- Remove old tuple-based API completely
- Remove `onAction` and `itemAction` helpers
- Update all examples in one PR
- Document migration in CHANGELOG

### Option 2: Support Both (Transitional)
- Detect if API value is tuple or ApiRoute
- Support both formats during migration period
- Add deprecation warnings for tuple format
- Remove in next major version

**Recommended:** Option 1 (Breaking Change)
- Cleaner codebase
- Less code to maintain
- Examples show best practices immediately

---

## Testing Strategy

### Unit Tests

1. **Test api-helpers.ts**
   ```typescript
   Deno.test("post() creates correct ApiRoute", () => {
     const route = post("/api/todos/:id", () => new Response());
     assertEquals(route.method, "POST");
     assertEquals(route.path, "/api/todos/:id");

     const attrs = route.toAction("123");
     assertEquals(attrs["hx-post"], "/api/todos/123");
     assertEquals(attrs["hx-target"], "this");
     assertEquals(attrs["hx-swap"], "outerHTML");
   });
   ```

2. **Test defineComponent with new API**
   ```typescript
   Deno.test("defineComponent processes ApiRoute correctly", () => {
     defineComponent("test", {
       api: {
         update: post("/test/:id", () => new Response()),
       },
       render: (props, api) => {
         const attrs = api!.update("123");
         assert(attrs["hx-post"] === "/test/123");
         return "<div></div>";
       },
     });
   });
   ```

### Integration Tests

1. Test router registration with new API format
2. Test component rendering with spread operator
3. Test HTMX attribute generation

---

## File Changes Summary

### New Files
- ✅ `lib/api-helpers.ts` - HTTP method helpers

### Modified Files
- ✅ `lib/define-component.ts` - Update ApiMap type, process ApiRoute
- ✅ `lib/api-generator.ts` - Update registerComponentApi
- ✅ `mod.ts` - Add exports for HTTP helpers
- ✅ `mod-simple.ts` - Add exports for HTTP helpers
- ✅ `examples/todo-app/components/todo-item.tsx` - Update to new API
- ✅ `lib/api-recipes.ts` - Add deprecation notices (or remove)

### Documentation
- ✅ Update component API docs
- ✅ Update getting started guide
- ✅ Add migration guide
- ✅ Update examples README

---

## Implementation Order

1. **Create api-helpers.ts** - Foundation for new approach
2. **Update define-component.ts** - Support new ApiRoute type
3. **Update api-generator.ts** - Register routes from ApiRoute
4. **Update exports** - Make helpers available
5. **Update todo-item example** - Show new pattern
6. **Remove old helpers** - Clean up api-recipes.ts
7. **Update documentation** - Document new approach
8. **Add tests** - Ensure everything works

---

## Benefits Summary

### Developer Experience
- ✅ **Simpler syntax** - `post("/path", handler)` vs tuple
- ✅ **Direct usage** - `{...api.action(id)}` vs helper functions
- ✅ **Better TypeScript** - Clearer types, better inference
- ✅ **Less indirection** - No layers of helpers

### Code Quality
- ✅ **Less code** - Remove helper functions
- ✅ **Clearer intent** - HTTP method in function name
- ✅ **Easier to read** - Direct spread operator usage
- ✅ **Maintainable** - Fewer abstraction layers

### Consistency
- ✅ **Matches modern patterns** - Similar to frameworks like SvelteKit
- ✅ **Intuitive** - Spread operator is natural for attributes
- ✅ **Self-documenting** - Method helpers are descriptive

---

## Example Comparison

### Before (Current)
```typescript
import { onAction, itemAction } from "ui-lib";

defineComponent("todo", {
  api: {
    toggle: ["POST", "/api/todos/:id/toggle", toggleHandler],
    remove: ["DELETE", "/api/todos/:id", removeHandler],
  },
  render: ({ todo }, api) => {
    const toggleAttrs = onAction(api.toggle, todo.id);
    const removeAction = itemAction(api.remove, "Delete", [todo.id]);

    return (
      <div>
        <input
          type="checkbox"
          hx-post={toggleAttrs["hx-post"]}
          hx-target={toggleAttrs["hx-target"]}
        />
        <button {...removeAction}>×</button>
      </div>
    );
  },
});
```

### After (Target)
```typescript
import { post, del } from "ui-lib";

defineComponent("todo", {
  api: {
    toggle: post("/api/todos/:id/toggle", toggleHandler),
    remove: del("/api/todos/:id", removeHandler),
  },
  render: ({ todo }, api) => (
    <div>
      <input type="checkbox" {...api.toggle(todo.id)} />
      <button {...api.remove(todo.id)}>×</button>
    </div>
  ),
});
```

**Comparison:**
- **11 lines removed** (imports + helper calls)
- **Clearer intent** - Method in function name
- **Direct usage** - Spread operator everywhere
- **No intermediate variables** needed

---

## Success Criteria

✅ All HTTP methods have helper functions (`get`, `post`, `patch`, `put`, `del`)
✅ API actions return spreadable attribute objects
✅ No helper functions needed (`onAction`, `itemAction` removed)
✅ Todo example updated to new pattern
✅ Router registration works with new ApiRoute type
✅ All tests passing
✅ Documentation updated
✅ Migration guide written

---

## Risk Assessment

### Low Risk
- ✅ New helpers are simple functions
- ✅ Changes are localized to API system
- ✅ Tests will catch any issues

### Medium Risk
- ⚠️ Breaking change for existing components
- ⚠️ All examples must be updated simultaneously

### Mitigation
- Update all examples in single commit
- Provide clear migration guide
- Add tests before refactoring
- Document the change thoroughly

---

## Timeline Estimate

- **Phase 1** (api-helpers.ts): 30 minutes
- **Phase 2** (define-component.ts): 45 minutes
- **Phase 3** (api-generator.ts): 20 minutes
- **Phase 4** (exports): 10 minutes
- **Phase 5** (deprecation): 15 minutes
- **Phase 6** (examples): 1 hour
- **Testing**: 1 hour
- **Documentation**: 45 minutes

**Total:** ~4.5 hours

---

## Next Steps

1. Review this plan
2. Get approval for breaking change approach
3. Create api-helpers.ts implementation
4. Update core files (define-component, api-generator)
5. Update examples to demonstrate new pattern
6. Write tests
7. Update documentation
8. Create PR with all changes