# Repository Guidelines

ui-lib delivers SSR-friendly UI primitives for Deno projects. Use this guide to
stay aligned with the existing structure and workflow.

## Project Structure & Module Organization

- `index.ts` and `mod*.ts` aggregate exports for consumers; keep tree-shaking in
  mind.
- `lib/` houses core modules with colocated specs (`*.test.ts`,
  `*.integration.test.ts`) and component subfolders.
- Legacy files like `components-simple.tsx` may expose alternate authoring styles;
  update them when APIs shift or consider removing if unused.
- `examples/todo-app/` demonstrates full-stack usage with a Deno server; mirror
  feature changes here.
- `docs/` offers public guides; `assets/` and `bench/ssr.bench.ts` store design
  tokens and performance scripts.
- `lib/api-recipes.ts` wraps `generateClientApi` with HTMX helpers; stage new
  API improvements here first.

## Build, Test, and Development Commands

- `deno task check` – Type-checks `index.ts`, `lib/**/*.ts`, and example code.
- `deno task test` – Runs the full Deno test suite (unit, integration, JSX
  runtime).
- `deno task fmt` / `deno task fmt:check` – Formats or verifies formatting
  across the repo.
- `deno task lint` – Applies Deno’s lint rules; run before opening a PR.
- `deno task coverage` – Generates `coverage/` and `coverage.lcov` for
  reporting.
- `deno task serve` (or `start`) – Boots the Todo demo with the required
  permissions.
- `deno task bundle:state` – Bundles `scripts/state-entry.ts` into
  `dist/ui-lib-state.js` for client-side state helpers.

## Coding Style & Naming Conventions

Stick to strict TypeScript; keep imports relative. Use two-space indentation and
kebab-case filenames (`api-helpers.ts`). Favor pure functions, avoid ambient
globals, and centralize shared state in `lib/state-manager.ts`. Document exports
with JSDoc or concise examples. Run `deno fmt` and `deno lint` before
committing.

## Testing Guidelines

Write tests alongside implementations with the `*.test.ts` suffix; integration
or reactive suites use `*.integration.test.ts` as in
`lib/declarative-bindings.integration.test.ts`. Prefer table-driven cases and
snapshot-free assertions. Keep `deno task coverage` above 90% lines and add
regression tests for fixes. Use `deno test --filter` while iterating, and ensure
`deno task test` passes before pushing.

## Commit & Pull Request Guidelines

Existing history favors short, descriptive summaries (`using lib api correctly`,
`todo example code reorg`). Continue using imperative, ≤60-character titles and
omit trailing punctuation. Avoid `WIP` in final commits; squash if necessary.
Pull requests should include:

- Contextual description with links to docs or issues.
- Checklist of local commands run (check, test, fmt, lint, coverage when
  relevant).
- Screenshots or snippets for visual or API changes. Tag reviewers familiar with
  affected modules and call out breaking changes in bold at the top of the
  description.

## Development guidalines

# Light Functional Programming Guide for TypeScript/Deno

This guide establishes our team's coding standards for Light Functional
Programming (Light FP) in TypeScript/Deno projects. These patterns promote
clean, testable, and maintainable code.

## Core Philosophy

### The Three Pillars

1. **Model with types first; make illegal states unrepresentable**
2. **Keep the core pure (no I/O); push effects to edges**
3. **Treat errors as values** (`Result<T,E>`)

### What "Light FP" Means Here

- **No classes, inheritance, or exceptions in the core**
- **Algebraic data types** (unions), smart constructors, pattern matching
- **Local mutation is OK inside functions** for performance; public APIs stay
  immutable
- **Dependency injection through function parameters** (ports pattern)

---

## 1. Type System Rules

### ✅ Use `type` for Data Definitions

All data structures must be defined as `type` with `readonly` properties:

