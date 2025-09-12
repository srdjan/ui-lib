// Todo App API - Full CRUD operations with validation and error handling
// Demonstrates proper backend architecture with ui-lib integration

import { Alert, h, renderToString } from "../../mod-simple.ts";
import { Todo, TodoFilter, TodoItem, TodoList } from "./components.tsx";

// ✨ Light FP: Result type for error handling
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const ok = <T,>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E,>(error: E): Result<never, E> => ({ ok: false, error });

// ✨ Light FP: Domain-specific error types
export type DatabaseError =
  | { readonly type: "not_found"; readonly entity: string; readonly id: string }
  | {
    readonly type: "validation_error";
    readonly field: string;
    readonly message: string;
  }
  | {
    readonly type: "duplicate_key";
    readonly field: string;
    readonly value: string;
  };

// ✨ Light FP: Data types with readonly properties
export type CreateTodoData = {
  readonly userId: string;
  readonly text: string;
  readonly priority: "low" | "medium" | "high";
  readonly completed?: boolean;
};

export type UpdateTodoData = {
  readonly text?: string;
  readonly priority?: "low" | "medium" | "high";
  readonly completed?: boolean;
};

export type TodoStats = {
  readonly total: number;
  readonly active: number;
  readonly completed: number;
};

// ✨ Light FP: Port interface for TodoRepository capability
export interface TodoRepository {
  readonly getUsers: () => Result<readonly string[], DatabaseError>;
  readonly getAll: (userId: string) => Result<readonly Todo[], DatabaseError>;
  readonly getById: (id: string) => Result<Todo | null, DatabaseError>;
  readonly create: (todoData: CreateTodoData) => Result<Todo, DatabaseError>;
  readonly update: (
    id: string,
    updates: UpdateTodoData,
  ) => Result<Todo, DatabaseError>;
  readonly delete: (id: string) => Result<boolean, DatabaseError>;
  readonly filter: (
    filter: TodoFilter,
    userId: string,
  ) => Result<readonly Todo[], DatabaseError>;
  readonly getStats: (userId: string) => Result<TodoStats, DatabaseError>;
}

// ✨ Light FP: Pure validation functions
const validateTodoData = (
  data: CreateTodoData,
): Result<CreateTodoData, DatabaseError> => {
  if (!data.text.trim()) {
    return err({
      type: "validation_error",
      field: "text",
      message: "Todo text cannot be empty",
    });
  }
  if (data.text.length > 500) {
    return err({
      type: "validation_error",
      field: "text",
      message: "Todo text cannot exceed 500 characters",
    });
  }
  if (!data.userId.trim()) {
    return err({
      type: "validation_error",
      field: "userId",
      message: "User ID is required",
    });
  }
  return ok(data);
};

const validateUpdateData = (
  data: UpdateTodoData,
): Result<UpdateTodoData, DatabaseError> => {
  if (data.text !== undefined && !data.text.trim()) {
    return err({
      type: "validation_error",
      field: "text",
      message: "Todo text cannot be empty",
    });
  }
  if (data.text !== undefined && data.text.length > 500) {
    return err({
      type: "validation_error",
      field: "text",
      message: "Todo text cannot exceed 500 characters",
    });
  }
  return ok(data);
};

// ✨ Light FP: Pure helper functions
const sortTodosByCreatedAt = (todos: readonly Todo[]): readonly Todo[] =>
  [...todos].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

const filterTodosByUser = (
  todos: readonly Todo[],
  userId: string,
): readonly Todo[] => todos.filter((t) => t.userId === userId);

const filterTodosByStatus = (
  todos: readonly Todo[],
  status: TodoFilter["status"],
): readonly Todo[] => {
  if (status === "active") return todos.filter((t) => !t.completed);
  if (status === "completed") return todos.filter((t) => t.completed);
  return todos;
};

const filterTodosByPriority = (
  todos: readonly Todo[],
  priority?: string,
): readonly Todo[] =>
  priority ? todos.filter((t) => t.priority === priority) : todos;

