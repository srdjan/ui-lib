# GEMINI Code Assistant Context

This document provides context for the Gemini code assistant to understand the
`funcwc` project.

## Project Overview

`funcwc` is a lightweight, functional programming library for building
server-side rendered (SSR) web components using Deno and TypeScript. It
emphasizes an SSR-only approach, meaning no JavaScript is sent to the browser
for component rendering. The library provides a simple and elegant Pipeline API
for defining components, managing state, and handling user actions, all on the
server.

The core of the library is a tagged template literal `html` for creating safe,
escaped HTML strings. It also supports a JSX-based pipeline API, which is
currently being redesigned and is considered experimental.

The project is built and managed with Deno, using `deno.json` for task
definitions and dependency management.

## Building and Running

The project uses Deno tasks for common development operations. The key commands
are defined in `deno.json`:

- **`deno task start`**: Type-checks the code and starts the development server.
  This is the recommended command for development.
- **`deno task serve`**: Starts the development server, which serves the example
  application on `http://localhost:8080`.
- **`deno task test`**: Runs the test suite.
- **`deno task fmt`**: Formats the code according to the project's style
  guidelines.
- **`deno task lint`**: Lints the code to catch potential errors and style
  issues.
- **`deno task coverage`**: Generates a test coverage report.
- **`deno task check`**: Type-checks the project's TypeScript files.

## Development Conventions

- **Functional Programming**: The library encourages a functional programming
  style with pure functions, immutable state, and composition over inheritance.
- **SSR-Only**: Components are rendered on the server, and only HTML is sent to
  the browser. Client-side JavaScript for component logic is intentionally
  avoided in the primary architecture.
- **Deno Native**: The project is built to be used with Deno and leverages
  Deno's features, such as the built-in test runner, formatter, and linter.
- **TypeScript**: The entire codebase is written in TypeScript, with a focus on
  strong typing and type inference.
- **File Structure**:
  - `src/`: Contains the core library code.
  - `src/lib/`: Contains the individual modules of the library.
  - `examples/`: Contains example usage of the library.
  - `deno.json`: Defines the project's tasks and dependencies.
  - `tsconfig.json`: Configures the TypeScript compiler.
- **Styling**: The library is unopinionated about styling. Examples use plain
  CSS.
- **Testing**: Tests are written using the Deno testing API and are located in
  files ending with `.test.ts`.
