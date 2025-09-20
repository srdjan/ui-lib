/** @jsx h */

/**
 * Todo API Handlers
 * Request handlers for todo operations
 */

import { Item } from "../../../lib/components/data-display/item.ts";
import { getRepository } from "./repository-factory.ts";
import {
  errorResponse,
  handleDatabaseError,
  htmlResponse,
  jsonResponse,
} from "./response.tsx";
import type { CreateTodoData, TodoFilter, UpdateTodoData } from "./types.ts";

// Helper functions to convert todos to generic components
function todoToItem(todo: any): string {
  return Item({
    id: todo.id,
    title: todo.text,
    completed: todo.completed,
    priority: todo.priority,
    timestamp: new Date(todo.createdAt).toLocaleDateString(),
    badges: [{ text: todo.priority, variant: getPriorityVariant(todo.priority) }],
    icon: `<input type="checkbox" ${todo.completed ? 'checked' : ''} />`,
    actions: [
      { text: "Edit", action: `editTodo('${todo.id}')` },
      { text: "Delete", variant: "danger", action: `deleteTodo('${todo.id}')` },
    ],
  });
}

function getPriorityVariant(priority: string): string {
  switch (priority) {
    case "high": return "danger";
    case "medium": return "warning";
    case "low": return "success";
    default: return "neutral";
  }
}

function todosToList(todos: readonly any[]): string {
  if (todos.length === 0) {
    return `<div style="text-align: center; padding: 2rem; color: #6b7280;">
      <p>No todos found. Add some todos to get started!</p>
    </div>`;
  }

  return `<div style="display: flex; flex-direction: column; gap: 1rem;">
    ${todos.map(todoToItem).join("")}
  </div>`;
}

// Moved shared response helpers to ./response.ts

