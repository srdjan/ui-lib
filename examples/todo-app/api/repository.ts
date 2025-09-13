/**
 * Todo Repository
 * Data layer with functional error handling
 */

import type {
  CreateTodoData,
  DatabaseError,
  Todo,
  TodoFilter,
  TodoStats,
  UpdateTodoData,
} from "./types.ts";
import { err, ok, type Result } from "../utils/result.ts";

// Port interface for TodoRepository capability
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

// Pure validation functions
export const validateTodoData = (
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

export const validateUpdateData = (
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

// Pure helper functions
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

export const calculateStats = (todos: readonly Todo[]): TodoStats => ({
  total: todos.length,
  active: todos.filter((t) => !t.completed).length,
  completed: todos.filter((t) => t.completed).length,
});

// Functional TodoRepository implementation
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

// Create singleton repository instance
export const todoRepository = createInMemoryTodoRepository();

// Backward compatibility adapter for existing code
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
};