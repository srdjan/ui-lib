/**
 * Todo API
 * Export all API functionality
 */

export type {
  CreateTodoData,
  DatabaseError,
  Todo,
  TodoFilter,
  TodoStats,
  UpdateTodoData,
} from "./types.ts";

export {
  calculateStats,
  createInMemoryTodoRepository,
  todoDatabase,
  todoRepository,
  type TodoRepository,
  validateTodoData,
  validateUpdateData,
} from "./repository.ts";

export { todoAPI } from "./handlers.tsx";