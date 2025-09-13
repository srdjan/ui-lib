/**
 * Todo App Type Definitions
 * Shared types for the todo application
 */

// Core data model
export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

// Filter configuration
export interface TodoFilter {
  status: "all" | "active" | "completed";
  priority?: "low" | "medium" | "high";
}

// Statistics
export type TodoStats = {
  readonly total: number;
  readonly active: number;
  readonly completed: number;
};

// Data transfer objects
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

// Error types for functional error handling
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