```typescript
// ✅ CORRECT: Data as immutable types
export type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
};

export type ApiResponse<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: string };

// ✅ CORRECT: Algebraic Data Types (ADTs)
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type PaymentEvent =
  | { readonly type: "initiated"; readonly amount: number }
  | { readonly type: "processed"; readonly transactionId: string }
  | { readonly type: "failed"; readonly reason: string };
```

### ✅ Use `interface` ONLY for Ports (Capabilities)

Interfaces are reserved exclusively for defining behavioral contracts - groups
of functions that represent capabilities:

```typescript
// ✅ CORRECT: Interfaces for capabilities/ports
export interface Clock {
  readonly now: () => Date;
  readonly timestamp: () => number;
}

export interface Logger {
  readonly info: (message: string, data?: unknown) => void;
  readonly error: (message: string, data?: unknown) => void;
  readonly warn: (message: string, data?: unknown) => void;
}

export interface UserRepository {
  readonly save: (user: User) => Promise<Result<User, DatabaseError>>;
  readonly findById: (
    id: string,
  ) => Promise<Result<User | null, DatabaseError>>;
  readonly findByEmail: (
    email: string,
  ) => Promise<Result<User | null, DatabaseError>>;
}
```

### ❌ Wrong Patterns to Avoid

```typescript
// ❌ WRONG: Interface for data
interface UserData {
  id: string;
  name: string;
}

// ❌ WRONG: Mutable properties
export type User = {
  id: string; // Missing readonly
  name: string; // Missing readonly
};

// ❌ WRONG: Classes for data
class User {
  constructor(public id: string, public name: string) {}
}
```

---

## 2. Error Handling with Result Types

### Always Use Result<T, E> for Fallible Operations

```typescript
// ✅ CORRECT: Result type definition
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

// ✅ CORRECT: Constructor functions
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// ✅ CORRECT: Domain-specific error types
export type ValidationError =
  | { readonly type: "required"; readonly field: string }
  | { readonly type: "invalid_email"; readonly field: string }
  | {
    readonly type: "too_short";
    readonly field: string;
    readonly minLength: number;
  };

export type DatabaseError =
  | { readonly type: "connection_failed"; readonly message: string }
  | { readonly type: "constraint_violation"; readonly constraint: string }
  | {
    readonly type: "not_found";
    readonly entity: string;
    readonly id: string;
  };
```

### Result Utility Functions

```typescript
// ✅ CORRECT: Utility functions for Result
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => result.ok ? ok(fn(result.value)) : result;

export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => result.ok ? fn(result.value) : result;

export const mapError = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> => result.ok ? result : err(fn(result.error));
```

### Pattern Matching with ts-pattern (Optional)

```typescript
import { match } from "ts-pattern";

// ✅ CORRECT: Pattern matching for Result handling
const handleResult = (result: Result<User, ValidationError>) =>
  match(result)
    .with({ ok: true }, ({ value }) => `Success: ${value.name}`)
    .with({ ok: false, error: { type: "required" } }, ({ error }) =>
      `Required field missing: ${error.field}`)
    .with({ ok: false, error: { type: "invalid_email" } }, ({ error }) =>
      `Invalid email format in field: ${error.field}`)
    .exhaustive();
```

---

## 3. The Ports Pattern (Dependency Injection)

### Directory Structure

```
src/
  domain/           # Pure business logic
  ports/            # Interface definitions for capabilities
    clock.ts        # Time capabilities
    logger.ts       # Logging capabilities
    crypto.ts       # Cryptographic capabilities
    database.ts     # Database capabilities
  adapters/         # Implementations of ports
    real-clock.ts
    console-logger.ts
    deno-crypto.ts
    sqlite-db.ts
  http/            # HTTP transport layer
  lib/             # Shared utilities
```

### Port Interface Examples

