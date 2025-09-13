/** @jsx h */

/**
 * Todo API Handlers
 * Request handlers for todo operations
 */

import { h } from "../../../lib/simple.tsx";
import { Alert, renderToString } from "../../../mod-simple.ts";
import { TodoItem, TodoList } from "../components/index.ts";
import type {
  CreateTodoData,
  DatabaseError,
  Todo,
  TodoFilter,
  UpdateTodoData,
} from "./types.ts";
import { todoRepository } from "./repository.ts";

// Response helpers
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

// Error response helpers
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