// API Handlers
export const todoAPI = {
  // GET /api/todos - List todos with filtering
  async listTodos(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const repository = getRepository();

    // Get users and default to first user
    const usersResult = await repository.getUsers();
    if (!usersResult.ok) return handleDatabaseError(usersResult.error);

    const userId = url.searchParams.get("user") || usersResult.value[0];
    const status = (url.searchParams.get("status") as TodoFilter["status"]) ||
      "all";
    const priority =
      (url.searchParams.get("priority") as TodoFilter["priority"]) || undefined;

    const filter: TodoFilter = { status, priority };

    // Get filtered todos
    const todosResult = await repository.filter(filter, userId);
    if (!todosResult.ok) return handleDatabaseError(todosResult.error);

    // Get stats
    const statsResult = await repository.getStats(userId);
    if (!statsResult.ok) return handleDatabaseError(statsResult.error);

    // Return HTML for HTMX requests
    const acceptsHtml = req.headers.get("hx-request") ||
      req.headers.get("accept")?.includes("text/html");

    if (acceptsHtml) {
      return htmlResponse(
        todosToList(todosResult.value),
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
      const repository = getRepository();

      // Handle both JSON and form data
      let data: any;
      const contentType = req.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await req.json();
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        data = Object.fromEntries(formData.entries());
      } else {
        // Try form data as fallback
        const formData = await req.formData();
        data = Object.fromEntries(formData.entries());
      }

      // Get users and default to first user
      const usersResult = await repository.getUsers();
      if (!usersResult.ok) return handleDatabaseError(usersResult.error);

      const userId = data.user || usersResult.value[0];
      const todoData: CreateTodoData = {
        userId,
        text: data.text || "",
        priority: data.priority || "medium",
        completed: false,
      };

      // Create todo using functional repository
      const createResult = await repository.create(todoData);
      if (!createResult.ok) return handleDatabaseError(createResult.error);

      // Return updated todo list for HTMX
      const todosResult = await repository.getAll(userId);
      if (!todosResult.ok) return handleDatabaseError(todosResult.error);

      const filter: TodoFilter = { status: "all" };

      return htmlResponse(
        todosToList(todosResult.value),
      );
    } catch (error) {
      console.error("Error creating todo:", error);
      return errorResponse("Failed to create todo");
    }
  },

  // PUT /api/todos/:id - Update todo
  async updateTodo(req: Request, params: { id: string }): Promise<Response> {
    try {
      const repository = getRepository();
      const jsonData = await req.json();

      // Get existing todo to determine userId
      const todoResult = await repository.getById(params.id);
      if (!todoResult.ok) return handleDatabaseError(todoResult.error);

      if (!todoResult.value) {
        return errorResponse("Todo not found", 404);
      }

      const updateData: UpdateTodoData = {
        text: jsonData.text?.trim(),
        priority: jsonData.priority,
      };

      // Update todo using functional repository
      const updateResult = await repository.update(params.id, updateData);
      if (!updateResult.ok) return handleDatabaseError(updateResult.error);

      // Return updated todo list
      const todosResult = await repository.getAll(todoResult.value.userId);
      if (!todosResult.ok) return handleDatabaseError(todosResult.error);

      const filter: TodoFilter = { status: "all" };

      return htmlResponse(
        todosToList(todosResult.value),
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      return errorResponse("Failed to update todo");
    }
  },

  // POST /api/todos/:id/toggle - Toggle completion status
  async toggleTodo(req: Request, params: { id: string }): Promise<Response> {
    const repository = getRepository();

    // Get existing todo
    const todoResult = await repository.getById(params.id);
    if (!todoResult.ok) return handleDatabaseError(todoResult.error);

    if (!todoResult.value) {
      return errorResponse("Todo not found", 404);
    }

    // Toggle completion status
    const updateResult = await repository.update(params.id, {
      completed: !todoResult.value.completed,
    });
    if (!updateResult.ok) return handleDatabaseError(updateResult.error);

    // Return just the updated todo item
    return htmlResponse(
      todoToItem(updateResult.value),
    );
  },

  // DELETE /api/todos/:id - Delete todo
  async deleteTodo(req: Request, params: { id: string }): Promise<Response> {
    const repository = getRepository();
    const deleteResult = await repository.delete(params.id);
    if (!deleteResult.ok) return handleDatabaseError(deleteResult.error);

    // Return updated todo list like other operations
    const url = new URL(req.url);

    // Get users and default to first user
    const usersResult = await repository.getUsers();
    if (!usersResult.ok) return handleDatabaseError(usersResult.error);

    const userId = url.searchParams.get("user") || usersResult.value[0];
    const status = (url.searchParams.get("status") as TodoFilter["status"]) || "all";
    const priority = (url.searchParams.get("priority") as TodoFilter["priority"]) || undefined;

    const filter: TodoFilter = { status, priority };

    // Get filtered todos
    const todosResult = await repository.filter(filter, userId);
    if (!todosResult.ok) return handleDatabaseError(todosResult.error);

    // Get stats
    const statsResult = await repository.getStats(userId);
    if (!statsResult.ok) return handleDatabaseError(statsResult.error);

    return htmlResponse(
      todosToList(todosResult.value)
    );
  },

  // POST /api/todos/clear-completed - Bulk delete completed todos
  async clearCompleted(req: Request): Promise<Response> {
    const repository = getRepository();
    const url = new URL(req.url);

    // Get users and default to first user
    const usersResult = await repository.getUsers();
    if (!usersResult.ok) return handleDatabaseError(usersResult.error);

    const userId = url.searchParams.get("user") || usersResult.value[0];

    // Get completed todos
    const completedResult = await repository.filter(
      { status: "completed" },
      userId,
    );
    if (!completedResult.ok) return handleDatabaseError(completedResult.error);

    let deletedCount = 0;

    // Delete each completed todo
    for (const todo of completedResult.value) {
      const deleteResult = await repository.delete(todo.id);
      if (deleteResult.ok) {
        deletedCount++;
      }
    }

    // Return updated todo list
    const todosResult = await repository.getAll(userId);
    if (!todosResult.ok) return handleDatabaseError(todosResult.error);

    const filter: TodoFilter = { status: "all" };

    return htmlResponse(
      todosToList(todosResult.value),
    );
  },

  // GET /api/todos/stats - Get todo statistics
  async getStats(req: Request): Promise<Response> {
    const repository = getRepository();
    const url = new URL(req.url);

    // Get users and default to first user
    const usersResult = await repository.getUsers();
    if (!usersResult.ok) return handleDatabaseError(usersResult.error);

    const userId = url.searchParams.get("user") || usersResult.value[0];

    // Get stats
    const statsResult = await repository.getStats(userId);
    if (!statsResult.ok) return handleDatabaseError(statsResult.error);

    return jsonResponse(statsResult.value);
  },
};