const calculateStats = (todos: readonly Todo[]): TodoStats => ({
  total: todos.length,
  active: todos.filter((t) => !t.completed).length,
  completed: todos.filter((t) => t.completed).length,
});

// ✨ Light FP: Functional TodoRepository implementation
export const createInMemoryTodoRepository = (): TodoRepository => {
  // Local mutation inside function for performance (allowed in Light FP)
  const todos = new Map<string, Todo>();
  const users = ["alice", "bob", "charlie"];

  // Seed initial data
  const seedData: readonly Todo[] = [
    {
      id: "1",
      userId: "alice",
      text: "Build an awesome todo app with ui-lib",
      completed: false,
      createdAt: new Date().toISOString(),
      priority: "high",
    },
    {
      id: "2",
      userId: "alice",
      text: "Learn HTMX for seamless interactions",
      completed: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      priority: "medium",
    },
    {
      id: "3",
      userId: "bob",
      text: "Deploy to production",
      completed: false,
      createdAt: new Date().toISOString(),
      priority: "low",
    },
  ];

  seedData.forEach((todo) => todos.set(todo.id, todo));

  return {
    getUsers: () => ok([...users]),

    getAll: (userId: string) => {
      const allTodos = Array.from(todos.values());
      const userTodos = filterTodosByUser(allTodos, userId);
      const sortedTodos = sortTodosByCreatedAt(userTodos);
      return ok(sortedTodos);
    },

    getById: (id: string) => {
      const todo = todos.get(id);
      return ok(todo || null);
    },

    create: (todoData: CreateTodoData) => {
      const validation = validateTodoData(todoData);
      if (!validation.ok) return validation;

      const todo: Todo = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...validation.value,
        completed: validation.value.completed ?? false,
      };

      todos.set(todo.id, todo);
      return ok(todo);
    },

    update: (id: string, updates: UpdateTodoData) => {
      const validation = validateUpdateData(updates);
      if (!validation.ok) return validation;

      const existingTodo = todos.get(id);
      if (!existingTodo) {
        return err({ type: "not_found", entity: "todo", id });
      }

      const updatedTodo = { ...existingTodo, ...validation.value };
      todos.set(id, updatedTodo);
      return ok(updatedTodo);
    },

    delete: (id: string) => {
      const existed = todos.has(id);
      if (!existed) {
        return err({ type: "not_found", entity: "todo", id });
      }
      todos.delete(id);
      return ok(true);
    },

    filter: (filter: TodoFilter, userId: string) => {
      const allTodos = Array.from(todos.values());
      const userTodos = filterTodosByUser(allTodos, userId);
      let filtered = userTodos;
      filtered = filterTodosByStatus(filtered, filter.status);
      filtered = filterTodosByPriority(filtered, filter.priority);
      const sortedFiltered = sortTodosByCreatedAt(filtered);

      return ok(sortedFiltered);
    },

    getStats: (userId: string) => {
      const allTodos = Array.from(todos.values());
      const userTodos = filterTodosByUser(allTodos, userId);
      const stats = calculateStats(userTodos);
      return ok(stats);
    },
  };
};

// ✨ Light FP: Dependency injection - create repository instance
const todoRepository = createInMemoryTodoRepository();

// ✨ Light FP: Result helper functions
const mapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => result.ok ? ok(fn(result.value)) : result;

const flatMapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => result.ok ? fn(result.value) : result;

// API Response helpers
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function htmlResponse(html: string, status = 200) {
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html" },
  });
}

// ✨ Light FP: Pure response helper functions
const errorResponse = (message: string, status = 400): Response =>
  htmlResponse(
    renderToString(
      <Alert variant="error" title="Error">
        {message}
      </Alert>,
    ),
    status,
  );