```typescript
// src/ports/clock.ts
export interface Clock {
  readonly now: () => Date;
  readonly timestamp: () => number;
}

// src/ports/crypto.ts
export interface Crypto {
  readonly randomUUID: () => string;
  readonly randomBytes: (length: number) => Uint8Array;
}

// src/ports/database.ts
export interface Database {
  readonly query: <T>(
    sql: string,
    params?: unknown[],
  ) => Promise<Result<T[], DatabaseError>>;
  readonly transaction: <T>(
    fn: (db: Database) => Promise<Result<T, DatabaseError>>,
  ) => Promise<Result<T, DatabaseError>>;
}
```

### Port Implementations (Adapters)

```typescript
// src/adapters/real-clock.ts
import type { Clock } from "../ports/clock.ts";

export const createClock = (): Clock => ({
  now: () => new Date(),
  timestamp: () => Date.now(),
});

// src/adapters/test-clock.ts
export const createFixedClock = (date: Date): Clock => ({
  now: () => date,
  timestamp: () => date.getTime(),
});
```

### Domain Functions with Injected Ports

```typescript
// src/domain/user-service.ts
import type { Clock } from "../ports/clock.ts";
import type { Crypto } from "../ports/crypto.ts";
import type { Database } from "../ports/database.ts";

export const createUser =
  (clock: Clock, crypto: Crypto, db: Database) =>
  async (userData: CreateUserData): Promise<Result<User, CreateUserError>> => {
    // Validation (pure)
    const validation = validateUserData(userData);
    if (!validation.ok) return validation;

    // Create user (using injected capabilities)
    const user: User = {
      id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      createdAt: clock.now(),
    };

    // Save to database
    return await db.save(user);
  };
```

### Composition at Application Boundaries

```typescript
// src/app/main.ts
import { createClock } from "../adapters/real-clock.ts";
import { createCrypto } from "../adapters/deno-crypto.ts";
import { createDatabase } from "../adapters/sqlite-db.ts";
import { createUser } from "../domain/user-service.ts";

// Compose dependencies
const clock = createClock();
const crypto = createCrypto();
const database = createDatabase("./app.db");

// Create composed functions
const userService = {
  createUser: createUser(clock, crypto, database),
  // ... other user operations
};

// Use in HTTP handlers
const handleCreateUser = async (request: Request): Promise<Response> => {
  const userData = await request.json();
  const result = await userService.createUser(userData);

  if (result.ok) {
    return Response.json(result.value, { status: 201 });
  } else {
    return Response.json({ error: result.error }, { status: 400 });
  }
};
```

---

## 4. Pure Functions and Side Effects

### Keep the Core Pure

```typescript
// ✅ CORRECT: Pure domain logic
export const calculateOrderTotal = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

export const validateEmail = (
  email: string,
): Result<string, ValidationError> => {
  if (!email.includes("@")) {
    return err({ type: "invalid_email", field: "email" });
  }
  return ok(email);
};

// ✅ CORRECT: Pure business rules
export const canUserAccessResource = (
  user: User,
  resource: Resource,
): boolean => user.role === "admin" || resource.ownerId === user.id;
```

### Push Side Effects to Edges

```typescript
// ✅ CORRECT: Side effects at application boundaries
export const createOrderHandler =
  (logger: Logger, db: Database, emailService: EmailService) =>
  async (request: Request): Promise<Response> => {
    try {
      // Parse input (side effect)
      const orderData = await request.json();

      // Pure validation
      const validation = validateOrderData(orderData);
      if (!validation.ok) {
        return Response.json({ error: validation.error }, { status: 400 });
      }

      // Pure business logic
      const order = createOrderFromData(validation.value);
      const total = calculateOrderTotal(order.items);

      // Side effects (database, email)
      const saveResult = await db.saveOrder({ ...order, total });
      if (!saveResult.ok) {
        logger.error("Failed to save order", saveResult.error);
        return Response.json({ error: "Internal error" }, { status: 500 });
      }

      await emailService.sendOrderConfirmation(order);

      return Response.json(saveResult.value, { status: 201 });
    } catch (error) {
      logger.error("Unhandled error in createOrder", error);
      return Response.json({ error: "Internal error" }, { status: 500 });
    }
  };
```

