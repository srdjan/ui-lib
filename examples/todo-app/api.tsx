// Todo App API - Full CRUD operations with validation and error handling
// Demonstrates proper backend architecture with ui-lib integration

import { Alert, h, renderToString } from "../../mod-simple.ts";
import { Todo, TodoFilter, TodoItem, TodoList } from "./components.tsx";

// In-memory database (in real app, use Deno KV or PostgreSQL)
class TodoDatabase {
  private todos = new Map<string, Todo>();
  private users: string[] = ["alice", "bob", "charlie"];

  constructor() {
    // Seed with some initial data
    this.seed();
  }

  getUsers(): string[] {
    return [...this.users];
  }

  private seed() {
    const sampleTodos: Todo[] = [
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

    sampleTodos.forEach((todo) => this.todos.set(todo.id, todo));
  }

  getAll(userId: string): Todo[] {
    return Array.from(this.todos.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  getById(id: string): Todo | undefined {
    return this.todos.get(id);
  }

  create(todoData: Omit<Todo, "id" | "createdAt">): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...todoData,
    };

    this.todos.set(todo.id, todo);
    return todo;
  }

  update(id: string, updates: Partial<Todo>): Todo | null {
    const todo = this.todos.get(id);
    if (!todo) return null;

    const updated = { ...todo, ...updates };
    this.todos.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.todos.delete(id);
  }

  filter(filter: TodoFilter, userId: string): Todo[] {
    let todos = this.getAll(userId);

    // Filter by completion status
    if (filter.status === "active") {
      todos = todos.filter((t) => !t.completed);
    } else if (filter.status === "completed") {
      todos = todos.filter((t) => t.completed);
    }

    // Filter by priority
    if (filter.priority) {
      todos = todos.filter((t) => t.priority === filter.priority);
    }

    return todos;
  }

  getStats(userId: string) {
    const all = this.getAll(userId);
    return {
      total: all.length,
      active: all.filter((t) => !t.completed).length,
      completed: all.filter((t) => t.completed).length,
    };
  }
}

// Global database instance
const db = new TodoDatabase();

// Validation helpers
function validateTodoData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (
    !data.text || typeof data.text !== "string" || data.text.trim().length === 0
  ) {
    errors.push("Todo text is required");
  }

  if (data.text && data.text.length > 500) {
    errors.push("Todo text cannot exceed 500 characters");
  }

  if (!data.priority || !["low", "medium", "high"].includes(data.priority)) {
    errors.push("Priority must be low, medium, or high");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

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

function errorResponse(message: string, status = 400) {
  return htmlResponse(
    renderToString(
      <Alert
        variant="error"
        title="Error"
      >
        {message}
      </Alert>,
    ),
    status,
  );
}

// API Handlers
export const todoAPI = {
  // GET /api/todos - List todos with filtering
  async listTodos(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user") || db.getUsers()[0];
    const status = (url.searchParams.get("status") as TodoFilter["status"]) ||
      "all";
    const priority =
      (url.searchParams.get("priority") as TodoFilter["priority"]) || undefined;

    const filter: TodoFilter = { status, priority };
    const todos = db.filter(filter, userId);
    const stats = db.getStats(userId);

    // Return HTML for HTMX requests
    const acceptsHtml = req.headers.get("hx-request") ||
      req.headers.get("accept")?.includes("text/html");

    if (acceptsHtml) {
      return htmlResponse(
        renderToString(<TodoList todos={todos} filter={filter} />),
      );
    }

    // Return JSON for API requests
    return jsonResponse({ userId, todos, filter, stats });
  },

  // POST /api/todos - Create new todo
  async createTodo(req: Request): Promise<Response> {
    try {
      const formData = await req.formData();
      const userId = (formData.get("user") as string) || db.getUsers()[0];
      const data = {
        text: formData.get("text") as string,
        priority: formData.get("priority") as "low" | "medium" | "high",
        completed: false,
      };

      const validation = validateTodoData(data);
      if (!validation.valid) {
        return errorResponse(validation.errors.join(", "));
      }

      const todo = db.create({
        userId,
        text: data.text.trim(),
        priority: data.priority,
        completed: false,
      });

      // Return updated todo list for HTMX
      const todos = db.getAll(userId);
      const filter: TodoFilter = { status: "all" };

      return htmlResponse(
        renderToString(<TodoList todos={todos} filter={filter} />),
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
      const userId = (formData.get("user") as string) ||
        db.getById(params.id)?.userId || db.getUsers()[0];
      const data = {
        text: formData.get("text") as string,
        priority: formData.get("priority") as "low" | "medium" | "high",
      };

      const validation = validateTodoData({ ...data, completed: false });
      if (!validation.valid) {
        return errorResponse(validation.errors.join(", "));
      }

      const updated = db.update(params.id, {
        text: data.text.trim(),
        priority: data.priority,
      });

      if (!updated) {
        return errorResponse("Todo not found", 404);
      }

      // Return updated todo list
      const todos = db.getAll(userId);
      const filter: TodoFilter = { status: "all" };

      return htmlResponse(
        renderToString(<TodoList todos={todos} filter={filter} />),
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      return errorResponse("Failed to update todo");
    }
  },

  // POST /api/todos/:id/toggle - Toggle completion status
  async toggleTodo(req: Request, params: { id: string }): Promise<Response> {
    const todo = db.getById(params.id);
    if (!todo) {
      return errorResponse("Todo not found", 404);
    }

    const updated = db.update(params.id, {
      completed: !todo.completed,
    });

    if (!updated) {
      return errorResponse("Failed to update todo");
    }

    // Return just the updated todo item
    return htmlResponse(
      renderToString(<TodoItem todo={updated} />),
    );
  },

  // DELETE /api/todos/:id - Delete todo
  async deleteTodo(req: Request, params: { id: string }): Promise<Response> {
    const deleted = db.delete(params.id);

    if (!deleted) {
      return errorResponse("Todo not found", 404);
    }

    // Return empty response - HTMX will remove the element
    return new Response("", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  },

  // POST /api/todos/clear-completed - Bulk delete completed todos
  async clearCompleted(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user") || db.getUsers()[0];
    const completed = db.filter({ status: "completed" }, userId);
    let deletedCount = 0;

    completed.forEach((todo) => {
      if (db.delete(todo.id)) {
        deletedCount++;
      }
    });

    // Return updated todo list
    const todos = db.getAll(userId);
    const filter: TodoFilter = { status: "all" };

    return htmlResponse(
      renderToString(<TodoList todos={todos} filter={filter} />),
    );
  },

  // GET /api/todos/stats - Get todo statistics
  async getStats(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user") || db.getUsers()[0];
    const stats = db.getStats(userId);
    return jsonResponse(stats);
  },
};

// Export database for testing
export { db as todoDatabase };