const handleDatabaseError = (error: DatabaseError): Response => {
  switch (error.type) {
    case "not_found":
      return errorResponse(
        `${error.entity} with ID ${error.id} not found`,
        404,
      );
    case "validation_error":
      return errorResponse(`${error.field}: ${error.message}`, 400);
    case "duplicate_key":
      return errorResponse(
        `${error.field} '${error.value}' already exists`,
        409,
      );
    default:
      return errorResponse("An unexpected error occurred", 500);
  }
};

// API Handlers
export const todoAPI = {
  // GET /api/todos - List todos with filtering
  async listTodos(req: Request): Promise<Response> {
    const url = new URL(req.url);
    // Get users and default to first user
    const usersResult = todoRepository.getUsers();
    if (!usersResult.ok) return handleDatabaseError(usersResult.error);

    const userId = url.searchParams.get("user") || usersResult.value[0];
    const status = (url.searchParams.get("status") as TodoFilter["status"]) ||
      "all";
    const priority =
      (url.searchParams.get("priority") as TodoFilter["priority"]) || undefined;

    const filter: TodoFilter = { status, priority };

    // Get filtered todos
    const todosResult = todoRepository.filter(filter, userId);
    if (!todosResult.ok) return handleDatabaseError(todosResult.error);

    // Get stats
    const statsResult = todoRepository.getStats(userId);
    if (!statsResult.ok) return handleDatabaseError(statsResult.error);

    // Return HTML for HTMX requests
    const acceptsHtml = req.headers.get("hx-request") ||
      req.headers.get("accept")?.includes("text/html");

    if (acceptsHtml) {
      return htmlResponse(
        renderToString(
          <TodoList todos={todosResult.value as Todo[]} filter={filter} />,
        ),
      );
    }

    // Return JSON for API requests
    return jsonResponse({
      userId,
      todos: todosResult.value,
      filter,
      stats: statsResult.value,
    });
  },

  // POST /api/todos - Create new todo
  async createTodo(req: Request): Promise<Response> {
    try {
      const formData = await req.formData();

      // Get users and default to first user
      const usersResult = todoRepository.getUsers();
      if (!usersResult.ok) return handleDatabaseError(usersResult.error);

      const userId = (formData.get("user") as string) || usersResult.value[0];
      const todoData: CreateTodoData = {
        userId,
        text: (formData.get("text") as string) || "",
        priority: (formData.get("priority") as "low" | "medium" | "high") ||
          "medium",
        completed: false,
      };

      // Create todo using functional repository
      const createResult = todoRepository.create(todoData);
      if (!createResult.ok) return handleDatabaseError(createResult.error);

      // Return updated todo list for HTMX
      const todosResult = todoRepository.getAll(userId);
      if (!todosResult.ok) return handleDatabaseError(todosResult.error);

      const filter: TodoFilter = { status: "all" };

      return htmlResponse(
        renderToString(
          <TodoList todos={todosResult.value as Todo[]} filter={filter} />,
        ),
      );
    } catch (error) {
      console.error("Error creating todo:", error);
      return errorResponse("Failed to create todo");
    }
  },

  // PUT /api/todos/:id - Update todo
  async updateTodo(req: Request, params: { id: string }): Promise<Response> {
    try {
      const formData = await req.formData();

      // Get existing todo to determine userId
      const todoResult = todoRepository.getById(params.id);
      if (!todoResult.ok) return handleDatabaseError(todoResult.error);

      if (!todoResult.value) {
        return errorResponse("Todo not found", 404);
      }

      const updateData: UpdateTodoData = {
        text: (formData.get("text") as string)?.trim(),
        priority: formData.get("priority") as "low" | "medium" | "high",
      };

      // Update todo using functional repository
      const updateResult = todoRepository.update(params.id, updateData);
      if (!updateResult.ok) return handleDatabaseError(updateResult.error);

      // Return updated todo list
      const todosResult = todoRepository.getAll(todoResult.value.userId);
      if (!todosResult.ok) return handleDatabaseError(todosResult.error);

      const filter: TodoFilter = { status: "all" };

      return htmlResponse(
        renderToString(
          <TodoList todos={todosResult.value as Todo[]} filter={filter} />,
        ),
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      return errorResponse("Failed to update todo");
    }
  },

  // POST /api/todos/:id/toggle - Toggle completion status
  async toggleTodo(req: Request, params: { id: string }): Promise<Response> {
    // Get existing todo
    const todoResult = todoRepository.getById(params.id);
    if (!todoResult.ok) return handleDatabaseError(todoResult.error);

    if (!todoResult.value) {
      return errorResponse("Todo not found", 404);
    }

    // Toggle completion status
    const updateResult = todoRepository.update(params.id, {
      completed: !todoResult.value.completed,
    });
    if (!updateResult.ok) return handleDatabaseError(updateResult.error);

    // Return just the updated todo item
    return htmlResponse(
      renderToString(<TodoItem todo={updateResult.value} />),
    );
  },

  // DELETE /api/todos/:id - Delete todo
  async deleteTodo(req: Request, params: { id: string }): Promise<Response> {
    const deleteResult = todoRepository.delete(params.id);
    if (!deleteResult.ok) return handleDatabaseError(deleteResult.error);

    // Return empty response - HTMX will remove the element
    return new Response("", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  },

  // POST /api/todos/clear-completed - Bulk delete completed todos
  async clearCompleted(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Get users and default to first user
    const usersResult = todoRepository.getUsers();
    if (!usersResult.ok) return handleDatabaseError(usersResult.error);

    const userId = url.searchParams.get("user") || usersResult.value[0];

    // Get completed todos
    const completedResult = todoRepository.filter(
      { status: "completed" },
      userId,
    );
    if (!completedResult.ok) return handleDatabaseError(completedResult.error);

    let deletedCount = 0;

    // Delete each completed todo
    for (const todo of completedResult.value) {
      const deleteResult = todoRepository.delete(todo.id);
      if (deleteResult.ok) {
        deletedCount++;
      }
    }

    // Return updated todo list
    const todosResult = todoRepository.getAll(userId);
    if (!todosResult.ok) return handleDatabaseError(todosResult.error);

    const filter: TodoFilter = { status: "all" };

    return htmlResponse(
      renderToString(
        <TodoList todos={todosResult.value as Todo[]} filter={filter} />,
      ),
    );
  },

  // GET /api/todos/stats - Get todo statistics
  async getStats(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Get users and default to first user
    const usersResult = todoRepository.getUsers();
    if (!usersResult.ok) return handleDatabaseError(usersResult.error);

    const userId = url.searchParams.get("user") || usersResult.value[0];

    // Get stats
    const statsResult = todoRepository.getStats(userId);
    if (!statsResult.ok) return handleDatabaseError(statsResult.error);

    return jsonResponse(statsResult.value);
  },
};

// ✨ Light FP: Backward compatibility adapter for servers
// This maintains the old interface while using the new functional repository internally
export const todoDatabase = {
  getUsers: () => {
    const result = todoRepository.getUsers();
    return result.ok ? result.value : [];
  },

  getAll: (userId: string) => {
    const result = todoRepository.getAll(userId);
    return result.ok ? result.value as Todo[] : [];
  },

  getById: (id: string) => {
    const result = todoRepository.getById(id);
    return result.ok ? result.value : undefined;
  },

  filter: (filter: TodoFilter, userId: string) => {
    const result = todoRepository.filter(filter, userId);
    return result.ok ? result.value as Todo[] : [];
  },

  getStats: (userId: string) => {
    const result = todoRepository.getStats(userId);
    return result.ok ? result.value : { total: 0, active: 0, completed: 0 };
  },

  // Note: These methods are not used by servers, only by API handlers
  create: (data: any) => {
    throw new Error("Use todoAPI.createTodo instead");
  },

  update: (id: string, data: any) => {
    throw new Error("Use todoAPI.updateTodo instead");
  },

  delete: (id: string) => {
    throw new Error("Use todoAPI.deleteTodo instead");
  },
};