---

## 5. Immutability and Data Transformation

### Use Readonly Types

```typescript
// ✅ CORRECT: Immutable data structures
export type UserPreferences = {
  readonly theme: "light" | "dark";
  readonly notifications: {
    readonly email: boolean;
    readonly push: boolean;
  };
  readonly tags: readonly string[];
};

// ✅ CORRECT: Transformation functions
export const updateUserTheme = (
  preferences: UserPreferences,
  theme: "light" | "dark",
): UserPreferences => ({
  ...preferences,
  theme,
});

export const addTag = (
  preferences: UserPreferences,
  tag: string,
): UserPreferences => ({
  ...preferences,
  tags: [...preferences.tags, tag],
});
```

### Local Mutation for Performance

```typescript
// ✅ CORRECT: Local mutation inside pure function
export const processLargeDataset = (
  items: readonly Item[],
): ProcessedItem[] => {
  // Local mutation for performance - not visible outside
  const result: ProcessedItem[] = [];
  const lookup = new Map<string, number>();

  for (const item of items) {
    const processed = transformItem(item);
    result.push(processed);
    lookup.set(item.id, processed.score);
  }

  // Return immutable result
  return result;
};
```

---

## 6. Testing Patterns

### Unit Testing Pure Functions

```typescript
// ✅ CORRECT: Testing pure functions
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { calculateOrderTotal, validateEmail } from "./domain.ts";

Deno.test("calculateOrderTotal - calculates correct total", () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ];

  const total = calculateOrderTotal(items);

  assertEquals(total, 35);
});

Deno.test("validateEmail - rejects invalid email", () => {
  const result = validateEmail("invalid-email");

  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.error.type, "invalid_email");
  }
});
```

### Testing with Mock Ports

```typescript
// ✅ CORRECT: Testing with injected dependencies
import { createUser } from "./user-service.ts";

Deno.test("createUser - creates user with correct timestamp", async () => {
  // Arrange: Mock ports
  const fixedDate = new Date("2024-01-01T00:00:00Z");
  const mockClock = {
    now: () => fixedDate,
    timestamp: () => fixedDate.getTime(),
  };
  const mockCrypto = {
    randomUUID: () => "test-uuid-123",
  };
  const mockDb = {
    save: async (user: User) => ok(user),
  };

  // Act
  const result = await createUser(mockClock, mockCrypto, mockDb)({
    name: "Test User",
    email: "test@example.com",
  });

  // Assert
  assertEquals(result.ok, true);
  if (result.ok) {
    assertEquals(result.value.id, "test-uuid-123");
    assertEquals(result.value.createdAt, fixedDate);
  }
});
```

---

## 7. Common Patterns and Utilities

### Smart Constructors

```typescript
// ✅ CORRECT: Smart constructors for validated types
export type Email = string & { readonly __brand: "Email" };
export type UserId = string & { readonly __brand: "UserId" };

export const createEmail = (input: string): Result<Email, ValidationError> => {
  if (!input.includes("@")) {
    return err({ type: "invalid_email", field: "email" });
  }
  return ok(input as Email);
};

export const createUserId = (
  input: string,
): Result<UserId, ValidationError> => {
  if (input.length === 0) {
    return err({ type: "required", field: "userId" });
  }
  return ok(input as UserId);
};
```

### Pipeline Composition

```typescript
// ✅ CORRECT: Function composition utilities
export const pipe = <T>(value: T) => ({
  map: <U>(fn: (value: T) => U) => pipe(fn(value)),
  flatMap: <U>(fn: (value: T) => Result<U, any>) => {
    const result = fn(value);
    return result.ok ? pipe(result.value) : result;
  },
  unwrap: () => value,
});

// Usage
const processUserData = (rawData: unknown) =>
  pipe(rawData)
    .flatMap(parseUserData)
    .flatMap(validateUserData)
    .flatMap(enrichUserData)
    .unwrap();
```

---

## 8. File and Module Organization

