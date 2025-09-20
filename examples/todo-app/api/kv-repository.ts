/**
 * Deno KV Todo Repository
 * Persistent data layer using Deno KV with functional error handling
 */

import { err, ok, type Result } from "../../../lib/result.ts";
import type { TodoRepository } from "./repository.ts";
import {
  calculateStats,
  validateTodoData,
  validateUpdateData,
} from "./repository.ts";
import type {
  CreateTodoData,
  DatabaseError,
  Todo,
  TodoFilter,
  TodoStats,
  UpdateTodoData,
} from "./types.ts";

// KV Key Structure:
// ["todos", userId, todoId] -> Todo
// ["users", userId] -> { id: string, createdAt: string }
// ["stats", userId] -> TodoStats (cached)
// ["todo_ids", userId] -> string[] (for efficient listing)

// User data type for KV storage
type UserData = {
  readonly id: string;
  readonly createdAt: string;
};

// Helper functions for KV operations
const createKvError = (operation: string, message: string): DatabaseError => ({
  type: "kv_operation_error",
  operation,
  message,
});

const createSerializationError = (
  message: string,
  data?: unknown,
): DatabaseError => ({
  type: "kv_serialization_error",
  message,
  data,
});

// Pure helper functions (reused from in-memory implementation)
const sortTodosByCreatedAt = (todos: readonly Todo[]): readonly Todo[] =>
  [...todos].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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

// Deno KV TodoRepository implementation
// Seed data function
export const seedKvDatabase = async (
  kv: Deno.Kv,
): Promise<Result<void, DatabaseError>> => {
  try {
    // Check if data already exists
    const existingTodo = await kv.get(["todos", "alice", "1"]);
    if (existingTodo.value) {
      // Data already seeded
      return ok(undefined);
    }

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

    // Store todos
    for (const todo of seedData) {
      await kv.set(["todos", todo.userId, todo.id], todo);
    }

    // Store users
    const users = ["alice", "bob", "charlie"];
    for (const userId of users) {
      const userData: UserData = {
        id: userId,
        createdAt: new Date().toISOString(),
      };
      await kv.set(["users", userId], userData);
    }

    // Calculate and store initial stats
    for (const userId of users) {
      const userTodos = seedData.filter((t) => t.userId === userId);
      const stats = calculateStats(userTodos);
      await kv.set(["stats", userId], stats);
    }

    return ok(undefined);
  } catch (error) {
    return err(
      createKvError(
        "seedDatabase",
        `Failed to seed database: ${error.message}`,
      ),
    );
  }
};

export const createKvTodoRepository = async (): Promise<
  Result<TodoRepository, DatabaseError>
