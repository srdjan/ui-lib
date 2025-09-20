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
  type TodoRepository,
  validateTodoData,
  validateUpdateData,
} from "./repository.ts";

export { createKvTodoRepository, seedKvDatabase } from "./kv-repository.ts";

export {
  ensureRepository,
  getRepository,
  getRepositoryType,
  initializeRepository,
} from "./repository-factory.ts";

export { todoAPI } from "./handlers.tsx";