### Module Structure

```typescript
// ✅ CORRECT: Module exports
// types.ts - Data types only
export type User = {/* ... */};
export type UserError = {/* ... */};

// ports.ts - Capability interfaces only
export interface UserRepository {/* ... */}
export interface EmailService {/* ... */}

// domain.ts - Pure business logic
export const createUser = (/* ports */) => (/* data */) => {/* ... */};
export const validateUser = (
  user: User,
): Result<User, UserError> => {/* ... */};

// adapters.ts - Port implementations
export const createSqliteUserRepository = (): UserRepository => {/* ... */};
export const createSmtpEmailService = (): EmailService => {/* ... */};
```

### Import/Export Conventions

```typescript
// ✅ CORRECT: Explicit type imports
import type { User, UserError } from "./types.ts";
import type { UserRepository } from "./ports.ts";
import { createUser, validateUser } from "./domain.ts";

// ✅ CORRECT: Barrel exports with clear structure
// index.ts
export type { User, UserError } from "./types.ts";
export type { UserRepository } from "./ports.ts";
export { createUser, validateUser } from "./domain.ts";
export { createSqliteUserRepository } from "./adapters.ts";
```

---

## 9. Code Review Checklist

### ✅ Data Modeling

- [ ] All data is defined with `type` and `readonly` properties
- [ ] No `interface` used for data structures
- [ ] ADTs used for states and events
- [ ] Illegal states are unrepresentable

### ✅ Error Handling

- [ ] All fallible operations return `Result<T, E>`
- [ ] No `throw` statements in domain code
- [ ] Specific error types for different failure modes
- [ ] Error handling at application boundaries only

### ✅ Ports Pattern

- [ ] Capabilities defined as `interface` with function signatures
- [ ] Dependencies injected through function parameters
- [ ] No direct imports of external services in domain code
- [ ] Pure functions for business logic

### ✅ Immutability

- [ ] All public APIs use `readonly` types
- [ ] No mutation of input parameters
- [ ] Local mutation allowed only for performance inside functions

### ✅ Testing

- [ ] Pure functions have unit tests
- [ ] Side effects tested with mock ports
- [ ] No direct database/network calls in tests

---

## 10. Migration Guide

### Converting Existing Code

1. **Identify Data vs Capabilities**
   ```typescript
   // Before
   interface User {
     id: string;
     name: string;
   }
   interface UserService {
     save(user: User): Promise<void>;
   }

   // After
   type User = { readonly id: string; readonly name: string };
   interface UserRepository {
     readonly save: (user: User) => Promise<Result<User, DbError>>;
   }
   ```

2. **Replace Exceptions with Results**
   ```typescript
   // Before
   function parseEmail(input: string): string {
     if (!input.includes("@")) throw new Error("Invalid email");
     return input;
   }

   // After
   function parseEmail(input: string): Result<string, ValidationError> {
     if (!input.includes("@")) {
       return err({ type: "invalid_email", field: "email" });
     }
     return ok(input);
   }
   ```

3. **Extract Side Effects**
   ```typescript
   // Before
   async function createUser(userData: any) {
     const user = {
       id: crypto.randomUUID(),
       ...userData,
       createdAt: new Date(),
     };
     await database.save(user);
     return user;
   }

   // After
   const createUser = (crypto: Crypto, clock: Clock, db: Database) =>
   async (
     userData: CreateUserData,
   ): Promise<Result<User, CreateUserError>> => {
     const user = {
       id: crypto.randomUUID(),
       ...userData,
       createdAt: clock.now(),
     };
     return await db.save(user);
   };
   ```

---

## Resources and References

- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [ts-pattern - Pattern Matching Library](https://github.com/gvergnaud/ts-pattern)
- [Deno Standard Library](https://deno.land/std)
- [Functional Programming Concepts](https://en.wikipedia.org/wiki/Functional_programming)

---

_This guide is living documentation. Update it as patterns evolve and new
practices emerge._