> => {
  let kv: Deno.Kv;

  try {
    kv = await Deno.openKv();

    // Seed initial data if needed
    const seedResult = await seedKvDatabase(kv);
    if (!seedResult.ok) {
      return seedResult;
    }
  } catch (error) {
    return err({
      type: "kv_connection_error",
      message: `Failed to open KV database: ${error.message}`,
    });
  }

  // Helper to get all todos for a user
  const getAllTodosForUser = async (
    userId: string,
  ): Promise<Result<readonly Todo[], DatabaseError>> => {
    try {
      const todos: Todo[] = [];
      const iter = kv.list<Todo>({ prefix: ["todos", userId] });

      for await (const entry of iter) {
        if (entry.value) {
          todos.push(entry.value);
        }
      }

      return ok(sortTodosByCreatedAt(todos));
    } catch (error) {
      return err(
        createKvError(
          "getAllTodosForUser",
          `Failed to list todos: ${error.message}`,
        ),
      );
    }
  };

  // Helper to update cached stats
  const updateStats = async (
    userId: string,
  ): Promise<Result<TodoStats, DatabaseError>> => {
    const todosResult = await getAllTodosForUser(userId);
    if (!todosResult.ok) return todosResult;

    const stats = calculateStats(todosResult.value);

    try {
      await kv.set(["stats", userId], stats);
      return ok(stats);
    } catch (error) {
      return err(
        createKvError("updateStats", `Failed to cache stats: ${error.message}`),
      );
    }
  };

  return ok({
    getUsers: () => {
      // For now, return the same hardcoded users as the in-memory version
      // In a real app, this would query KV for actual users
      return ok(["alice", "bob", "charlie"] as const);
    },

    getAll: async (userId: string) => {
      return await getAllTodosForUser(userId);
    },

    getById: async (id: string) => {
      try {
        // We need to search across all users since we only have the todo ID
        // In a real app, you might maintain a separate index for this
        const users = ["alice", "bob", "charlie"];

        for (const userId of users) {
          const result = await kv.get<Todo>(["todos", userId, id]);
          if (result.value) {
            return ok(result.value);
          }
        }

        return ok(null);
      } catch (error) {
        return err(
          createKvError("getById", `Failed to get todo: ${error.message}`),
        );
      }
    },

    create: async (todoData: CreateTodoData) => {
      const validation = validateTodoData(todoData);
      if (!validation.ok) return validation;

      const todo: Todo = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...validation.value,
        completed: validation.value.completed ?? false,
      };

      try {
        // Store the todo
        await kv.set(["todos", todo.userId, todo.id], todo);

        // Ensure user exists
        const userKey = ["users", todo.userId];
        const existingUser = await kv.get<UserData>(userKey);
        if (!existingUser.value) {
          const userData: UserData = {
            id: todo.userId,
            createdAt: new Date().toISOString(),
          };
          await kv.set(userKey, userData);
        }

        // Update cached stats
        await updateStats(todo.userId);

        return ok(todo);
      } catch (error) {
        return err(
          createKvError("create", `Failed to create todo: ${error.message}`),
        );
      }
    },

    update: async (id: string, updates: UpdateTodoData) => {
      const validation = validateUpdateData(updates);
      if (!validation.ok) return validation;

      try {
        // Find the existing todo
        const users = ["alice", "bob", "charlie"];
        let existingTodo: Todo | null = null;
        let userId: string | null = null;

        for (const user of users) {
          const result = await kv.get<Todo>(["todos", user, id]);
          if (result.value) {
            existingTodo = result.value;
            userId = user;
            break;
          }
        }

        if (!existingTodo || !userId) {
          return err({ type: "not_found", entity: "todo", id });
        }

        const updatedTodo = { ...existingTodo, ...validation.value };

        // Update the todo
        await kv.set(["todos", userId, id], updatedTodo);

        // Update cached stats
        await updateStats(userId);

        return ok(updatedTodo);
      } catch (error) {
        return err(
          createKvError("update", `Failed to update todo: ${error.message}`),
        );
      }
    },

    delete: async (id: string) => {
      try {
        // Find and delete the todo
        const users = ["alice", "bob", "charlie"];
        let found = false;
        let userId: string | null = null;

        for (const user of users) {
          const result = await kv.get<Todo>(["todos", user, id]);
          if (result.value) {
            await kv.delete(["todos", user, id]);
            found = true;
            userId = user;
            break;
          }
        }

        if (!found) {
          return err({ type: "not_found", entity: "todo", id });
        }

        // Update cached stats
        if (userId) {
          await updateStats(userId);
        }

        return ok(true);
      } catch (error) {
        return err(
          createKvError("delete", `Failed to delete todo: ${error.message}`),
        );
      }
    },

    filter: async (filter: TodoFilter, userId: string) => {
      const todosResult = await getAllTodosForUser(userId);
      if (!todosResult.ok) return todosResult;

      let filtered = todosResult.value;
      filtered = filterTodosByStatus(filtered, filter.status);
      filtered = filterTodosByPriority(filtered, filter.priority);

      return ok(filtered);
    },

    getStats: async (userId: string) => {
      try {
        // Try to get cached stats first
        const cachedStats = await kv.get<TodoStats>(["stats", userId]);
        if (cachedStats.value) {
          return ok(cachedStats.value);
        }

        // If no cached stats, calculate and cache them
        return await updateStats(userId);
      } catch (error) {
        return err(
          createKvError("getStats", `Failed to get stats: ${error.message}`),
        );
      }
    },
  });
};
